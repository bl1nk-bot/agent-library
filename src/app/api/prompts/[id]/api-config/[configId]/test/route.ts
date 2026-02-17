import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/prompts/[id]/api-config/[configId]/test
 * Test an API configuration with sample data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; configId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, configId } = await params;
    const body = await request.json();
    const { testData } = body;

    // Fetch API config
    const apiConfig = await db.apiConfig.findFirst({
      where: {
        id: configId,
        promptId: id,
      },
      include: {
        prompt: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!apiConfig) {
      return NextResponse.json(
        { error: "API configuration not found" },
        { status: 404 }
      );
    }

    // Verify user is the author
    if (apiConfig.prompt.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build request options
    const requestOptions: RequestInit = {
      method: apiConfig.method,
      headers: {
        "Content-Type": "application/json",
        ...(apiConfig.headers as Record<string, string>),
      },
    };

    // Add body for POST/PUT/PATCH requests
    if (["POST", "PUT", "PATCH"].includes(apiConfig.method) && testData) {
      requestOptions.body = JSON.stringify(testData);
    }

    // Build URL with query params
    const url = new URL(apiConfig.baseUrl);
    if (apiConfig.queryParams) {
      Object.entries(apiConfig.queryParams as Record<string, string>).forEach(
        ([key, value]) => {
          url.searchParams.append(key, value);
        }
      );
    }

    // Execute the API request
    const startTime = Date.now();
    const response = await fetch(url.toString(), requestOptions);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Parse response
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
    });
  } catch (error) {
    console.error("[v0] Error testing API config:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to test API",
      },
      { status: 500 }
    );
  }
}
