"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/challenge", label: "Calendar", icon: CalendarIcon },
  { href: "/challenge/today", label: "Today", icon: CheckIcon },
  { href: "/photos", label: "Photos", icon: CameraIcon },
  { href: "/books", label: "Books", icon: BookIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-blush-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === "/challenge" && pathname.startsWith("/challenge/day"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-lavender-600"
                  : "text-foreground/50 hover:text-foreground/80"
              )}
            >
              <link.icon className="h-5 w-5" filled={isActive} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function CalendarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={filled ? 2.5 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function CheckIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={filled ? 2.5 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function CameraIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={filled ? 2.5 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  );
}

function BookIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={filled ? 2.5 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
