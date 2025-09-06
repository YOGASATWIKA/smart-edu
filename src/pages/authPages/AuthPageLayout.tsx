import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-gray-900 dark:text-blu">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-sky-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="fixed z-50 top-6 right-6">
        <ThemeTogglerTwo />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}