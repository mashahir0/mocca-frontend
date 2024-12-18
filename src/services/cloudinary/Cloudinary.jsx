import axios from "axios";

// Function to upload an image to Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "n48zfy6l");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/duxonphq6/image/upload`,
      formData
    );

    return response.data.secure_url; // Cloudinary URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    throw new Error("Image upload failed");
  }
};
