"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
const AnswerCard = ({ answer }) => {
  const { user } = useSessionContext();
  const [isUpvoted, setIsUpvoted] = useState(answer.alreadyUpvoted);
  const [upvotes, setUpvotes] = useState(answer.upvotes.length);
  const [downvotes, setDownvotes] = useState(answer.downvotes.length);
  const [isDownvoted, setIsDownvoted] = useState(answer.alreadyDownvoted);
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
      const response = await axios.post(`/answer/vote`, {
        type,
        answerId: answer.id,
        userId: user.id,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={answer.user.image} />
            <AvatarFallback>{answer.user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-semibold">{answer.user.username}</span>
              {/* <span className="text-gray-500 text-sm">answered {answer.createdAt}</span> */}
            </div>
            <div className="prose prose-sm max-w-none mb-4">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {answer.body}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isUpvoted || !user}
                  onClick={() => handleVote("upvote")}
                  className="flex items-center space-x-1 hover:bg-[#ecb632] transition-colors duration-500 ease-in-out"
                >
                  <ChevronUp
                    className={`w-4 h-4 ${
                      isUpvoted ? "text-green-500" : "text-muted-foreground"
                    }`}
                  />
                  <span className={`${isUpvoted ? "upvote-animate" : ""}`}>{upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 hover:bg-[#ecb632] transition-colors duration-500 ease-in-out"
                  disabled={isDownvoted || !user}
                  onClick={() => handleVote("downvote")}
                >
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isDownvoted ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <span className={`${isDownvoted ? "downvote-animate" : ""}`}>{downvotes}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
