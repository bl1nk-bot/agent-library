import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiConfigSchema } from "@/lib/schemas/api-config";
import { z } from "zod";

/**
 * GET /api/prompts/[id]/api-config/[configId]
 * Fetch a single API configuration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; configId: string }> }
) {
  try {
    const { id, configId } = await params;

    const apiConfig = await db.apiConfig.findFirst({
      where: {
        id: configId,
        promptId: id,
      },
    });

    if (!apiConfig) {
      return NextResponse.json(
        { error: "API configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(apiConfig);
  } catch (error) {
    console.error("[v0] Error fetching API config:", error);
    return NextResponse.json(
      { error: "Failed to fetch API configuration" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/prompts/[id]/api-config/[configId]
 * Update an API configuration
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; configId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, configId } = await params;
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

    // Update API config
    const apiConfig = await db.apiConfig.update({
      where: {
        id: configId,
        promptId: id,
      },
      data: validatedData,
    });

    return NextResponse.json(apiConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[v0] Error updating API config:", error);
    return NextResponse.json(
      { error: "Failed to update API configuration" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/prompts/[id]/api-config/[configId]
 * Delete an API configuration
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; configId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, configId } = await params;

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

    // Delete API config
    await db.apiConfig.delete({
      where: {
        id: configId,
        promptId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting API config:", error);
    return NextResponse.json(
      { error: "Failed to delete API configuration" },
      { status: 500 }
    );
  }
}
