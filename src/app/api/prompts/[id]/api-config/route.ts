import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const apiConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseUrl: z.string().url("Invalid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  headers: z.record(z.string()).optional(),
  queryParams: z.record(z.string()).optional(),
  bodySchema: z.any().optional(),
  responseSchema: z.any().optional(),
  authentication: z.any().optional(),
  testEndpoint: z.string().optional(),
  documentation: z.string().optional(),
});

/**
 * GET /api/prompts/[id]/api-config
 * Fetch all API configurations for a prompt
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify prompt exists
    const prompt = await db.prompt.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    // Fetch API configs
    const apiConfigs = await db.apiConfig.findMany({
      where: { promptId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(apiConfigs);
  } catch (error) {
    console.error("[v0] Error fetching API configs:", error);
    return NextResponse.json(
      { error: "Failed to fetch API configurations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/prompts/[id]/api-config
 * Create a new API configuration
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = apiConfigSchema.parse(body);

    // Verify prompt exists and user is the author
    const prompt = await db.prompt.findFirst({
      where: {
        id,
        authorId: session.user.id,
        deletedAt: null,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create API config
    const apiConfig = await db.apiConfig.create({
      data: {
        ...validatedData,
        promptId: id,
      },
    });

    return NextResponse.json(apiConfig, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[v0] Error creating API config:", error);
    return NextResponse.json(
      { error: "Failed to create API configuration" },
      { status: 500 }
    );
  }
}
