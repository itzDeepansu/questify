import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { useSessionContext } from "@/context/SessionContext";
const Questioncard = ({ question, handleUpvote }) => {
  const { user } = useSessionContext();
  const [isUpvoted, setIsUpvoted] = useState(question.alreadyUpvoted);
  console.log(question);
  const handleUpVoteClick = () => {
    if(isUpvoted) return;
    setIsUpvoted(true);
    handleUpvote("question", question.id, user?.id);
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
              disabled={isUpvoted}
              onClick={() => handleUpVoteClick()}
              className="flex items-center space-x-1"
            >
              <ChevronUp
                className={`w-4 h-4 ${
                  isUpvoted
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              />
              <span>{question._count.upvotes}</span>
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
