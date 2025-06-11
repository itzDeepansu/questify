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
import AnswerCard from "./Answer/AnswerCard";
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
        <AnswerCard answer={answer}  key={answer.id} />
      ))}
    </div>
  );
};

export default ExistingAnswers;
