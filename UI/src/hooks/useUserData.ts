import { useEffect, useCallback } from "react";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useUserStore } from "./useUserStore";
import { toast } from "react-toastify";

export const useUserData = () => {
  const { user, setUser, resetUser, updateUser } = useUserStore();

  const fetchUserDetails = useCallback(async () => {
    try {
      if (user?.email) return;

      const { email, name, family_name, nickname } =
        await fetchUserAttributes();

      if (email) {
        setUser({
          email,
          name: name ?? "",
          nickname: nickname ?? "",
          familyName: family_name ?? "",
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching user details");
      // Don't show error toast during normal operations. This could happen when user is not authenticated yet
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name !== "NotAuthorizedException"
      ) {
        toast.error("Failed to fetch user details");
      }
    }
  }, [user?.email, setUser]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return { user, resetUser, updateUser, fetchUserDetails };
};
