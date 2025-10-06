'use client'
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { usePathname } from 'next/navigation';

export default function Pathname() {
  const pathname = usePathname();
  const blogpage = pathname.slice(5);
  const pathnameforblog =
    pathname.slice(0, 6) === '/blog/' ? (
      <Breadcrumb className='flex items-center gap-2'>
        <BreadcrumbSeparator className='opacity-50'></BreadcrumbSeparator>
        <BreadcrumbLink href='/blog' className='opacity-50 hover:opacity-100 font-light hover:font-normal'>
          blog
        </BreadcrumbLink>
        <BreadcrumbSeparator className='opacity-50'></BreadcrumbSeparator>
        <>{pathname.slice(6)}</>
      </Breadcrumb>
    ) : (
      <Breadcrumb className='flex items-center gap-2'>
        <BreadcrumbSeparator className=''></BreadcrumbSeparator>

        <>{pathname.slice(1)}</>
      </Breadcrumb>
    );

  return <>{pathnameforblog}</>;
}