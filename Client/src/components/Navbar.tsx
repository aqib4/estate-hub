"use client";
import React, { useState } from "react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import {
  Bell,
  HomeIcon,
  MessageCircle,
  Plus,
  Search,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";


type NavbarProps = {
  onMenuClick?: () => void;
};

function Navbar({ onMenuClick }: NavbarProps) {
  const { data: authUser } = useGetAuthUserQuery();
  console.log("Auth User in Navbar:", authUser);

  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPath =
    pathname.startsWith("/manager") || pathname.startsWith("/tenant");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = async () => {
    await signOut();
    window.location.href = "/landing";
  };
  return (
    <div className="w-full flex justify-between items-center px-2 lg:px-8 py-4 bg-gray-800 text-white">
      {/* website logo */}
      <div className="flex gap-2">
        <MenuIcon className="md:hidden" onClick={onMenuClick} />
        <Link href={"/landing"}>
          <span className="font-quicksand text-lg lg:text-2xl font-bold flex items-center">
            <HomeIcon size={18} /> Estate{" "}
            <span className="text-red-500">hub</span>
          </span>
        </Link>
      </div>
      {isDashboardPath && authUser && (
        <div className="hidden md:flex">
          <Button
            
            variant="outlined"
            size="small"
            sx={{
              px: 1.5,
              py: 0.5,
              borderColor: "#ff3511",
              color: "white",
              "&:hover": { borderColor: "#d62800" },
              textTransform: "none",
            }}
            onClick={() =>
              router.push(
                authUser?.userRole?.toLowerCase() === "manager"
                  ? "/manager/newproperty"
                  : "/search"
              )
            }
          >
            {authUser?.userRole?.toLowerCase() === "manager" ? (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden md:block ml-1 text-sm">
                  Add Property
                </span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden md:block ml-1 text-sm">Search</span>
              </>
            )}
          </Button>
        </div>
      )}
      {!isDashboardPath && (
        <span className="text-gray-300 text-center text-sm md:text-base flex-grow">
          Discover your dream home with Estatehub - with our Advannce Search.
        </span>
      )}

      {authUser ? (
        <div className="flex items-center">
          <div className="relative hidden md:block ">
            <MessageCircle className="w-6 h-6 mr-4 cursor-pointer hover:text-red-500" />
            <span className="absolute -top-1 left-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>
          <div className="relative hidden md:block">
            <Bell className="w-6 h-6 mr-4 cursor-pointer hover:text-red-500" />
            <span className="absolute top-0 -left-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>
          <div>
            <Button
              onClick={handleClick}
              sx={{ textTransform: "none" }}
              className="flex gap-2"
            >
              <Avatar sx={{ width: 28, height: 28 }}>H</Avatar>
              <div className="flex gap-0 flex-col">
                <span className="text-white text-left">
                  {authUser?.userInfo?.name}
                </span>
                <span className="text-white">{authUser?.userRole}</span>
              </div>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
                onClick={() => {
                  router.push(
                    authUser?.userRole?.toLowerCase() === "manager"
                      ? "/manager/properties"
                      : "/tenant/favorites"
                  );
                }}
              >
                {" "}
                Go to Dashboard{" "}
              </MenuItem>
              <MenuItem
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
                onClick={() => {
                  router.push(
                    authUser?.userRole?.toLowerCase() === "manager"
                      ? "/manager/setting"
                      : "/tenant/settings"
                  );
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={handleSignout}
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      ) : (
        //  auth buttons
        <div className="flex gap-2 lg:gap-4">
          <Link href={"/signin"}>
            <Button
              variant="outlined"
              size="medium"
              className="!border-red-500 !border-[2px] hover:!border-red-600 !text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href={"/signup"}>
            <Button
              variant="contained"
              size="medium"
              className="!bg-red-500 hover:!bg-red-600"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
