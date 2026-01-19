'use client';

import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import Footer from '@/components/Footer'
import { useGetAuthUserQuery } from '@/state/api'
import { usePathname, useRouter } from 'next/navigation'

function Layout({children}: {children: React.ReactNode}) {

  const {
    data: authUser,
    isLoading: authLoading,
    error: authError 
  } = useGetAuthUserQuery();

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if query is done (either loaded or errored)
    if (authLoading) return;

    setIsLoading(false);

    // If there's an error (no session), user is logged out
    if (authError) {
      console.log('No authenticated user, error:', authError);
      return; // Stay on current page or redirect to login if needed
    }

    if (!authUser) return;

    // Redirect based on user role and pathname
    const userRole = authUser?.userRole?.toLowerCase();
    if (
      userRole === "manager" &&
      (pathname === "/" || pathname.startsWith("/search"))
    ) {
      router.push("/manager/properties", { scroll: false });
    }
  }, [authLoading, authUser, authError, router, pathname]);

  // Show loader only while actually loading
  if (authLoading || isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className={`h-full w-full flex flex-col pt-[${NAVBAR_HEIGHT}px]`}>
        <main>
          {children}
        </main>
      </div>
      <Footer/>
    </div>
  )
}

export default Layout