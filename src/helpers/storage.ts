import API from "./api";

interface FileResponse {
  url: string;
}
interface FilesResponse {
  urls: string[];
}

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void
) {
  const formData = new FormData();
  formData.append("file", file);

  return API.post<FileResponse>("/storage/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (!setProgress || !progressEvent.total) {
        return;
      }
      // Calculate the progress percentage
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(progress);
    },
  })
    .then((response) => {
      // Handle success
      console.log("File uploaded successfully:", response.data);
      return response.data.url;
    })
    .catch((error) => {
      // Handle error
      console.error("Error uploading file:", error);
      if (setProgress) setProgress(0); // Reset progress on error
      return {
        description: "Error uploading file please try again",
        type: "error",
      };
    });
}

export async function uploadMany(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return API.post<FilesResponse>("/storage/upload-many", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    // Handle success
    console.log("File uploaded successfully:", response.data);
    return response.data.urls;
  });
}
