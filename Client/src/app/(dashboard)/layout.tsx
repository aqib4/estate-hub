"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useGetAuthUserQuery } from "@/state/api";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    
    const userRole = authUser?.userRole?.toLowerCase();
    // Protect routes
    if (
      (userRole === "manager" && pathname.startsWith("/tenant")) ||
      (userRole === "tenant" && pathname.startsWith("/manager"))
    ) {
      router.push(
        userRole === "manager"
          ? "/manager/properties"
          : "/tenant/favorites",
        { scroll: false }
      );
    }
    // Everything done → hide loader
    setIsLoading(false);
  }, [authUser, authLoading, pathname, router]);

  
  // Show loader
  if (authLoading || isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  // If still no user (not logged in)
  if (!authUser) return null;

  return (
    <div className="w-full min-h-screen">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userType={authUser.userRole.toLowerCase()}
        />

        <div className="flex-1 p-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
