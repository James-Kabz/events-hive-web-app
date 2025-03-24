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
import { CalendarCheck, Home, Users, Plus, Edit, Settings, ChevronDown, ChevronUp, User2, LogOut, Bell, Search } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Logout from "./Logout";

const items = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <Home className="mr-0 h-4 w-4" />,
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: <Users className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Create Role", href: "/dashboard/roles/create", icon: <Plus className="mr-2 h-4 w-4" /> },
      { title: "Edit Role", href: "/dashboard/roles/edit", icon: <Edit className="mr-2 h-4 w-4" /> },
    ],
  },
  {
    title: "Permissions",
    href: "/dashboard/permissions",
    icon: <Settings className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Create Permission", href: "/dashboard/permissions/create", icon: <Settings className="mr-2 h-4 w-4" /> },
    ],
  },
  {
    title: "Events",
    icon: <CalendarCheck className="mr-2 h-4 w-4" />,
    collapsible: true,
    subItems: [
      { title: "Create Event", href: "/dashboard/events/create", icon: <Plus className="mr-2 h-4 w-4" /> },
      { title: "Edit Event", href: "/dashboard/events/edit", icon: <Edit className="mr-2 h-4 w-4" /> },
    ],
  },
];

export function AppSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [notificationCount, setNotificationCount] = useState(3);
  const [, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    
    const filtered = items.map(item => {
      // Check if main item matches search
      const mainItemMatches = item.title.toLowerCase().includes(searchLower);
      
      // If item has subitems, filter those too
      if (item.subItems) {
        const matchingSubItems = item.subItems.filter(subItem => 
          subItem.title.toLowerCase().includes(searchLower)
        );
        
        // If main item matches or any subitems match, include this item
        if (mainItemMatches || matchingSubItems.length > 0) {
          return {
            ...item,
            subItems: matchingSubItems,
            // Auto-expand sections with matching subitems
            _shouldExpand: matchingSubItems.length > 0
          };
        }
        return null;
      }
      
      // For non-collapsible items, just check the main item
      return mainItemMatches ? item : null;
    }).filter(item => item !== null);
    
    setFilteredItems(filtered);
    
    // Auto-expand sections with matching items
    filtered.forEach(item => {
      if ('_shouldExpand' in item && item._shouldExpand) {
        setOpenSections(prev => ({ ...prev, [item.title]: true }));
      }
    });
  }, [searchQuery]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="flex justify-between items-center p-4">
        <span className="font-bold text-lg">Events Hive</span>
      </SidebarHeader>
      
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Events Hive</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) =>
                item.collapsible ? (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible open={openSections[item.title]} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => toggleSection(item.title)}
                          className="flex justify-between items-center w-full"
                        >
                          <div className="flex items-center">
                            <a href={item.href} className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.title}</span>
                            </a>
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

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="relative">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-64">
                <div className="p-2 flex justify-between items-center border-b">
                  <span className="font-medium">Notifications</span>
                  <Button variant="ghost" size="sm" onClick={clearNotifications}>
                    Clear all
                  </Button>
                </div>
                {notificationCount > 0 ? (
                  <>
                    <DropdownMenuItem className="py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">New Event Created</span>
                        <span className="text-xs text-muted-foreground">2 minutes ago</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">Role Updated</span>
                        <span className="text-xs text-muted-foreground">1 hour ago</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">Permission Request</span>
                        <span className="text-xs text-muted-foreground">Yesterday</span>
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="mr-2 h-4 w-4" />
                  <span>UserName</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Logout/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}