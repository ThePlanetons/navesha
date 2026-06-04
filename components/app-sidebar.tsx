"use client"

import * as React from "react"

import { GalleryVerticalEndIcon, AudioLinesIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, ShoppingBagIcon, PanelsTopLeftIcon } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon />
      ),
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Public Page",
      url: "#",
      icon: (
        <PanelsTopLeftIcon />
      ),
      isActive: true,
      items: [
        {
          title: "Hero Sections",
          url: "/admin/hero-sections",
        },
        {
          title: "Featured Collections",
          url: "/admin/featured-collections",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: (
        <ShoppingBagIcon />
      ),
      isActive: true,
      items: [
        {
          title: "All Orders",
          url: "/admin/orders",
        },
        {
          title: "Pending Orders",
          url: "/admin/orders/pending",
        },
        {
          title: "Completed Orders",
          url: "/admin/orders/completed",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <BookOpenIcon />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
