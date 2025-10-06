import Image from "next/image";
import Link from 'next/link';
import { socialLinks } from "./config";
import { NameTransition } from './components/name';
import { HeroTabs } from "./components/hero-tabs";
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className='flex flex-col mt-10 w-full'>
        <SidebarTrigger className=' ml-6 ' />
        <Link
          href='https://thientran.io'
          className=' items-center justify-center mx-10 mt-20 text-base font-semibold'
        >
          <p className='font-serif tracking-wide text-4xl'>thien.</p>
        </Link>
        <div className='mx-10'>
          {' '}
          <HeroTabs />
        </div>
      </div>
    </SidebarProvider>
  );
}
