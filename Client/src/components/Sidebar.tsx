"use client";
import { cn } from "@/lib/utils";
import { Building, FileText, Heart, Home, Menu, Settings, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AppSidebarProps = {
  userType: "manager" | "tenant";
  isOpen: boolean;      // mobile sidebar open
  onClose: () => void;  // mobile sidebar close
};

const Sidebar = ({ userType, isOpen, onClose }: AppSidebarProps) => {
  // Desktop collapse/expand
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

  const sidebarMenuItems =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/manager/properties" },
          { icon: FileText, label: "Applications", href: "/manager/application" },
          { icon: Settings, label: "Settings", href: "/manager/setting" },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenant/favorites" },
          { icon: FileText, label: "Applications", href: "/tenant/application" },
          { icon: Home, label: "Residences", href: "/tenant/residences" },
          { icon: Settings, label: "Settings", href: "/tenant/settings" },
        ];

  const pathname = usePathname();

  return (
    <>
      {/* ===================== MOBILE OVERLAY SIDEBAR ===================== */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 md:hidden transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      <nav
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-50 p-4 transition-all duration-300 md:hidden",
          isOpen ? "translate-x-0 w-[230px]" : "-translate-x-full w-[230px]"
        )}
      >
        {/* Close button (mobile only) */}
        <X
          onClick={onClose}
          className="w-6 h-6 text-black cursor-pointer mb-6"
        />

        {/* Mobile menu items */}
        <div className="flex flex-col gap-4">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  isActive ? "bg-gray-200 text-red-500" : "hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <nav
        className={cn(
          "hidden md:flex md:flex-col md:items-center pt-3 shadow-lg min-h-screen bg-white transition-all duration-300",
          sideMenuOpen ? "w-[200px]" : "w-[50px]"
        )}
      >
        {/* Desktop Toggle */}
        {sideMenuOpen ? (
          <X
            onClick={() => setSideMenuOpen(false)}
            className="text-white cursor-pointer bg-black rounded-full p-1 hover:bg-gray-800 transition"
          />
        ) : (
          <Menu
            onClick={() => setSideMenuOpen(true)}
            className="text-gray-700 cursor-pointer hover:text-black transition"
          />
        )}

        {/* Desktop Menu Items */}
        <div className="flex flex-col gap-3 mt-4">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition",
                  isActive && "bg-gray-200",
                  !sideMenuOpen && "justify-center"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-red-500" : "text-gray-400"
                  )}
                />
                {sideMenuOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
