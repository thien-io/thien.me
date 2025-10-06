"use client"

import React from "react"

import { AppSidebar } from "./app-sidebar"
import { ThemeSwitch } from "@/components/theme-switch"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface LayoutWithSidebarProps {
  children: React.ReactNode
  breadcrumbs?: Array<{
    title: string
    href?: string
    isCurrentPage?: boolean
  }>
}

export function LayoutWithSidebar({ children, breadcrumbs }: LayoutWithSidebarProps) {
  return (
    <div className="overflow-x-hidden max-w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden max-w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 overflow-x-hidden">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {breadcrumbs && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={breadcrumb.title}>
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                          {breadcrumb.isCurrentPage ? (
                            <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href || "#"}>{breadcrumb.title}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
            <div className="ml-auto px-4">
              <ThemeSwitch />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-x-hidden max-w-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
