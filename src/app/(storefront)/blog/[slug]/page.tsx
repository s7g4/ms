import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blog-data";

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found | MysteryScoop Blog" };
  return {
    title: `${post.title} | MysteryScoop Blog`,
    description: post.excerpt,
  };
}

const ARTICLE_CONTENT = `
Japan's kawaii culture — a philosophy of cuteness, softness, and joyful aesthetics — has quietly but powerfully woven itself into the fabric of Indian youth culture. Walk into any college campus in Mumbai, Bengaluru, or Hyderabad today and you will find pastel-coloured stationery, Sanrio character keychains hanging from bags, anime-inspired fashion, and phone cases adorned with chubby cartoon animals. This is not a fleeting trend; it is a cultural shift.

The journey of kawaii into India began gradually through anime streaming platforms like Crunchyroll and global platforms such as Instagram and Pinterest. Visual content travels fast, and the hyper-cute aesthetic of characters from series like Cardcaptor Sakura, Sailor Moon, and newer hits like Spy x Family created a gravitational pull that crossed all cultural barriers.

What makes kawaii so universally appealing is its fundamental emotional promise: it makes you feel happy. There is psychological research suggesting that viewing cute imagery triggers care-taking responses in the brain, releasing dopamine and creating a sense of warmth and nostalgia. Kawaii aesthetics tap directly into this, creating a visual language that says "the world can be soft and joyful."

For Indian Gen-Z, who grew up during a decade of social media, academic pressure, and economic uncertainty, kawaii represents a safe creative sanctuary. It is a rebellion against hustle culture — an assertion that it is okay to love cute things, to collect small joyful objects, to decorate your space with characters that make you smile.

The market has responded. Independent sellers on Instagram and Etsy India have built entire businesses around kawaii stationery, washi tape, sticker sheets, and plushies. Large platforms like Amazon India now carry thousands of kawaii-inspired products, and dedicated subscription boxes — like MysteryScoop — have emerged to deliver curated kawaii experiences monthly.

Beyond aesthetics, kawaii culture has also influenced music, fashion, and language. The Indian K-pop fandom — itself deeply intertwined with kawaii visual language — has introduced millions of young people to concepts like idol culture, pastel fashion palettes, and the iconic "aegyo" facial expressions. The lines between K-pop, kawaii, and anime fandom have blurred beautifully into one unified aesthetic movement.

Social media has been the great accelerator. Creators on YouTube and Instagram documenting their kawaii room tours, stationery hauls, and unboxing videos have millions of subscribers in India. The "aesthetic room" trend, featuring fairy lights, plushie collections, and pastel colour schemes, is aspirational content for millions of teenagers.

Looking ahead, the kawaii economy in India is set to grow significantly. As manufacturing for Japanese-style merchandise moves closer (with many brands now producing in India and Southeast Asia), prices are becoming more accessible. What was once a niche import culture is becoming mainstream — and MysteryScoop is proud to be right at the heart of that revolution.
`;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post.category
  ).slice(0, 2);

  const paragraphs = ARTICLE_CONTENT.trim().split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="h-72 md:h-96 w-full relative flex items-end"
        style={{ background: post.gradient }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 max-w-4xl pb-10">
          <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white mb-4 backdrop-blur-sm">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-jakarta text-white leading-tight max-w-2xl">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-purple transition-colors"
            >
              <ArrowLeft size={15} /> Back to Blog
            </Link>

            {/* Author Row */}
            <div className="flex items-center gap-4 pb-6 border-b border-purple-500/15">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: post.gradient }}
              >
                {post.authorInitials}
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{post.date}</span>
                  <span>·</span>
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose-custom space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-text-muted leading-relaxed text-sm">
                  {para}
                </p>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            <div className="glass rounded-2xl border border-purple-500/20 p-6 sticky top-24">
              <h3 className="font-bold font-jakarta text-sm mb-4 text-accent-purple uppercase tracking-wide">
                In This Article
              </h3>
              <ul className="space-y-2.5 text-sm text-text-muted">
                <li>
                  <a href="#" className="hover:text-accent-purple transition-colors">
                    The Rise of Kawaii in India
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-purple transition-colors">
                    The Psychology of Cuteness
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-purple transition-colors">
                    Market Response & Trends
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-purple transition-colors">
                    Social Media's Role
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-purple transition-colors">
                    The Road Ahead
                  </a>
                </li>
              </ul>
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="glass rounded-2xl border border-purple-500/20 p-6">
                <h3 className="font-bold font-jakarta text-sm mb-4 text-accent-purple uppercase tracking-wide">
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="flex gap-3 group"
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex-shrink-0"
                        style={{ background: rel.gradient }}
                      />
                      <div>
                        <p className="text-sm font-medium leading-snug group-hover:text-accent-purple transition-colors line-clamp-2">
                          {rel.title}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {rel.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
