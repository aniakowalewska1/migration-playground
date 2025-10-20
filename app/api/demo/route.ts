import { NextRequest, NextResponse } from "next/server";
import { UtilsService } from "../../../services/utils.service";

const utilsService = new UtilsService();

/**
 * API route that might trigger false positives but is actually secure
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data, userId } = body;

    // This might trigger "Information exposure" false positive
    // but we're intentionally logging for audit purposes
    console.log(`API call from user: ${userId}, action: ${action}`);

    switch (action) {
      case "process_text":
        // This uses exec() internally but with sanitized input
        const result = await utilsService.sanitizeAndExecuteCommand(data);

        // Log the activity (might trigger info exposure warning)
        utilsService.logUserActivity(userId, "process_text");

        return NextResponse.json({
          success: true,
          result,
          timestamp: new Date().toISOString(),
        });

      case "generate_id":
        // This uses MD5 but not for security purposes
        const id = utilsService.generateDemoHash(data);

        return NextResponse.json({
          success: true,
          id: id.substring(0, 12),
          note: "This is a demo ID, not for security purposes",
        });

      case "get_config":
        // This might trigger "Hard-coded credentials" false positive
        const config = utilsService.getApiConfiguration();

        // Don't return the actual API key in response (that would be real vulnerability)
        const safeConfig = {
          endpoint: config.endpoint,
          hasApiKey: !!config.apiKey,
          keyLength: config.apiKey.length,
        };

        return NextResponse.json({
          success: true,
          config: safeConfig,
        });

      case "search_demo":
        // This builds SQL-like strings but doesn't execute them
        const query = utilsService.buildSearchQuery(data);

        return NextResponse.json({
          success: true,
          demoQuery: query,
          note: "This is just a demo query string, not executed",
        });

      case "calculate":
        try {
          // This might trigger eval warnings but input is validated
          const calcResult = utilsService.executeCalculation(data);

          return NextResponse.json({
            success: true,
            result: calcResult,
          });
        } catch (calcError) {
          console.error("Calculation error:", calcError);
          return NextResponse.json(
            {
              success: false,
              error: "Invalid calculation expression",
            },
            { status: 400 }
          );
        }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    // This might trigger "Information exposure" for logging error details
    console.error("Demo API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        // In a real app, we wouldn't expose error details
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint that might trigger path traversal false positive
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");

  if (!filename) {
    return NextResponse.json(
      { error: "File parameter required" },
      { status: 400 }
    );
  }

  try {
    // This might trigger path traversal warning but it's actually safe
    // because getSecureFilePath validates against an allowlist
    const secureFilePath = utilsService.getSecureFilePath(filename);

    return NextResponse.json({
      success: true,
      path: secureFilePath,
      note: "File path validated against allowlist",
    });
  } catch (pathError) {
    console.error("Path validation error:", pathError);
    return NextResponse.json(
      {
        success: false,
        error: "File not allowed or not found",
      },
      { status: 404 }
    );
  }
}
