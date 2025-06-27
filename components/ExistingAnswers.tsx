"use client";

import { useState, useEffect } from "react";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
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
      } catch (err) {
        console.log("Something went wrong",err);
      }
    };
    getData();
  }, [user,refreshFlag,questionId]);
 
  return (
    <div className="space-y-6">
      {data?.map((answer) => (
        <AnswerCard answer={answer}  key={answer.id} />
      ))}
    </div>
  );
};

export default ExistingAnswers;
