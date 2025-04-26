import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import UserAccountDropdown from "../UserAccountDropdown/UserAccountDropdown";
import { toTitleCase } from "../../utils/helpers";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
        {["gallery", "upload"].map((item) => (
          <NavbarItem key={item} isActive={isActive(`/${item}`)}>
            <Link
              color={isActive(`/${item}`) ? "primary" : "foreground"}
              href={`/${item}`}
            >
              {toTitleCase(item)}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <UserAccountDropdown />
      </NavbarContent>

      <NavbarMenu>
        {["gallery", "upload"].map((item) => (
          <NavbarMenuItem key={item} isActive={isActive(`/${item}`)}>
            <Link
              color={isActive(`/${item}`) ? "primary" : "foreground"}
              href={`/${item}`}
            >
              {toTitleCase(item)}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default React.memo(NavBar);
