"use client";

import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import { useParams } from "next/navigation";
const ExistingDiscussions = ({ questionId }) => {
  const { user } = useSessionContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    if(!user) return;
    const getData = async () => {
      try {
        const response = await axios.post("/discussion/getDiscussionsForQuestion", {
          questionId,
          userId: user.id,
        });
        setData(response.data);
        console.log(response.data);
      } catch (err: any) {
        console.log("Something went wrong");
      }
    }
    getData();
  },[user])
  const handleUpvoteDiscussion = async (discussionId) => {
    //LOGIC GOES HERE
  }
  return (
    <div className="space-y-4">
      {data?.map((discussion) => (
        <Card key={discussion.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={discussion.user.image || "/globe.svg"} />
                <AvatarFallback>{discussion.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-sm">
                    {discussion.user.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {discussion.createdAt}
                  </span>
                </div>
                <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                  {discussion.content}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvoteDiscussion(discussion.id)}
                      disabled={discussion.alreadyUpvoted}
                      className="flex items-center space-x-1 h-7 text-xs"
                    >
                      <ChevronUp className="w-3 h-3" />
                      <span>{discussion.upvotes.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      disabled={discussion.alreadyDownvoted}
                    >
                      <ChevronDown className="w-3 h-3" />
                      <span>{discussion.downvotes.length}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExistingDiscussions;
