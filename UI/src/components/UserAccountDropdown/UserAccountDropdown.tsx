import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User as HeroUser,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { signOut, fetchUserAttributes } from "@aws-amplify/auth";
import { User } from "../../interfaces";

const UserAccountDropdown = () => {
  const [userInitials, setUserInitials] = useState<string>("");
  const [user, setUser] = useState<User>();

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
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem key="avatar" className="h-14 gap-2">
            <HeroUser
              avatarProps={{
                name: userInitials,
                size: "sm",
              }}
              description={user?.email}
              name={`${user?.name} ${user?.familyName}`}
            />
          </DropdownItem>
          <DropdownItem key="profile">Profile</DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Log Out">
          <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(UserAccountDropdown);
