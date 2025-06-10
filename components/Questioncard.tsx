import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronUp , ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { useSessionContext } from "@/context/SessionContext";
import axios from "@/libs/axios";
const Questioncard = ({ question }) => {
  const { user } = useSessionContext();
  const [isUpvoted, setIsUpvoted] = useState(question.alreadyUpvoted);
  const [upvotes, setUpvotes] = useState(question._count.upvotes);
  const [downvotes, setDownvotes] = useState(question._count.downvotes);
  const [isDownvoted, setIsDownvoted] = useState(question.alreadyDownvoted);
  const handleVote = async (
    type: string,
  ) => {
    try {
      if (type === "upvote") {
        setIsUpvoted(true);
        setUpvotes(upvotes + 1);
        setIsDownvoted(false);
        setDownvotes(downvotes - 1);
      }else{
        setIsUpvoted(false);
        setUpvotes(upvotes - 1);
        setIsDownvoted(true);
        setDownvotes(downvotes + 1);
      }
      const response = await axios.post(`/question/vote`, {
        type,
        questionId : question.id,
        userId : user.id,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={question.user.image || "/globe.svg"} />
        <AvatarFallback>{question.user.username}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold">{question.user.username}</span>
          <span className="text-gray-500 text-sm">asked</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
        <p className="text-gray-700 mb-3">{question.body}</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpvoted || !user}
              onClick={() => handleVote("upvote")}
              className="flex items-center space-x-1"
            >
              <ChevronUp
                className={`w-4 h-4 ${
                  isUpvoted
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              />
              <span>{upvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpvoted || !user}
              onClick={() => handleVote("downvote")}
              className="flex items-center space-x-1"
            >
              <ChevronDown
                className={`w-4 h-4 ${
                  isDownvoted
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              />
              <span>{downvotes}</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            {question.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {topic.topic.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questioncard;
