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
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const UserAccountDropdown = () => {
  const { user, resetUser } = useUserData();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      resetUser();
      navigate("/", { replace: true });
    }
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
                description={truncateString(user?.email ?? "", 25)}
                name={truncateString(`${user?.name} ${user?.familyName}`, 22)}
              />
            </Tooltip>
          </DropdownItem>
          <DropdownItem key="profile" href="/profile" startContent={<FaUser />}>
            Profile
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Log Out">
          <DropdownItem
            data-testid="logout-button"
            key="logout"
            color="danger"
            onPress={handleSignOut}
            startContent={<FiLogOut />}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(UserAccountDropdown);
