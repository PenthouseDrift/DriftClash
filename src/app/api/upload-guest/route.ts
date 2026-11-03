import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { allowRequest } from "@/lib/rate-limit";

/** A photo for a registration sent without signing in: registrations/guest-<uuid>/<uuid>.jpg */
const GUEST_PHOTO_PATH = /^registrations\/guest-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f-]{36}\.jpg$/;

/** Photos one visitor may add in an hour: a registration can hold about 17, so this leaves room for retries. */
const UPLOADS_PER_HOUR = 40;

/**
 * Lets someone who hasn't signed in upload photos for a registration. There is nothing to prove who they are, so this is
 * narrow: JPEGs under 5MB, only into a new guest folder, and only a limited number per visitor each hour.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!GUEST_PHOTO_PATH.test(pathname)) throw new Error("That photo can't be added here");
        if (!(await allowRequest("guest-upload", UPLOADS_PER_HOUR, 3600))) {
          throw new Error("That's a lot of photos from one place. Please try again in a while.");
        }
        return {
          allowedContentTypes: ["image/jpeg"],
          maximumSizeInBytes: 5 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}
