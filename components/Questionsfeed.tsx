"use client";
import React, { useState , useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import Questioncard from "./Questioncard";
import axios from "@/libs/axios";
const Questionsfeed = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/question/getQuestions");
        setQuestions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  },[]);
  const handleUpvote = async (type: string, questionId: number,userId: number) => {
    try {
      const response = await axios.put(`/${type}/upvote`,{
        questionId,
        userId,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  }
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="py-2 px-8">
            <Questioncard handleUpvote={handleUpvote} question={question} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Questionsfeed;
