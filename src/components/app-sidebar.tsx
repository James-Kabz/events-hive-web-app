'use client';
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
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CalendarCheck, Home, Users, Plus, Edit, Settings, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const items = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="mr-0 h-4 w-4" />,
  },
  {
    title: "Roles",
    icon: <Users className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Create Role", href: "/roles/create", icon: <Plus className="mr-2 h-4 w-4" /> },
      { title: "Edit Role", href: "/roles/edit", icon: <Edit className="mr-2 h-4 w-4" /> },
    ],
  },
  {
    title: "Permissions",
    icon: <Settings className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Manage Permissions", href: "/permissions/manage", icon: <Settings className="mr-2 h-4 w-4" /> },
    ],
  },
  {
    title: "Events",
    icon: <CalendarCheck className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Create Event", href: "/events/create", icon: <Plus className="mr-2 h-4 w-4" /> },
      { title: "Edit Event", href: "/events/edit", icon: <Edit className="mr-2 h-4 w-4" /> },
    ],
  },
];

export function AppSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Events Hive</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.collapsible ? (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible open={openSections[item.title]} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => toggleSection(item.title)}
                          className="flex justify-between items-center w-full"
                        >
                          <div className="flex items-center">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openSections[item.title] ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <a href={subItem.href} className="pl-8 flex items-center gap-2 text-sm">
                                {subItem.icon}
                                {subItem.title}
                              </a>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
