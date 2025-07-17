import axios from "axios";

// Access environment variables using import.meta.env
// Vite automatically loads .env variables and exposes them with VITE_ prefix
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // Assuming you added this to .env

// Basic validation to ensure env variables are loaded (optional but good for debugging)
if (!CLOUD_NAME) {
  console.error("VITE_CLOUDINARY_CLOUD_NAME is not defined in your .env file!");
  // You might want to throw an error or handle this more gracefully in production
}
if (!UPLOAD_PRESET) {
    console.error("VITE_CLOUDINARY_UPLOAD_PRESET is not defined in your .env file!");
}


const upload = async (file) => {
  if (!file) {
    console.error("No file provided for upload.");
    return null; // Or throw an error
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );

    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err.response ? err.response.data : err.message);
    throw err; // Re-throw to propagate the error
  }
};

export default upload;