import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User as HeroUser,
  Tooltip,
} from "@heroui/react";
import React from "react";
import { signOut } from "@aws-amplify/auth";
import { useUserData } from "../../hooks";
import { truncateString } from "../../utils/helpers";

const UserAccountDropdown = () => {
  const { user } = useUserData();

  const handleSignOut = async () => {
    await signOut();
  };

  const userInitials =
    user?.name && user?.familyName
      ? `${user.name[0]}${user.familyName[0]}`.toUpperCase()
      : "";

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          className="transition-transform"
          color="primary"
          name={userInitials}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem key="avatar" className="h-14 gap-2">
            <Tooltip
              color="foreground"
              content={`${user?.name} ${user?.familyName}`}
            >
              <HeroUser
                avatarProps={{
                  name: userInitials,
                  size: "sm",
                }}
                description={user?.email}
                name={truncateString(`${user?.name} ${user?.familyName}`, 22)}
              />
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="profile" href="/profile">
            Profile
          </DropdownItem>
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
