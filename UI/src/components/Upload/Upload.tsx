import React, { useState, useTransition, useCallback } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api-service";
import "./Upload.css";
import { AxiosError } from "axios";
import { Button } from "@heroui/react";
import { Input } from "@heroui/input";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, startTransition] = useTransition();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      setSelectedFile(file);
    },
    []
  );

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        await apiService.uploadImage(formData);
        setSelectedFile(null);
        (document.getElementById("file-input") as HTMLInputElement).value = "";
        toast.success("Image uploaded successfully");
      } catch (e: unknown) {
        if (e instanceof AxiosError && e?.response?.data?.message) {
          toast.error(e.response.data.message);
        } else {
          toast.error("Failed to upload image");
        }
      }
    });
  }, [selectedFile]);

  return (
    <div className="upload-container">
      <Input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        isDisabled={isUploading}
      />
      <Button
        color="primary"
        onPress={handleUpload}
        isDisabled={!selectedFile || isUploading}
        isLoading={isUploading}
      >
        {isUploading ? "Uploading" : "Upload"}
      </Button>
    </div>
  );
};

export default React.memo(Upload);
