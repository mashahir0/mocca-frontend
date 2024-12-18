import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api/userApi";
import Loading from "../common/Loading";

export default function ProfileInfo() {
  const { user } = useSelector((state) => state.user);
  const id = user?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: async () => {
      const response = await axios.get(`/user-details/${id}`);
      return response.data;
    },
    enabled: !!id, // Only fetch if ID exists
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error.message} />;
  }

  return (
    <div className="max-w-sm mx-auto p-6 my-[100px] bg-white rounded-lg text-center">
      <div className="mb-4">
        <img
          src={data.user.profileImage}
          alt="User Avatar"
          className="w-24 h-24 mx-auto rounded-full bg-yellow-200"
        />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-medium">Name: {data?.user?.name}</p>
        <p className="text-sm text-gray-600">Email: {data?.user?.email}</p>
        <p className="text-sm text-gray-600">Phone: {data?.user?.phone}</p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <Link to="/edit-profile">
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
            Update Profile
          </button>
        </Link>
        <Link to="/change-password">
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
            Change password
          </button>
        </Link>
      </div>
    </div>
  );
}
