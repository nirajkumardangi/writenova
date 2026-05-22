import EditorContainer from "@/components/editor/EditorContainer";

export default async function EditorPage({ params }) {
  const resolvedParams = await params;
  return <EditorContainer postId={resolvedParams?.postId} />;
}
