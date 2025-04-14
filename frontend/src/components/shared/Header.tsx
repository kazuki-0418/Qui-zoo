import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  username: string;
  avatarImage: string;
  onLogout: () => void;
}

export const header = ({ username, avatarImage, onLogout }: HeaderProps) => {
  const pathname = usePathname();
  return (
    <Navbar fluid className="border-b">
      <NavbarBrand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          MACS
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex items-center gap-2">
              <Avatar alt="User avatar" img={avatarImage} rounded />
              <span>{username}</span>
            </div>
          }
        >
          <DropdownHeader>
            <span className="block text-sm">{username}</span>
          </DropdownHeader>
          <DropdownItem onClick={onLogout}>Logout</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink as={Link} href="/" active={pathname === "/"}>
          Home
        </NavbarLink>
        <NavbarLink as={Link} href="/quiz" active={pathname === "/quiz"}>
          Quiz
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};
