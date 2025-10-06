import Link from 'next/link';
import { formatDate, getBlogPosts } from 'app/lib/posts';
import BlurFade from 'app/components/ui/blur-fade';
import { AnimatedName } from '@/components/animated-name';

export const metadata = {
  title: 'Blog',
  description: "Thien's ",
};

export default function Blog() {
  let allBlogs = getBlogPosts();

  return (

      <div className='mb-40'>
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <BlurFade delay={0.2}>
              <Link
                key={post.slug}
                className='flex flex-col space-y-1 mb-4 transition-opacity duration-200 hover:opacity-80 '
                href={`/blog/${post.slug}`}
              >
                <div className='w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2'>
                  <p className='text-black dark:text-white tracking-tight text-sm '>
                    {post.metadata.title}
                  </p>
                  <p className='text-neutral-600 dark:text-neutral-400 tabular-nums text-xs '>
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                </div>
              </Link>
            </BlurFade>
          ))}
      </div>

  );
}
