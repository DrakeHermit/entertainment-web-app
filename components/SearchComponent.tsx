"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const SearchComponent = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 w-full my-300 md:my-400 lg:my-500">
      <Search className="w-6 h-6 md:w-8 md:h-8 text-white shrink-0" />
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search for movies or TV series"
        className="w-full bg-transparent font-medium text-white text-base md:text-2xl placeholder-white/50 py-2 focus:outline-none caret-red border-b border-transparent focus:border-white/30 transition-colors"
      />
    </div>
  );
};
export default SearchComponent;
