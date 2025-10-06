"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  IdCard,
  GalleryVerticalEnd,
  Map,
  AtSign,
  PieChart,
  House,
  Settings2,
  SquareTerminal,
  ChevronRight,
  File,
  Folder,
  Forward,
  MoreHorizontal,
  Tent,
  Notebook,
  Image,
  BookType,
  FileType,
  Type,
  ClipboardType,
  Mailbox,
  Origami,
  Bone,
  Dog,
  Rocket,
  Trash2,
  FileUser,
  Contact,
  BookUser,
  Eclipse,
  CodeXml,
  Construction,
  Signpost,
  Donut,
  Feather,
  Ghost,
  Sword,
  Swords,
  Flower,
  Milestone,
  LampDesk,
  Sofa,
  Popcorn,
  Award,
  Quote,
  Music4,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavPages } from '@/components/nav-pages';
import Link from 'next/link';
import { NameTransition } from './name';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ThemeSwitch } from './theme-switch';
import { NowPlaying } from "./now-playing";
import { DiscordProfileFooter } from "./discord-profile-footer";

// Nav Data
const YEAR = new Date().getFullYear();
const data = {
  pages: [
    {
      name: 'Home',
      url: '/',
      icon: House,
    },
    {
      name: 'About',
      url: '/about',
      icon: IdCard,
    },

    {
      name: 'Blog',
      url: '/blog',
      icon: Feather,
    },
    {
      name: 'Photos',
      url: '/photos',
      icon: Image,
    },


    {
      name: 'Contact',
      url: '/contact',
      icon: AtSign,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <Link
          href='/'
          className=' items-center justify-center mt-3 ml-2 text-large font-bold font-serif tracking-wide'
        >thien.</Link>
      </SidebarHeader>
      <SidebarContent>
        <NavPages pages={data.pages} />
      </SidebarContent>
      <SidebarFooter>
        <NowPlaying />

        <div className='ml-2 flex justify-between mb-3 text-gray-400 hover:text-black dark:text-white'>
          <ThemeSwitch />
          <p className='text-xs justify-center items-center content-center ml-2 mr-1 text-gray-400 hover:dark:text-gray-200'>
            thien © {YEAR}
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({ item }: { item: string | any[] }) {
  const [name, ...items] = Array.isArray(item) ? item : [item]
  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={name === "button.tsx"}
        className="data-[active=true]:bg-transparent"
      >
        <File />
        {name}
      </SidebarMenuButton>
    )
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}