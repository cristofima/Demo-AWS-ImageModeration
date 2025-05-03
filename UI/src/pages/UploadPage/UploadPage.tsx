import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { postService } from "../../services";
import "./UploadPage.css";
import { AxiosError } from "axios";
import { Button } from "@heroui/react";
import { Input } from "@heroui/input";

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      setSelectedFile(file);
    },
    []
  );

  const resetFileInput = useCallback(() => {
    setSelectedFile(null);
    (document.getElementById("file-input") as HTMLInputElement).value = "";
  }, []);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile!);

      await postService.uploadPost(formData);
      resetFileInput();
      toast.success("Post created successfully");
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, resetFileInput]);

  return (
    <div className="upload">
      <Input
        id="file-input"
        data-testid="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        isDisabled={isUploading}
        className="upload__input"
      />
      <Button
        color="primary"
        data-testid="upload-button"
        onPress={handleUpload}
        isDisabled={!selectedFile || isUploading}
        isLoading={isUploading}
        className="upload__button"
      >
        {isUploading ? "Uploading" : "Upload"}
      </Button>
    </div>
  );
};

export default React.memo(UploadPage);
