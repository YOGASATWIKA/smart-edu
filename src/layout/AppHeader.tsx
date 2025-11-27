import {useEffect, useRef, useState} from "react";

import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const [isDesktopOpen, setDesktopOpen] = useState(false);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            // DESKTOP
            setDesktopOpen(!isDesktopOpen);
            toggleSidebar();
        } else {
            // MOBILE
            toggleMobileSidebar();
        }
    };


    const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-9 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
        <div className="flex w-full items-center justify-between px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200 dark:border-gray-800">
            {/* Left Section */}
            <div className="flex items-center ">
                <button
                    className="flex items-center justify-center rounded-lg border lg:border-none border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={handleToggle}
                    aria-label="Toggle Sidebar"
                >
                    {window.innerWidth >= 1024 ? (
                        isDesktopOpen ? (
                            <span className="text-xl font-bold">&lt;</span>
                        ) : (
                            <span className="text-xl font-bold">&gt;</span>
                        )
                    ) : (
                        isMobileOpen ? (
                            <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6L6 18M6 6L18 18" />
                            </svg>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 6H20M4 12H20M4 18H20" />
                            </svg>
                        )
                    )}
                </button>
            </div>


            <div className="flex w-full justify-center lg:justify-end lg:mr-5">
                <UserDropdown />
            </div>
            <ThemeToggleButton />
        </div>

    </header>
  );
};

export default AppHeader;
