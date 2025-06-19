import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { postService } from "../../services";
import { AxiosError } from "axios";
import { Button, Card, CardBody, CardFooter, Input } from "@heroui/react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../config/constants";
import { FaFloppyDisk } from "react-icons/fa6";

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if (file && file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB");
        return;
      }
      if (file && !ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
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
    <Card className="max-w-[400px] mx-auto mt-10 shadow-lg bg-white rounded-lg border border-gray-200">
      <CardBody className="flex flex-col items-center justify-center p-4">
        <Input
          id="file-input"
          data-testid="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          isDisabled={isUploading}
        />
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          data-testid="upload-button"
          onPress={handleUpload}
          isDisabled={!selectedFile || isUploading}
          isLoading={isUploading}
          className="w-full"
          startContent={!isUploading && <FaFloppyDisk />}
        >
          {isUploading ? "Uploading" : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(UploadPage);
