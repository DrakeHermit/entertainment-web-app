"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const SearchInput = ({ pathname }: { pathname: string }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value) {
        router.push(`${pathname}?q=${encodeURIComponent(value)}`, {
          scroll: false,
        });
      } else {
        router.push(pathname, { scroll: false });
      }
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  };

  return (
    <input
      type="text"
      value={search}
      onChange={handleChange}
      placeholder="Search for movies or TV series"
      className="w-full bg-transparent font-medium text-white text-base md:text-2xl placeholder-white/50 py-2 focus:outline-none caret-red border-b border-transparent focus:border-white/30 transition-colors"
    />
  );
};

const SearchComponent = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4 w-full my-300 md:my-400 lg:my-500">
      <Search className="w-6 h-6 md:w-8 md:h-8 text-white shrink-0" />
      <SearchInput key={pathname} pathname={pathname} />
    </div>
  );
};

export default SearchComponent;
