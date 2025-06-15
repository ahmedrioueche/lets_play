"use client";
import { useEffect } from "react";

const Dropdown = ({
  children,
  isOpen,
  onClose,
  position = "right-4",
  width = "w-48",
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: string;
  width?: string;
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement).closest(".dropdown-container")) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`dropdown-container absolute top-16 ${position} bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50 ${width}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default Dropdown;
