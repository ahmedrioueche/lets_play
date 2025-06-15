"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import SideBar from "@/components/Sidebar";
import { ThemeProvider } from "./providers";
import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Let's Play</title>
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col h-screen bg-light-background font-stix text-light-text-primary dark:text-dark-text-primary scrollbar-light dark:scrollbar-dark">
      
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <Navbar />
              <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-y-auto p-6 bg-light-background dark:bg-dark-background ">
                  {children}
                </main>
              </div>
            </SettingsProvider>
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
