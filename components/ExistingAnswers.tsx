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
const ExistingAnswers = ({ questionId ,refreshFlag }) => {
  const { user } = useSessionContext();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!user) return;
    const getData = async () => {
      try {
        const response = await axios.post("/answer/getAnswersForQuestion", {
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
  }, [user,refreshFlag]);
  const handleUpvoteAnswer = async (answerId) => {
    //logic here
  };
  return (
    <div className="space-y-6">
      {data?.map((answer) => (
        <Card key={answer.id}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={answer.user.image || "/globe.svg"} />
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
                      onClick={() => handleUpvoteAnswer(answer.id)}
                      className="flex items-center space-x-1"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>{answer.upvotes.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="w-4 h-4" />
                      <span>{answer.downvotes.length}</span>
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

export default ExistingAnswers;
