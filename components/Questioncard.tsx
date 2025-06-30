import React from "react";
import { Button } from "./ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { useTimeAgo } from "@/hooks/useTimeAgo";
const Questioncard = ({ question }) => {
  const timeAgo = useTimeAgo(question.createdAt);
  return (
    <div className="flex items-start space-x-3 relative">
      <Avatar className="w-10 h-10">
        <AvatarImage src={question.user.image} />
        <AvatarFallback>{question.user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold">{question.user.username}</span>
          <span className="text-gray-500 text-sm">asked {timeAgo}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
        <p className="text-gray-700 mb-3 max-h-12 overflow-hidden">{question.body}</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={true}
              className="flex items-center space-x-1"
            >
              <ChevronUp className={`w-4 h-4 `} />
              <span>{question._count.upvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={true}
              className="flex items-center space-x-1"
            >
              <ChevronDown className={`w-4 h-4 `} />
              <span>{question._count.downvotes}</span>
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
      {question.image && (
        <img
          src={question.image}
          alt="no image"
          className="hidden sm:block max-h-32 ml-auto rounded-sm"
        />
      )}
    </div>
  );
};

export default Questioncard;
