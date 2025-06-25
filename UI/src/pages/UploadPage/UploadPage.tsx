import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Tabs,
  Tab,
} from "@heroui/react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../config/constants";
import { FaFloppyDisk } from "react-icons/fa6";
import { MultiFileUpload } from "../../components";
import { useUploadPost, useUploadMultiplePosts } from "../../hooks";

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("single");

  const uploadSingleMutation = useUploadPost();
  const uploadMultipleMutation = useUploadMultiplePosts();

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

  const handleSingleUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      await uploadSingleMutation.mutateAsync(formData);
      resetFileInput();
    } catch (error) {
      // Error is already handled in the mutation's onError
      console.error("Upload error:", error);
    }
  }, [selectedFile, uploadSingleMutation, resetFileInput]);

  const handleMultipleUpload = useCallback(
    async (files: FileWithPreview[]) => {
      if (files.length === 0) return;

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(`images`, file);
        });

        await uploadMultipleMutation.mutateAsync(formData);
      } catch (error) {
        // Error is already handled in the mutation's onError
        console.error("Multiple upload error:", error);
      }
    },
    [uploadMultipleMutation]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Upload Images
        </h1>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="w-full"
          classNames={{
            tabList: "grid w-full grid-cols-2",
          }}
        >
          <Tab key="single" title="Single Upload">
            <Card className="max-w-[400px] mx-auto mt-6 shadow-lg bg-white rounded-lg border border-gray-200">
              <CardBody className="flex flex-col items-center justify-center p-6">
                <div className="w-full mb-4">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Upload a single image file (PNG, JPEG, up to 5MB)
                  </p>
                  <Input
                    id="file-input"
                    data-testid="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    isDisabled={uploadSingleMutation.isPending}
                    variant="bordered"
                  />
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  data-testid="upload-button"
                  onPress={handleSingleUpload}
                  isDisabled={!selectedFile || uploadSingleMutation.isPending}
                  isLoading={uploadSingleMutation.isPending}
                  className="w-full"
                  startContent={
                    !uploadSingleMutation.isPending && <FaFloppyDisk />
                  }
                >
                  {uploadSingleMutation.isPending
                    ? "Uploading..."
                    : "Upload Image"}
                </Button>
              </CardFooter>
            </Card>
          </Tab>

          <Tab key="multiple" title="Multiple Upload">
            <MultiFileUpload
              onUpload={handleMultipleUpload}
              isUploading={uploadMultipleMutation.isPending}
              maxFiles={10}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default React.memo(UploadPage);
