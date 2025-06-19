import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import { toast } from "react-toastify";
import { updateUserAttributes } from "@aws-amplify/auth";
import { useUserData } from "../../hooks";
import "./ProfilePage.css";
import { FaFloppyDisk } from "react-icons/fa6";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useUserData();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      nickname: "",
      name: "",
      familyName: "",
    },
  });

  const attributeKeys: Record<string, string> = {
    email: "Email",
    nickname: "Nickname",
    name: "Name",
    familyName: "Family Name",
  };

  useEffect(() => {
    if (user) {
      Object.entries(user).forEach(([key, value]) =>
        setValue(key as keyof typeof user, value)
      );
    }
  }, [user, setValue]);

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const { email, nickname, ...updatableAttributes } = data;
      await updateUserAttributes({
        userAttributes: {
          name: updatableAttributes.name,
          family_name: updatableAttributes.familyName,
          updated_at: Date.now().toString(),
        },
      });
      toast.success("Profile updated successfully");
      updateUser(updatableAttributes);
    } catch {
      toast.error("Failed to update Profile");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-2">
      <CardHeader>
        <h1 className="profile__title">Profile</h1>
      </CardHeader>
      <CardBody>
        <form className="profile__form" onSubmit={handleSubmit(onSubmit)}>
          {Object.entries(attributeKeys).map(([key, label]) => (
            <div key={key} className="profile__field">
              <label htmlFor={key} className="profile__label">
                {label}
              </label>
              <Controller
                name={key as "email" | "name" | "nickname" | "familyName"}
                control={control}
                rules={
                  key === "name" || key === "familyName"
                    ? {
                        required: `${label} is required`,
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: `${label} must contain only letters`,
                        },
                        minLength: {
                          value: 3,
                          message: `${label} must be at least 3 characters`,
                        },
                        maxLength: {
                          value: 50,
                          message: `${label} must be less than 50 characters`,
                        },
                      }
                    : {}
                }
                render={({ field }) => (
                  <Input
                    {...field}
                    id={key}
                    data-testid={key}
                    isRequired
                    isDisabled={
                      ["email", "nickname"].includes(key) || isSubmitting
                    }
                    className="profile__input"
                    maxLength={50}
                    minLength={3}
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.tooShort) {
                        return "Please enter at least 3 characters";
                      }

                      if (validationDetails.tooLong) {
                        return "Please enter less than 51 characters";
                      }

                      if (validationDetails.valueMissing) {
                        return "This field is required";
                      }
                    }}
                  />
                )}
              />
            </div>
          ))}
        </form>
      </CardBody>
      <CardFooter>
        <Button
          data-testid="update-button"
          type="submit"
          color="primary"
          isDisabled={isSubmitting || !user || !isValid}
          isLoading={isSubmitting}
          className="profile__button"
          startContent={!isSubmitting && <FaFloppyDisk />}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(ProfilePage);
