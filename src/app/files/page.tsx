import Files from "@/components/Files"

export default async function page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <Files folderId={id ?? "root"} />
}

