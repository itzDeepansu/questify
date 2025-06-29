"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { Skeleton } from "@/components/ui/skeleton";
const QuestionSection = ({ questionId }) => {
  const [data, setData] = useState(null);
  const { user } = useSessionContext();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post("/question/getQuestionById", {
          questionId,
          userId: user.id,
        });
        setData(response.data);
        setIsDownvoted(response.data.alreadyDownvoted);
        setIsUpvoted(response.data.alreadyUpvoted);
        setUpvotes(response.data.upvotes.length);
        setDownvotes(response.data.downvotes.length);
        setTimeAgo(useTimeAgo(response.data.createdAt));
      } catch (err) {
        console.log("Something went wrong", err);
      } finally {
        setTimeout(() => {
          setDataLoaded(true);
        }, 900); // 1000ms = 1 second
      }
    };
    getData();
  }, [user?.id, questionId]);
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
      await axios.post(`/question/vote`, {
        type,
        questionId,
        userId: user.id,
        actor_image: data.user.image,
        actor_username: data.user.username,
        actorId: data.user.id,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3 relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={data?.user?.image} />
              <AvatarFallback>{data?.user?.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{data?.user?.username}</span>
                {!dataLoaded && <Skeleton className="h-4 w-30" />}
                <span className="text-gray-500 text-sm">asked {timeAgo}</span>
                {!dataLoaded && <Skeleton className="h-4 w-30" />}
              </div>
              <h1 className="text-2xl font-bold mb-3">{data?.title}</h1>
              {!dataLoaded && <Skeleton className="h-8 w-44" />}
              <p className="text-gray-700 mb-4 leading-relaxed">{data?.body}</p>
              {!dataLoaded && <Skeleton className="h-8 w-52" />}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        isUpvoted || !user || data?.user?.id === user.id
                      }
                      onClick={() => handleVote("upvote")}
                      className="flex items-center space-x-1 hover:bg-[#ecb632] transition-colors duration-500 ease-in-out"
                    >
                      <ChevronUp
                        className={`w-4 h-4 ${
                          isUpvoted ? "text-green-500" : "text-muted-foreground"
                        }`}
                      />
                      <span className={`${isUpvoted ? "upvote-animate" : ""}`}>
                        {upvotes}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        isDownvoted || !user || data?.user?.id === user.id
                      }
                      onClick={() => handleVote("downvote")}
                      className="flex items-center space-x-1 hover:bg-[#ecb632] transition-colors duration-500 ease-in-out"
                    >
                      <ChevronDown
                        className={`w-4 h-4 ${
                          isDownvoted ? "text-red-500" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`${isDownvoted ? "downvote-animate" : ""}`}
                      >
                        {downvotes}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* <div className="flex space-x-2 mt-4">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div> */}
            </div>
            {!dataLoaded && <Skeleton className="h-32 w-32 ml-auto rounded-sm" />}
            {data?.image && (
              <img
                src={data?.image}
                alt="no image"
                className="max-h-32 ml-auto rounded-sm"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSection;
