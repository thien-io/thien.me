import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";
import BlurFade from "app/components/ui/blur-fade";
import { AnimatedName } from "@/components/animated-name";
import Blog from '@/blog/blog';
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
export const metadata = {
  title: "Blog",
  description: "Thien's ",
};



export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b '>
          <SidebarTrigger className='' />
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
        <div className='flex flex-1 flex-col gap-4 p-10'>
          <div className='mt-20'>
            <BlurFade delay={0}>
              <h1 className='font-medium text-2xl mb-8 tracking-tighter'>
                Blog
              </h1>
            </BlurFade>
            <Blog />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
