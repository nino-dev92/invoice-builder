"use client"; // uses the useTheme hook and an onClick handler

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="font-semibold">Invoice App</span>
      </Link>

      <button
        onClick={toggleTheme}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 cursor-pointer"
      >
        {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
      </button>
    </header>
  );
}
