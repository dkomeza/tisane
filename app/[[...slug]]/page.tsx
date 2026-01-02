import { notFound } from "next/navigation";
import { getCachedPageBySlug } from "@/lib/pages/lookup-service"; // Update path to your service
import { Metadata } from "next";
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";

// Define the params interface
interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = await getCachedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  if (page.visibility !== "public" || page.status !== "published") {
    const { session } = await authorize();
    if (!hasPermission(session, "content.read")) {
      notFound();
    }
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || undefined,
      url: page.canonical_url || undefined,
      images: page.open_graph_image ? [page.open_graph_image] : [],
    },
    alternates: {
      canonical: page.canonical_url,
    },
  };
}

/**
 * Renders a CMS page based on the provided slug.
 * It is
 * @returns
 */
export default async function CMSPage({ params }: PageProps) {
  const { slug = [] } = await params;

  const page = await getCachedPageBySlug(slug);
  if (!page) {
    notFound();
  }

  if (page.visibility !== "public" || page.status !== "published") {
    const { session } = await authorize();
    if (!hasPermission(session, "content.read")) {
      notFound();
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl max-w-none">
        <header className="mb-8">
          <div className="bg-red-500 text-white p-2 font-mono text-center">
            Generated at: {new Date().toLocaleTimeString()}
          </div>
          <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
          <time className="text-gray-500 text-sm">
            {new Date(page.updated_at).toLocaleDateString()}
          </time>
        </header>

        <div dangerouslySetInnerHTML={{ __html: page.content ?? "" }} />

        {page.tags.length > 0 && (
          <div className="mt-8 flex gap-2">
            {page.tags.map((tag) => (
              <span
                key={tag.name}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
