"use client";

import { useState, useEffect } from "react";
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
const QuestionSection = ({ questionId }) => {
    const [data, setData] = useState(null);
    const {user} = useSessionContext();
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post("/question/getQuestionById", {
          questionId,
          userId: user.id,
        });
        setData(response.data);
        console.log(response.data);
      } catch (err: any) {
        console.log("Something went wrong");
      }
    };
    getData();
  }, [user?.id]);
  const handleUpvoteQuestion = () => {
    //upvote logic
  };
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={data?.user?.image || "/globe.svg"} />
              <AvatarFallback>{data?.user?.username}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{data?.user?.username}</span>
                <span className="text-gray-500 text-sm">
                  asked {data?.createdAt}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-3">{data?.title}</h1>
              <p className="text-gray-700 mb-4 leading-relaxed">{data?.body}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUpvoteQuestion}
                      className="flex items-center space-x-1"
                      disabled={data?.alreadyUpvoted}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>{data?.upvotes.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={data?.alreadyDownvoted}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>{data?.downvotes.length}</span>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSection;
