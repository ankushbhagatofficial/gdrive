import { auth } from "@/lib/auth";
import { Readable } from "stream";
import { createDrive } from "@/lib/drive";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth();

  const drive = createDrive(session?.accessToken!);

  const metadata = await drive.files.get({
    fileId: id,
    fields: "name,mimeType,size"
  });

  const file = await drive.files.get(
    {
      fileId: id,
      alt: "media",
    },
    {
      responseType: "stream"
    }
  )

  return new Response(Readable.toWeb(file.data) as ReadableStream, {
    headers: {
      "Content-Length": metadata.data.size!,
      "Content-Type": metadata.data.mimeType!,
      "Content-Disposition": `inline; filename="${metadata.data.name}"`,
    },
  });
}

