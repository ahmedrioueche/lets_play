"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Bell, Menu, X, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Dropdown from "./ui/BaseDropdown";
import useTranslator from "@/hooks/useTranslator";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { toggle } = useSidebar();
  const text = useTranslator();
  
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-light-border dark:border-dark-border bg-light-background/80 dark:bg-dark-background backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 w-full">
        {/* Left Section - Logo and Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={toggle} className="md:hidden mr-2 flex-shrink-0">
            <Menu className="h-6 w-6" />
          </button>
          <div className="cursor-pointer flex items-center gap-2 min-w-0">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="h-10 w-auto flex-shrink-0"
            />
            <span className="font-bold text-lg md:text-xl truncate font-dancing ml-1 mt-1 ">
              {text.app.name}
            </span>
          </div>
        </div>

        {/* Right Section - Icons and User */}
        <div className="flex items-center justify-end gap-2 flex-shrink-0">
          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button
              className="p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="ml-2"
              aria-label="Profile"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card flex-shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <Dropdown
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col py-2">
            <button
              className="p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                setNotificationsOpen(true);
              }}
            >
              <Bell className="h-5 w-5" />
              <span> {text.general.notifications}</span>
              <span className="ml-auto h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setMobileMenuOpen(false);
              }}
              className="p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span>{text.actions.toggle_theme}</span>
            </button>

            <button
              className="p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                setProfileOpen(true);
              }}
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              <span>{text.general.profile}</span>
            </button>
          </div>
        </Dropdown>

        {/* Notification Dropdown */}
        <NotificationsDropdown
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />

        {/* Profile Dropdown */}
        <ProfileDropdown
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </div>
    </header>
  );
};

export default Navbar;
