import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutAccount } from "@/actions/auth/logoutAccount";

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return isDesktop;
};

export const useUserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const handleAvatarClick = () => {
    if (avatarButtonRef.current) {
      const rect = avatarButtonRef.current.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 1024;
      const menuWidth = 200; 
      
      if (isDesktop) {
        setMenuPosition({
          top: rect.top - 12,
          left: rect.left,
        });
      } else {
        const idealMenuLeft = rect.left + rect.width / 2 - menuWidth / 2;
        const maxMenuLeft = window.innerWidth - menuWidth - 16;
        const clampedMenuLeft = Math.min(Math.max(16, idealMenuLeft), maxMenuLeft);
        
        setMenuPosition({
          top: rect.bottom + 12, 
          left: clampedMenuLeft,
        });
      }
      
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleLogout = async () => {
    await logoutAccount();
    closeMenu();
    router.refresh();
  };

  const handleLogin = () => {
    router.push("/login");
    closeMenu();
  };

  const handleRegister = () => {
    router.push("/register");
    closeMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      const isClickOnAvatar = avatarButtonRef.current && avatarButtonRef.current.contains(target);
      
      if (isClickOutsideMenu && !isClickOnAvatar) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, closeMenu]);

  return {
    isMenuOpen,
    menuPosition,
    avatarButtonRef,
    menuRef,
    isDesktop,
    handleAvatarClick,
    closeMenu,
    handleLogout,
    handleLogin,
    handleRegister,
  };
};
