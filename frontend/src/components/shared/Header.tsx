"use client";
import { AvatarIcon } from "@/components/ui/AvatarIcon";
import { Navbar, NavbarBrand } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  username: string;
  avatarImage: string;
  // onLogout: () => void;
}

export function Header({ username, avatarImage }: HeaderProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <Navbar fluid className="p-3 md:p-5 md:px-8 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        {/* logo */}
        <div className="flex items-center gap-10">
          <NavbarBrand as={Link} href="/">
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Quiz
            </span>
          </NavbarBrand>

          {/* nav */}
          <div className="flex items-center gap-6">
            <a href="/" className={`list-image-none ${pathname === "/" ? "" : ""}`}>
              Home
            </a>
            <a href="/quiz" className="list-image-none">
              Quiz
            </a>
          </div>
        </div>

        {/* avatar and menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <span className="hidden md:inline-block">{username}</span>
            <AvatarIcon avatarImage={avatarImage} avatarSize="sm" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg p-2 z-50 border border-gray-200">
              <Link
                href="/"
                onClick={handleMenuItemClick}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Image
                  src="/assets/icons/setting.svg"
                  alt="user setting"
                  className="mr-3"
                  width={16}
                  height={16}
                />
                Setting
              </Link>
              <button
                onClick={() => {
                  handleMenuItemClick();
                  // onLogout();
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Image
                  src="/assets/icons/door.svg"
                  alt="logout"
                  className="mr-3"
                  width={16}
                  height={16}
                />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
}
