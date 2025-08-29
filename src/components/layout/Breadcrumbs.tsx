"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const breadcrumbNameMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/brokers": "Brokers",
  "/policyholders": "Policyholders",
  "/proposals": "Proposals",
  "/proposals/new": "Create New Proposal",
  "/settings": "Settings",
  "/settings/wholesaler": "Wholesaler Settings",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/") {
    return null;
  }

  const pathSegments = pathname.split("/").filter((segment) => segment);
  
  // Build breadcrumb paths
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    
    // Try to get a friendly name from our map, otherwise use the segment
    const displayName = breadcrumbNameMap[href] || 
                       breadcrumbNameMap[`/${segment}`] || 
                       segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      href,
      name: displayName,
      isLast,
    };
  });

  // Add home breadcrumb
  const breadcrumbItems = [
    { href: "/", name: "Home", isLast: false },
    ...breadcrumbs,
  ];

  return (
    <nav className="border-b bg-white px-4 py-3">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {breadcrumb.isLast ? (
              <span className="font-medium text-gray-900">
                {breadcrumb.name}
              </span>
            ) : (
              <>
                <Link 
                  href={breadcrumb.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {breadcrumb.name}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}