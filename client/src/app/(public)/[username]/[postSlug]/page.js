export default async function PostPublicPage({ params }) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
        Public Story
      </h1>
      <p className="text-gray-500">
        Story "{resolvedParams?.postSlug}" by @{resolvedParams?.username}.
      </p>
    </div>
  );
}
