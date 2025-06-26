import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Progress,
  Chip,
} from "@heroui/react";
import { FaUpload, FaTimes, FaImages } from "react-icons/fa";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../config/constants";
import { toast } from "react-toastify";

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

interface MultiFileUploadProps {
  onUpload: (files: FileWithPreview[]) => void;
  isUploading: boolean;
  maxFiles?: number;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onUpload,
  isUploading,
  maxFiles = 10,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} exceeds 5MB limit`);
      return false;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        `File ${file.name} has invalid type. Only JPEG and PNG are allowed.`
      );
      return false;
    }
    return true;
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles: FileWithPreview[] = [];
      const fileArray = Array.from(files);

      if (selectedFiles.length + fileArray.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      fileArray.forEach((file) => {
        if (validateFile(file)) {
          const fileWithPreview = file as FileWithPreview;
          fileWithPreview.id = `${file.name}-${Date.now()}-${Math.random()}`;

          if (file.type.startsWith("image/")) {
            fileWithPreview.preview = URL.createObjectURL(file);
          }

          validFiles.push(fileWithPreview);
        }
      });

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    },
    [selectedFiles, maxFiles]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== fileId);
      // Revoke object URLs to prevent memory leaks
      const fileToRemove = prev.find((file) => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFiles]);

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  }, [selectedFiles, onUpload]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  return (
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg bg-white rounded-lg border border-gray-200">
      <CardBody className="p-6">
        {/* Drop Zone */}
        <div
          data-testid="drop-zone"
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <FaImages className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drag and drop images here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Support for PNG, JPEG files up to 5MB each. Maximum {maxFiles}{" "}
            files.
          </p>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => fileInputRef.current?.click()}
            startContent={<FaUpload />}
            isDisabled={isUploading}
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            data-testid="file-input"
          />
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Selected Files ({selectedFiles.length})
              </h3>
              <Button
                size="md"
                color="danger"
                onPress={clearAllFiles}
                isDisabled={isUploading}
                data-testid="clear-files-button"
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  {file.preview && (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                      data-testid={`file-preview-${selectedFiles.indexOf(
                        file
                      )}`}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      onPress={() => removeFile(file.id!)}
                      isDisabled={isUploading}
                      data-testid={`remove-file-${selectedFiles.indexOf(file)}`}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Uploading files...
              </span>
              <Chip color="primary" variant="flat" size="sm">
                Processing
              </Chip>
            </div>
            <Progress isIndeterminate color="primary" />
          </div>
        )}
      </CardBody>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedFiles.length > 0 && (
            <>Ready to upload {selectedFiles.length} file(s)</>
          )}
        </div>
        <Button
          color="primary"
          onPress={handleUpload}
          isDisabled={selectedFiles.length === 0 || isUploading}
          isLoading={isUploading}
          startContent={!isUploading && <FaUpload />}
          data-testid="upload-files-button"
        >
          {isUploading
            ? "Uploading..."
            : `Upload ${
                selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""
              }`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(MultiFileUpload);
