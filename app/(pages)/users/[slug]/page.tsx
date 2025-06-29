import React from "react";
import Navbar from "@/components/Navbar";
import UserProfile from "@/components/User/UserProfile";
const page = () => {
  return (
    <div className="max-w-100dvw max-h-100dvh">
      <Navbar />
      <UserProfile />
    </div>
  );
};

export default page;
