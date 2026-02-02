"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Logo,
  IconHome,
  IconMovies,
  IconTvSeries,
  IconBookmark,
} from "@/components/Icons";
import UserAvatar from "@/components/UserAvatar";

const navItems = [
  { href: "/", Icon: IconHome, label: "Home" },
  { href: "/movies", Icon: IconMovies, label: "Movies" },
  { href: "/tv-series", Icon: IconTvSeries, label: "TV Series" },
  { href: "/bookmarks", Icon: IconBookmark, label: "Bookmarks" },
];

type User = {
  id: number;
  email: string;
  username: string | null;
  avatar_url: string | null;
};

type NavBarProps = {
  user?: User | null;
};

const NavBar = ({ user }: NavBarProps) => {
  const pathname = usePathname();

  return (
    <nav className="bg-semi-dark-blue flex justify-between lg:justify-start lg:flex-col items-center py-200 px-200 md:px-250 md:py-250 lg:px-350 lg:py-400 md:rounded-2xl lg:gap-900 h-fit lg:h-[calc(100vh-64px)] lg:fixed lg:left-8 lg:top-8">
      <Link href="/">
        <Logo className="w-[25px] h-250 md:w-[33px] md:h-[27px] text-red" />
      </Link>

      <div className="flex lg:flex-col gap-4 md:gap-6 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group"
              title={item.label}
            >
              <item.Icon
                className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-[#5A698F] group-hover:text-red"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {user ? (
        <button
          className="lg:mt-auto opacity-60 hover:opacity-100 transition-opacity"
          title={user.username || user.email}
        >
          <UserAvatar user={user} />
        </button>
      ) : (
        <Link
          href="/register"
          className="lg:mt-auto opacity-60 hover:opacity-100 transition-opacity"
          title="Login/Register"
        >
          <UserAvatar user={null} />
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
