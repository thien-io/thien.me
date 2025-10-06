import React from 'react';
import type { Metadata } from 'next';
import { contact } from '@/data/contact';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export const metadata: Metadata = {
  title: 'Contact',
  description: 'My Contacts',
};
import Contact from '@/contact/contact';
import { ContactIcons } from '@/components/contact-icons';

export default function ContactPage() {
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
            <BlurFade delay={0}>
              <h1 className='mb-8 text-2xl font-medium tracking-tight'>
                Contacts
              </h1>
            </BlurFade>
            <ContactIcons />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
