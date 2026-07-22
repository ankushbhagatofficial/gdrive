import { auth } from "@/lib/auth";
import { createDrive } from "@/lib/drive";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params
  const session = await auth();

  const drive = createDrive(session?.accessToken!);

  let currentId = fileId
  const paths = []

  while (currentId !== "root") {
  const {data} = await drive.files.get({
  fileId: currentId,
  fields: "id,name,parents",
})
    currentId = data.parents?.[0] ??  "root"

    if (data.parents?.[0]) {
    paths.push({
      id: data.id,
      name: data.name,
    })

    }

  }

  paths.reverse()

  paths.unshift({
    id: "root",
    name: "My Drive"
  })

  const res = await drive.files.list({
    q: `'${fileId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)"
  });

  return Response.json({
    paths,
    files: res.data.files
});
}
