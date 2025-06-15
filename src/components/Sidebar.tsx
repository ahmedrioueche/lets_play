"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Plus,
  Calendar,
  Users,
  MessageCircle,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import useScreen from "@/hooks/useScreen";
import useTranslator from "@/hooks/useTranslator";
interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
  color: string;
  gradient: string;
}


const MenuItemCard: React.FC<{
  item: MenuItem;
  isActive: boolean;
  onClick: (item: MenuItem) => void;
}> = ({ item, isActive, onClick }) => (
  <div
    onClick={() => onClick(item)}
    className="relative cursor-pointer transition-all duration-300 w-full mb-3 group"
  >
    <div
      className={`relative overflow-hidden rounded-2xl p-4 h-24 ${
        isActive
          ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-current/30`
          : "bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-light-primary/30"
      }`}
    >
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
        <div
          className={`${isActive ? "text-white" : item.color} transition-all`}
        >
          {React.cloneElement(item.icon as React.ReactElement)}
        </div>

        <span
          className={`text-xs font-medium ${
            isActive
              ? "text-white"
              : "text-light-text-primary dark:text-dark-text-primary"
          }`}
        >
          {item.title}
        </span>

        {item.badge && (
          <div className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
            {item.badge > 99 ? "99+" : item.badge}
          </div>
        )}
      </div>
    </div>
  </div>
);

const SideBar: React.FC<NavigationBarProps> = ({}) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("explore");
  const router = useRouter();
  const { isOpen, toggle } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreen();
  const text = useTranslator();
  
  useEffect(() => {
    if (pathname) {
      const path = pathname.split("/")[1] || "explore";
      setActiveItem(path);
    }
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !sidebarRef.current?.contains(event.target as Node) &&
        overlayRef.current?.contains(event.target as Node)
      ) {
        toggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggle]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    router.push(`/${item.id}`);
    // Close sidebar after navigation on mobile
    if (window.innerWidth < 1024) {
      toggle();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: "explore",
      title: text.menu.sidebar.explore,
      icon: <MapPin />,
      badge: 12,
      color: "text-sports-soccer",
      gradient:
        "from-light-primary to-blue-500 dark:from-dark-primary dark:to-blue-400",
    },
    {
      id: "create",
      title: text.menu.sidebar.create,
      icon: <Plus />,
      color: "text-light-primary dark:text-dark-primary",
  
      gradient: "from-sports-soccer to-emerald-400",
    },
    {
      id: "games",
      title: text.menu.sidebar.my_games,
      icon: <Calendar />,
      badge: 3,
      color: "text-sports-basketball",
      gradient: "from-sports-basketball to-orange-400",
    },
    {
      id: "friends",
      title: text.menu.sidebar.friends,
      icon: <Users />,
      badge: 5,
      color: "text-sports-volleyball",
      gradient: "from-sports-volleyball to-blue-400",
    },
    {
      id: "chat",
      title: text.menu.sidebar.messages,
      icon: <MessageCircle />,
      badge: 2,
      color: "text-sports-badminton",
      gradient: "from-sports-badminton to-purple-400",
    },
  ];
  

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        ref={overlayRef}
        className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      />

      <nav
        ref={sidebarRef}
        className={`
          fixed lg:static
          top-0 left-0
          w-64 h-full
          flex-shrink-0
          bg-light-background dark:bg-dark-background
          border-r border-light-border dark:border-dark-border
          p-4 py-3 overflow-y-auto md:py-6
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {isMobile && (
          <div className="flex items-center gap-3 flex-1">
            <button onClick={toggle} className="md:hidden mr-2">
              <Menu className="h-6 w-6" />
            </button>
            <div className="cursor-pointer flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="h-10 w-auto"
              />
              <span className="font-bold md:text-2xl text-lg sm:inline-block ml-1 mt-1 font-dancing ">
                Let's Play
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-8 lg:mt-0">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

export default SideBar;
