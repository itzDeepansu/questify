import React from "react";
import Navbar from "@/components/Navbar";
import TopicsFeed from "@/components/Topic/TopicsFeed";
const page = () => {
  return (
    <div className="max-w-100dvw max-h-100dvh">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <TopicsFeed />
      </div>
    </div>
  );
};
export default page;
