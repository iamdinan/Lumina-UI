import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
