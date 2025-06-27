"use client";

import { useState, useEffect } from "react";

import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import DiscussionCard from "./Discussions/DiscussionCard";
const ExistingDiscussions = ({ questionId , refreshFlag }) => {
  const { user } = useSessionContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    if(!user) return;
    const getData = async () => {
      try {
        const response = await axios.post("/discussion/getDiscussionsForQuestion", {
          questionId,
          userId: user.id,
        });
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        console.log("Something went wrong",err);
      }
    }
    getData();
  },[user,refreshFlag,questionId])
 
  return (
    <div className="space-y-4">
      {data?.map((discussion) => (
        <DiscussionCard discussion={discussion} key={discussion.id} />
      ))}
    </div>
  );
};

export default ExistingDiscussions;
