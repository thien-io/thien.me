import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "@/lib/posts";
import { metaData } from "@/config";
import BlurFade from '@/components/ui/blur-fade';
import { AppSidebar } from '@/components/app-sidebar';
import Pathname from '@/components/pathname';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${metaData.baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='block'>
                <BreadcrumbLink href='/'>thien</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Pathname />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className='flex flex-1 flex-col gap-4 px-6'>
          <div className='mt-20'>
            <BlurFade delay={0}>
              <section className='mb-40'>
                <script
                  type='application/ld+json'
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'BlogPosting',
                      headline: post.metadata.title,
                      datePublished: post.metadata.publishedAt,
                      dateModified: post.metadata.publishedAt,
                      description: post.metadata.summary,
                      image: post.metadata.image
                        ? `${metaData.baseUrl}${post.metadata.image}`
                        : `/og?title=${encodeURIComponent(
                            post.metadata.title
                          )}`,
                      url: `${metaData.baseUrl}/blog/${post.slug}`,
                      author: {
                        '@type': 'Person',
                        name: metaData.name,
                      },
                    }),
                  }}
                />
                <h1 className='title mb-3 font-bold text-2xl tracking-tight font-serif'>
                  {post.metadata.title}
                </h1>
                <div className='flex justify-between items-center mt-2 mb-8 text-medium'>
                  <p className='text-sm text-neutral-600 dark:text-neutral-400 '>
                    {formatDate(post.metadata.publishedAt)}
                  </p>
                </div>
                <article className='prose prose-quoteless prose-neutral dark:prose-invert'>
                  <CustomMDX source={post.content} />
                </article>
              </section>
            </BlurFade>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
