import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateUrl } from "@/lib/security";

/**
 * POST /api/prompts/[id]/api-config/[configId]/test
 * Test an API configuration with sample data
 */
export async function POST(
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

    // Security: Validate URL for SSRF protection
    try {
      await validateUrl(url.toString());
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid URL" },
        { status: 400 }
      );
    }

    // Execute the API request with timeout and size limit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

    const startTime = Date.now();
    let response;
    try {
      response = await fetch(url.toString(), {
        ...requestOptions,
        signal: controller.signal,
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timed out" }, { status: 504 });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Check Content-Length header if available
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return NextResponse.json({ error: "Response too large" }, { status: 413 });
    }

    // Parse response with size limit
    const contentType = response.headers.get("content-type");
    let responseData;

    try {
      if (!response.body) {
        responseData = null;
      } else {
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedLength += value.length;
          if (receivedLength > MAX_SIZE) {
            await reader.cancel();
            return NextResponse.json(
              { error: "Response too large" },
              { status: 413 }
            );
          }
          chunks.push(value);
        }

        // Combine chunks
        const chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          chunksAll.set(chunk, position);
          position += chunk.length;
        }
        
        const text = new TextDecoder().decode(chunksAll);

        if (contentType?.includes("application/json")) {
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = text;
          }
        } else {
          responseData = text;
        }
      }
    } catch (error) {
      console.error("[v0] Error reading response:", error);
       return NextResponse.json(
        { error: "Failed to read response body" },
        { status: 500 }
      );
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
