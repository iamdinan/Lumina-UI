import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  function closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  // Handle window resizing to automatically adjust sidebar visibility
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <div className="flex flex-1 relative">
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebarOnMobile} />
        <main className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
      <div className="pointer-events-none fixed bottom-5 right-4 z-30 rounded-md bg-[#031226]/95 px-2 py-1 text-[10px] tracking-wide text-neutral-content/70 backdrop-blur-sm">
        Enchanted by <strong className="font-semibold text-neutral-content/90">Dinan</strong> 🪄
      </div>
    </div>
  );
}
