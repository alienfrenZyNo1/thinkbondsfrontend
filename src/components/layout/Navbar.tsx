"use client";

import { useState } from "react";
import { UserProfile } from "@/components/user-profile";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";

export default function Navbar({ 
  onMenuToggle 
}: { 
  onMenuToggle?: () => void 
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h2 className="text-xl font-bold">ThinkBonds Portal</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserProfile />
        </div>
      </div>
      
      {/* Notifications dropdown - placeholder for future implementation */}
      {notificationsOpen && (
        <div className="absolute right-4 top-16 w-80 bg-white border rounded-md shadow-lg p-4">
          <h3 className="font-medium mb-2">Notifications</h3>
          <p className="text-sm text-gray-500">No new notifications</p>
        </div>
      )}
    </nav>
  );
}