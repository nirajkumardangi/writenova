export default async function UserPublicPage({ params }) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
        @{resolvedParams?.username}
      </h1>
      <p className="text-gray-500">
        Public profile page of {resolvedParams?.username}.
      </p>
    </div>
  );
}
