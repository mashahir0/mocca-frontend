import React, { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api/adminApi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadToCloudinary } from "../../services/cloudinary/Cloudinary";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    brandName: "",
    stockQuantity: "",
    salePrice: "",
    offerPrice: "",
    size: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([null, null, null]);
  const [croppedImages, setCroppedImages] = useState({
    main: null,
    thumbnails: [null, null, null],
  });
  const [isCropping, setIsCropping] = useState(false);
  const [imageBeingCropped, setImageBeingCropped] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState(null); // Holds the size being edited
  const [sizeStock, setSizeStock] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`/edit-product-details/${id}`);
        const {
          productName,
          description,
          category,
          brandName,
          stockQuantity,
          salePrice,
          offerPrice,
          size,
          mainImage,
          thumbnails,
        } = response.data;
        setFormData({
          productName,
          description,
          category,
          brandName,
          stockQuantity,
          salePrice,
          offerPrice,
          size,
        });
        setMainImage(mainImage);
        setThumbnails(thumbnails || [null, null, null]);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        navigate("/admin/productlist");
      }
    }
    fetchProduct();
  }, [id, navigate]);

  // Refs to handle cropper instances
  const cropperRefs = useRef([null, null, null, null]);

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/list-category");
      return response.data;
    },
  });

  const openModal = (size) => {
    setCurrentSize(size);
    setSizeStock(""); // Reset stock input
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSize(null);
  };

  const calculateTotalStock = () => {
    return formData.size.reduce((total, size) => total + size.stock, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSizeToggle = (size) => {
    const existingSize = formData.size.find((s) => s.name === size);
    if (existingSize) {
      setFormData((prev) => ({
        ...prev,
        size: prev.size.filter((s) => s.name !== size),
      }));
    } else {
      const stock = prompt(`Enter stock quantity for size ${size}:`);
      if (!isNaN(stock) && stock > 0) {
        setFormData((prev) => ({
          ...prev,
          size: [...prev.size, { name: size, stock: Number(stock) }],
        }));
      }
    }
  };

  const handleImageDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "main") {
          setMainImage(reader.result);
          setImageBeingCropped("main");
          setIsCropping(true);
        } else {
          const updatedThumbnails = [...thumbnails];
          const index =
            type === "thumbnail1" ? 0 : type === "thumbnail2" ? 1 : 2;
          updatedThumbnails[index] = reader.result;
          setThumbnails(updatedThumbnails);
          setImageBeingCropped(`thumbnail${index + 1}`);
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = (index) => {
    const updatedThumbnails = [...thumbnails];
    updatedThumbnails[index] = null;
    setThumbnails(updatedThumbnails);
  };

  const handleCrop = () => {
    if (
      cropperRefs.current[
        imageBeingCropped === "main"
          ? 0
          : parseInt(imageBeingCropped.replace("thumbnail", ""))
      ]
    ) {
      const cropperInstance =
        cropperRefs.current[
          imageBeingCropped === "main"
            ? 0
            : parseInt(imageBeingCropped.replace("thumbnail", ""))
        ].cropper;
      if (cropperInstance) {
        const cropped = cropperInstance.getCroppedCanvas().toDataURL();
        if (imageBeingCropped === "main") {
          setCroppedImages((prev) => ({ ...prev, main: cropped }));
          setMainImage(cropped);
        } else {
          const updatedCroppedThumbnails = [...croppedImages.thumbnails];
          const index =
            parseInt(imageBeingCropped.replace("thumbnail", "")) - 1;
          updatedCroppedThumbnails[index] = cropped;
          setCroppedImages((prev) => ({
            ...prev,
            thumbnails: updatedCroppedThumbnails,
          }));
          const updatedThumbnails = [...thumbnails];
          updatedThumbnails[index] = cropped;
          setThumbnails(updatedThumbnails);
        }
        setIsCropping(false);
      }
    }
  };

  const addSizeWithStock = () => {
    if (!isNaN(sizeStock) && sizeStock > 0) {
      setFormData((prev) => ({
        ...prev,
        size: [...prev.size, { name: currentSize, stock: Number(sizeStock) }],
      }));
      closeModal(); // Close modal after adding size
    } else {
      alert("Please enter a valid stock quantity.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.offerPrice > formData.salePrice)
      newErrors.offerPrice = "offer price must lower than sale price";
    if (!formData.productName)
      newErrors.productName = "Product name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.brandName) newErrors.brandName = "Brand name is required";
    // if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    if (!formData.salePrice) newErrors.salePrice = "Sale price is required";
    if (!formData.offerPrice) newErrors.offerPrice = "Offer price is required";
    if (formData.size.length === 0)
      newErrors.size = "Please select at least one size";
    if (!mainImage) newErrors.mainImage = "Please upload a main product image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("Main Image:", mainImage);
        console.log("Thumbnails:", thumbnails);

        if (!mainImage) throw new Error("Main image is required");
        const mainImageUrl = await uploadToCloudinary(mainImage);

        const thumbnailsUrls = await Promise.all(
          thumbnails.map(async (thumbnail) => {
            if (!thumbnail) return null;
            try {
              return await uploadToCloudinary(thumbnail);
            } catch (error) {
              console.error("Failed to upload thumbnail:", error);
              return null;
            }
          })
        );

        const totalStock = calculateTotalStock();

        const formDataToSubmit = {
          ...formData,
          mainImage: mainImageUrl,
          thumbnails: thumbnailsUrls,
          size: formData.size,
          stockQuantity: totalStock,
        };

        // Log final form data for debugging
        console.log("Form data to submit:", formDataToSubmit);

        await axios.put(`/update-product/${id}`, formDataToSubmit);
        navigate("/admin/productlist");

        // Navigate on success
        if (response.status === 200) {
          console.log("Product added successfully:", response.data);
          navigate("/admin/productlist");
        } else {
          console.error("Error adding product:", response.data);
        }
      } catch (error) {
        console.error(
          "Error during image upload or backend submission:",
          error
        );
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Product Details</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              {isLoading ? (
                <p className="text-gray-500">Loading categories...</p>
              ) : error ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
              {errors.brandName && (
                <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>
              )}
            </div>

            {/* <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stock quantity"
                />
                {errors.stockQuantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
                )}
              </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sale Price
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="₹450"
                />
                {errors.salePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salePrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Offer Price
                </label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="₹450"
                />
                {errors.offerPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.offerPrice}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex flex-wrap gap-4">
                {formData.size.map(({ name, stock }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      {name}: {stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSizeToggle(name)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {["S", "M", "L", "XL", "XXL"].map(
                  (size) =>
                    !formData.size.find((s) => s.name === size) && (
                      <button
                        key={size}
                        type="button"
                        onClick={() => openModal(size)}
                        className="px-3 py-2 border rounded-lg"
                      >
                        Add {size}
                      </button>
                    )
                )}
              </div>
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
              )}
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                  <h2 className="text-lg font-semibold mb-4">
                    Enter Stock for Size {currentSize}
                  </h2>
                  <input
                    type="number"
                    value={sizeStock}
                    onChange={(e) => setSizeStock(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Enter stock quantity"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addSizeWithStock}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Product Gallery</h2>

            {/* Main Image Upload */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleImageDrop(e, "main")}
              className="border-2 border-dashed p-4 rounded-lg"
            >
              {mainImage ? (
                <div className="relative">
                  <img
                    src={mainImage}
                    alt="Main Image"
                    className="w-full h-auto object-cover"
                    onClick={() => {
                      setImageBeingCropped("main");
                      setIsCropping(true);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(null);
                      setIsCropping(false);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  <ImageIcon size={24} />
                  <p>Drag & Drop or select an image</p>
                  <button
                    onClick={() =>
                      document.getElementById("main-image-upload").click()
                    }
                    type="button"
                    className="text-blue-500 font-semibold"
                  >
                    Select File
                  </button>
                </div>
              )}
              <input
                id="main-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageDrop(e, "main")}
                className="hidden"
              />
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-2">{errors.mainImage}</p>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {thumbnails.map((thumbnail, index) => (
                <div key={index} className="relative">
                  {thumbnail ? (
                    <div>
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-auto object-cover"
                        onClick={() => {
                          setImageBeingCropped(`thumbnail${index + 1}`);
                          setIsCropping(true);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeThumbnail(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      <ImageIcon size={24} />
                      <p>Drag & Drop or select an image</p>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(`thumbnail-${index + 1}-upload`)
                            .click()
                        }
                        className="text-blue-500 font-semibold"
                      >
                        Select File
                      </button>
                    </div>
                  )}
                  <input
                    id={`thumbnail-${index + 1}-upload`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageDrop(e, `thumbnail${index + 1}`)
                    }
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cropping Modal */}
        {isCropping && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl mb-4">Crop Image</h3>
              <Cropper
                src={
                  imageBeingCropped === "main"
                    ? mainImage
                    : thumbnails[
                        parseInt(imageBeingCropped.replace("thumbnail", "")) - 1
                      ]
                }
                ref={(el) =>
                  (cropperRefs.current[
                    imageBeingCropped === "main"
                      ? 0
                      : parseInt(imageBeingCropped.replace("thumbnail", ""))
                  ] = el)
                }
                style={{ width: "400px", height: "400px" }}
                aspectRatio={1}
              />
              <button
                onClick={handleCrop}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Crop
              </button>
              <button
                onClick={() => setIsCropping(false)}
                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Link to="/admin/productlist"> CANCEL</Link>
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}
