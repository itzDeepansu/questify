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
const DiscussionCard = ({ discussion }) => {
  const { user } = useSessionContext();
  const [isUpvoted, setIsUpvoted] = useState(discussion.alreadyUpvoted);
  const [upvotes, setUpvotes] = useState(discussion.upvotes.length);
  const [downvotes, setDownvotes] = useState(discussion.downvotes.length);
  const [isDownvoted, setIsDownvoted] = useState(discussion.alreadyDownvoted);
  const handleVote = async (type: string) => {
    try {
      if (type === "upvote") {
        setIsUpvoted(true);
        setUpvotes(upvotes + 1);
        setIsDownvoted(false);
        if (downvotes > 0) setDownvotes(downvotes - 1);
      } else {
        setIsUpvoted(false);
        if (upvotes > 0) setUpvotes(upvotes - 1);
        setIsDownvoted(true);
        setDownvotes(downvotes + 1);
      }
      const response = await axios.post(`/discussion/vote`, {
        type,
        discussionId: discussion.id,
        userId: user.id,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };
  return (
    <Card >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={discussion.user.image} />
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
                  onClick={() => handleVote("upvote")}
                  disabled={isUpvoted || !user}
                  className="flex items-center space-x-1 h-7 text-xs"
                >
                  <ChevronUp
                    className={`w-4 h-4 ${
                      isUpvoted ? "text-green-500" : "text-muted-foreground"
                    }`}
                  />
                  <span>{upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  disabled={isDownvoted || !user}
                  onClick={() => handleVote("downvote")}
                >
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isDownvoted ? "text-green-500" : "text-muted-foreground"
                    }`}
                  />
                  <span>{downvotes}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionCard;
