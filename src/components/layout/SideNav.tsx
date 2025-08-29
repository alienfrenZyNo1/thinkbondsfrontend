"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthData } from "@/lib/auth-hooks";
import { UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
 roles: UserRole[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    roles: [UserRole.ADMIN, UserRole.WHOLESALE, UserRole.BROKER, UserRole.POLICYHOLDER],
  },
  {
    title: "Brokers",
    href: "/brokers",
    roles: [UserRole.ADMIN, UserRole.WHOLESALE, UserRole.BROKER],
  },
  {
    title: "Policyholders",
    href: "/policyholders",
    roles: [UserRole.ADMIN, UserRole.WHOLESALE, UserRole.BROKER, UserRole.POLICYHOLDER],
  },
  {
    title: "Proposals",
    href: "/proposals",
    roles: [UserRole.ADMIN, UserRole.WHOLESALE, UserRole.BROKER],
    children: [
      {
        title: "Create New",
        href: "/proposals/new",
        roles: [UserRole.ADMIN, UserRole.WHOLESALE, UserRole.BROKER],
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    roles: [UserRole.ADMIN, UserRole.WHOLESALE],
    children: [
      {
        title: "Wholesaler",
        href: "/settings/wholesaler",
        roles: [UserRole.ADMIN, UserRole.WHOLESALE],
      },
    ],
  },
];

export default function SideNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { groups, isLoading } = useAuthData();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const userHasRole = (roles: UserRole[]) => {
    if (isLoading) return false;
    return roles.some((role) => groups.includes(role));
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.title];
    const isActive = pathname === item.href;

    // Check if user has access to this item
    if (!userHasRole(item.roles)) {
      return null;
    }

    if (hasChildren) {
      return (
        <div key={item.title} className="w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between text-left font-normal hover:bg-accent hover:text-accent-foreground",
              depth > 0 && "pl-8",
              isActive && "bg-accent text-accent-foreground"
            )}
            onClick={() => toggleSection(item.title)}
          >
            <span>{item.title}</span>
            <span className="transform transition-transform">
              {isExpanded ? "▼" : "▶"}
            </span>
          </Button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={cn(
          "block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
          depth > 0 && "pl-8",
          isActive 
            ? "bg-accent text-accent-foreground" 
            : "text-foreground/70"
        )}
      >
        {item.title}
      </Link>
    );
  };

  if (isLoading) {
    return (
      <aside className={cn("w-64 border-r bg-white", className)}>
        <div className="p-4">
          <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn("w-64 border-r bg-white", className)}>
      <div className="p-4">
        <h2 className="mb-6 text-xl font-bold">Navigation</h2>
        <nav className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </aside>
  );
}