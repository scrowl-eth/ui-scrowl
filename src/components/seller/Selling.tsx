"use client";
import { useState } from "react";
import Image from "next/image";

const Selling = () => {
  const [shopName, setShopName] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null); // State for image preview

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleSubmit = () => {
    // Logic to create the shop
    console.log("Shop created:", { shopName, openingTime, closingTime, isAlwaysOpen, profileImage });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Your Store on Our Platform</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please fill out the form below to start selling. Your data is confidential and will not be shared with third parties.
      </p>

      {/* Merchant Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <p className="text-lg font-semibold">Revo Arya</p> {/* Replace with dynamic username if available */}
      </div>

      {/* Profile Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Store Profile Picture</label>
        <label className="mt-1 flex items-center justify-center border-2 border-dashed rounded-md w-24 h-24 cursor-pointer relative">
          <input
            type="file"
            accept=".jpg,.png,.gif"
            onChange={handleImageChange}
            className="opacity-0 absolute inset-0 cursor-pointer"
          />
          {profileImagePreview ? (
            <Image width={'100'} height={100} src={profileImagePreview} alt="Profile Preview" className="w-full h-full object-cover rounded-md" />
          ) : (
            <span className="text-gray-500">Upload Image</span>
          )}
        </label>
        <p className="mt-2 text-sm text-gray-500">Max file size: 2MB (.JPG, .PNG, .GIF). Recommended dimensions: 300x300 pixels.</p>
      </div>

      {/* Shop Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Shop Name</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Enter your shop name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF684B]"
        />
        <p className="mt-1 text-sm text-gray-500">Only letters, numbers, and spaces are allowed. Shop name cannot be changed.</p>
      </div>

      {/* Operating Hours */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Store Operating Hours</label>
        <div className="flex items-center space-x-4">
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            disabled={isAlwaysOpen}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF684B]"
          />
          <span className="text-sm">-</span>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            disabled={isAlwaysOpen}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF684B]"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAlwaysOpen}
              onChange={() => setIsAlwaysOpen(!isAlwaysOpen)}
              className="h-4 w-4 text-[#FF684B] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Set store as always open (24/7)</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Orders placed outside operating hours will not decrease your store rating. Only set 24/7 if you manage the store alone.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Create Store Now
      </button>
    </div>
  );
};

export default Selling;
