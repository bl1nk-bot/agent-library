import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface FlowNode {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  content: string;
  type: string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string | null;
}

interface FlowEdge {
  source: string;
  target: string;
  label: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get the full flow graph for a prompt.
 * This traverses to find all connected prompts and returns the complete graph.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const prompt = await db.prompt.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, title: true, slug: true, isPrivate: true, authorId: true },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    // Helper to check if user can see a prompt
    const canSee = (p: { isPrivate: boolean; authorId: string }) =>
      !p.isPrivate || p.authorId === userId;

    const nodes: Map<string, FlowNode> = new Map();
    const edges: FlowEdge[] = [];
    const visited = new Set<string>();

    // BFS to find all connected nodes (both directions) using layer-by-layer batching
    let queue: string[] = [id];

    while (queue.length > 0) {
      // Get all unvisited node IDs in the current layer
      const unvisitedLayerIds = Array.from(new Set(queue.filter((nodeId) => !visited.has(nodeId))));

      // Clear the queue to build the next layer
      queue = [];

      if (unvisitedLayerIds.length === 0) continue;

      // Mark all layer nodes as visited before processing to prevent cycles
      for (const nodeId of unvisitedLayerIds) {
        visited.add(nodeId);
      }

      // Batch fetch nodes for the current layer
      const layerPrompts = await db.prompt.findMany({
        where: {
          id: { in: unvisitedLayerIds },
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          content: true,
          type: true,
          isPrivate: true,
          authorId: true,
          author: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });

      // Filter to prompts the user can see
      const visiblePrompts = layerPrompts.filter(canSee);
      const visiblePromptIds = visiblePrompts.map((p) => p.id);

      if (visiblePromptIds.length === 0) continue;

      for (const p of visiblePrompts) {
        nodes.set(p.id, {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          content: p.content,
          type: p.type,
          authorId: p.authorId,
          authorUsername: p.author.username,
          authorAvatar: p.author.avatar,
        });
      }

      // Batch fetch outgoing and incoming connections for visible nodes
      const [allOutgoing, allIncoming] = await Promise.all([
        db.promptConnection.findMany({
          where: {
            sourceId: { in: visiblePromptIds },
            label: { not: "related" },
            target: { deletedAt: null },
          },
          orderBy: { order: "asc" },
          include: {
            target: {
              select: { id: true, title: true, slug: true, isPrivate: true, authorId: true },
            },
          },
        }),
        db.promptConnection.findMany({
          where: {
            targetId: { in: visiblePromptIds },
            label: { not: "related" },
            source: { deletedAt: null },
          },
          orderBy: { order: "asc" },
          include: {
            source: {
              select: { id: true, title: true, slug: true, isPrivate: true, authorId: true },
            },
          },
        }),
      ]);

      // Process outgoing connections
      for (const conn of allOutgoing) {
        if (canSee(conn.target)) {
          edges.push({
            source: conn.sourceId,
            target: conn.targetId,
            label: conn.label,
          });
          if (!visited.has(conn.targetId)) {
            queue.push(conn.targetId);
          }
        }
      }

      // Process incoming connections
      for (const conn of allIncoming) {
        if (canSee(conn.source)) {
          // Only add edge if not already added
          const edgeExists = edges.some(
            (e) => e.source === conn.sourceId && e.target === conn.targetId
          );
          if (!edgeExists) {
            edges.push({
              source: conn.sourceId,
              target: conn.targetId,
              label: conn.label,
            });
          }
          if (!visited.has(conn.sourceId)) {
            queue.push(conn.sourceId);
          }
        }
      }
    }

    return NextResponse.json({
      nodes: Array.from(nodes.values()),
      edges,
      currentPromptId: id,
    });
  } catch (error) {
    console.error("Failed to fetch flow:", error);
    return NextResponse.json({ error: "Failed to fetch flow" }, { status: 500 });
  }
}
