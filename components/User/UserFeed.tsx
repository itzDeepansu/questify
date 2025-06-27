"use client";
import React, { useEffect, useState } from "react";
import axios from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HelpCircle, MessageSquare, MessageCircle } from "lucide-react";
import Link from "next/link";
const UserCard = ({ user }) => {
  return (
    <Link key={user.id} href={`/users/${user.id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-100 rounded-full p-2 border border-gray-200">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-gray-300 text-gray-700 font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
              @{user.username}
            </h3>
            <p className="text-gray-500 text-sm">
              Member since {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-xl p-4 text-center border border-gray-200">
            <div className="flex flex-col items-center gap-1">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              <span className="text-lg font-semibold text-gray-800">{user._count.questions}</span>
              <span className="text-xs text-gray-500">Questions</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center border border-gray-200">
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold text-gray-800">{user._count.answers}</span>
              <span className="text-xs text-gray-500">Answers</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center border border-gray-200">
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="h-5 w-5 text-purple-500" />
              <span className="text-lg font-semibold text-gray-800">{user._count.discussions}</span>
              <span className="text-xs text-gray-500">Discussions</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
const UserFeed = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.post("/user/getUsers", { page: pageNum });
      setUsers((prev) => [...prev, ...res.data.users]);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Explore Community</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserFeed;
