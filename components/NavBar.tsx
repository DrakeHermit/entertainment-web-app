"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import iconHome from "@/assets/icon-nav-home.svg";
import iconMovies from "@/assets/icon-nav-movies.svg";
import iconTv from "@/assets/icon-nav-tv-series.svg";
import iconBookmark from "@/assets/icon-nav-bookmark.svg";

const navItems = [
  { href: "/", icon: iconHome, label: "Home" },
  { href: "/movies", icon: iconMovies, label: "Movies" },
  { href: "/tv-series", icon: iconTv, label: "TV Series" },
  { href: "/bookmarks", icon: iconBookmark, label: "Bookmarks" },
];

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-semi-dark-blue flex justify-between lg:justify-start lg:flex-col items-center py-200 px-200 md:px-250 md:py-250 lg:px-350 lg:py-400 md:rounded-2xl lg:gap-900 h-fit lg:h-[calc(100vh-64px)] lg:fixed lg:left-8 lg:top-8">
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          width={25}
          height={20}
          className="md:w-[33px] md:h-[27px]"
        />
      </Link>

      <div className="flex lg:flex-col gap-4 md:gap-6 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all hover:brightness-200 ${
                isActive ? "brightness-200" : "opacity-60"
              }`}
              title={item.label}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className="md:w-250 md:h-250"
              />
            </Link>
          );
        })}
      </div>

      <Link
        href="/register"
        className="lg:mt-auto opacity-60 hover:opacity-100 transition-opacity"
        title="Login/Register"
      >
        <UserCircle
          className="w-6 h-6 md:w-7 md:h-7 text-white"
          strokeWidth={1.5}
        />
      </Link>
    </nav>
  );
};

export default NavBar;
