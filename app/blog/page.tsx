import Link from "next/link";

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
          <p className="text-lg text-gray-600">
            Insights and updates from the accelerator application world
          </p>
        </div>
        
        <div className="grid gap-6">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Link href="/blog/test-post" className="text-blue-600 hover:text-blue-800">
                Testing MDX Blog Functionality
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">
              A test post to verify that our MDX blog setup is working correctly with Next.js App Router.
            </p>
            <div className="text-sm text-gray-500">
              August 29, 2024
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
