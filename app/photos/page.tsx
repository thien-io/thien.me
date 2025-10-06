import React from "react";
import type { Metadata } from "next";
import { ImageGrid } from "@/components/image-grid";
import { ImageGallery } from "@/components/image-gallery";
import BlurFade from "@/components/ui/blur-fade";
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

export const metadata: Metadata = {
  title: "Photos",
  description: "My Photos",
};
import Photos from "@/photos/photos";
export default function PhotosPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
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
          <BlurFade delay={0}><h1 className='mb-8 text-2xl font-medium tracking-tight'>Photos</h1></BlurFade>
            <ImageGallery />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
