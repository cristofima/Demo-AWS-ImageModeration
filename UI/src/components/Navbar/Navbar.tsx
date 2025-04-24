import React, { useState, useEffect } from "react";
import { signOut, fetchUserAttributes } from "@aws-amplify/auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import { User } from "../../interfaces";

const NavBar = () => {
  const [userInitials, setUserInitials] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const fetchUserDetails = async () => {
    const { email, name, family_name } = await fetchUserAttributes();
    if (name && family_name) {
      const initials = `${name[0]}${family_name[0]}`.toUpperCase();
      setUserInitials(initials);
      setUser({ email, name, familyName: family_name });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">Demo</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/gallery">Gallery</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/upload">Upload</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              showFallback
              as="button"
              className="transition-transform"
              color="secondary"
              name={userInitials}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
              <p className="font-normal">
                {user?.name} {user?.familyName}
              </p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem key="gallery">
          <Link href="/gallery">Gallery</Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="upload">
          <Link href="/upload">Upload</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default React.memo(NavBar);
