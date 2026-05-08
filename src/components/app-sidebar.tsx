
'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Star,
  Lightbulb,
  Newspaper,
  Globe,
  Flag,
  GraduationCap,
  CalendarDays,
  Activity,
  FlaskConical,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'India Markets',
          url: '/',
          icon: Flag,
        },
        {
          title: 'International',
          url: '/international',
          icon: Globe,
        },
      ],
    },
    {
      title: 'Watchlist',
      url: '/watchlist',
      icon: Star,
    },
    {
      title: 'Insights',
      url: '/insights',
      icon: Lightbulb,
    },
    {
      title: 'News',
      url: '/news',
      icon: Newspaper,
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: CalendarDays,
    },
    {
      title: 'Education',
      url: '/education',
      icon: GraduationCap,
    },
    {
      title: 'Tools',
      url: '/fear-greed',
      icon: Activity,
      items: [
        { title: 'Fear & Greed Index', url: '/fear-greed',  icon: Activity },
        { title: 'What If Backtester', url: '/backtester',  icon: FlaskConical },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="flex flex-col" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-md px-2 py-1 hover:text-emerald-300 transition-colors"
          aria-label="Go to Stockify home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden text-xl font-bold tracking-tight">Stockify</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <React.Fragment key={item.title}>
                {item.items ? (
                  <Collapsible
                    asChild
                    defaultOpen={item.items?.some(s => s.url === pathname) || pathname === '/' || pathname === '/international'}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={item.items?.some(s => s.url === pathname) || pathname === '/' || pathname === '/international'}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          © 2024 Stockify AI
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
