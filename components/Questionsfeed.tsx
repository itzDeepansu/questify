"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import Questioncard from "./Questioncard";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import Link from "next/link";
const Questionsfeed = ({refreshFlag}) => {
  const { user } = useSessionContext();
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    if (!user) return;
    const fetchQuestions = async () => {
      try {
        const response = await axios.post("/question/getQuestions", {
          userId: user?.id,
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [user,refreshFlag]);
  const handleUpvote = async (
    type: string,
    questionId: number,
    userId: number
  ) => {
    console.log(type, questionId, userId);
    try {
      const response = await axios.post(`/${type}/upvote`, {
        questionId,
        userId,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="overflow-hidden hover:bg-slate-100/50">
          <Link href={`/question/${question.id}`}>
            <CardContent className="py-2 px-8">
              <Questioncard handleUpvote={handleUpvote} question={question} />
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Questionsfeed;
