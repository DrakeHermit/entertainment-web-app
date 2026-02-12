"use client";

import { LogOut, LogIn, UserPlus } from "lucide-react";
import { User } from "@/lib/types/types";

type UserMenuProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  position: {
    top: number;
    left: number;
  };
  menuRef: React.RefObject<HTMLDivElement | null>;
  isDesktop: boolean;
  handleLogout: () => void;
  handleLogin: () => void;
  handleRegister: () => void;
};

const UserMenu = ({
  user,
  isOpen,
  onClose,
  position,
  menuRef,
  isDesktop,
  handleLogout,
  handleLogin,
  handleRegister,
}: UserMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />

      <div
        ref={menuRef}
        className="fixed z-50 bg-semi-dark-blue border border-white/10 rounded-lg shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: position.top,
          left: position.left,
          transform: isDesktop ? "translateY(-100%)" : "none",
        }}
      >
        {user ? (
          <div className="py-2">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium text-white">
                {user.username || "User"}
              </p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 group cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-white/60 group-hover:text-red transition-colors" />
              <span className="group-hover:text-red transition-colors">
                Logout
              </span>
            </button>
          </div>
        ) : (
          <div className="py-2">
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 group cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white/60 group-hover:text-red transition-colors" />
              <span className="group-hover:text-red transition-colors">
                Login
              </span>
            </button>

            <button
              onClick={handleRegister}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 group cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white/60 group-hover:text-red transition-colors" />
              <span className="group-hover:text-red transition-colors">
                Sign Up
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;
