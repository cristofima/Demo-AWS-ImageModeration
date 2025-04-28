import { useEffect, useCallback } from "react";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useUserStore } from "./useUserStore";
import { toast } from "react-toastify";

export const useUserData = () => {
  const { user, setUser, updateUser } = useUserStore();

  const fetchUserDetails = useCallback(async () => {
    try {
      const { email, name, family_name, nickname } =
        await fetchUserAttributes();
      if (name || family_name) {
        setUser({ email, name, nickname, familyName: family_name });
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  }, [setUser]);

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [user]);

  return { user, updateUser };
};
