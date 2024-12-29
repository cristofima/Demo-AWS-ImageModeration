import React, { useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api-service";
import "./Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    setIsUploading(true);

    try {
      await apiService.uploadImage(formData);
      setSelectedFile(null);
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="file-input"
      />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="button upload-button"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;
