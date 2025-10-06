import BlurFade from '@/components/ui/blur-fade';
import About from '@/about/about';
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
import { NowPlaying } from '@/components/now-playing';
import { TopTracks } from '@/components/top-tracks';
import { PlaylistCarousel } from '@/components/playlist-carousel';
import { AlbumCarousel } from '@/components/album-carousel';

export default function MusicPage() {
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
      <div className="space-y-6 md:space-y-8 w-full min-h-screen overflow-x-hidden max-w-full">
        <div className="px-4 max-w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-20">Music</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Discover my top tracks, playlists, and what I'm currently listening to
          </p>
        </div>

        {/* Now Playing - Compact Horizontal */}
        <div className="px-4 max-w-full">
          <NowPlaying />
        </div>

        {/* Public Playlists */}
        <div className="w-full max-w-full overflow-x-hidden">
          <div className="px-4 mb-4 md:mb-6">
            <h2 className="text-xl sm:text-xl md:text-2xl font-semibold">My Playlists</h2>
          </div>
          <PlaylistCarousel />
        </div>

        {/* Top 50 Tracks */}
        <div className="w-full max-w-full overflow-x-hidden pb-6">
          <TopTracks />
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
