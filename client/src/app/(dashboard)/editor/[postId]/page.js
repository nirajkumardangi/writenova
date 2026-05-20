export default async function EditorPage({ params }) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
        Post Editor
      </h1>
      <p className="text-gray-500">Editing Post ID: {resolvedParams?.postId}</p>
    </div>
  );
}
