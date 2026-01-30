"use client";

import { logoutAccount } from "@/actions/auth/logoutAccount";

const LogoutButton = () => {
  return (
    <form action={logoutAccount} className="mt-400">
      <button
        type="submit"
        className="bg-red hover:bg-white hover:text-background text-white px-600 py-300 rounded-md font-light text-[15px] transition-colors cursor-pointer inline-block"
      >
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;
