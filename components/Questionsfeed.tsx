"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import Questioncard from "./Questioncard";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import Link from "next/link";

const Questionsfeed = ({ refreshFlag }) => {
  const { user } = useSessionContext();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch questions whenever user, page, or refreshFlag changes
  useEffect(() => {
    if (!user) return;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/question/getQuestions", {
          userId: user?.id,
          page,
        });

        if (page === 1) {
          setQuestions(response.data.questions);
        } else {
          setQuestions((prev) => [...prev, ...response.data.questions]);
        }

        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, page, refreshFlag]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="overflow-hidden  hover:bg-[#eab530]/90 transition-colors duration-500 ease-in-out">
          <Link href={`/question/${question.id}`}>
            <CardContent className="py-2 px-8">
              <Questioncard question={question} />
            </CardContent>
          </Link>
        </Card>
      ))}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 mt-4 bg-slate-500 hover:bg-[#eab530]/90 transition-colors duration-500 ease-in-out hover:text-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && questions.length > 0 && (
        <div className="text-center py-4 text-gray-400">No more questions.</div>
      )}
    </div>
  );
};

export default Questionsfeed;
