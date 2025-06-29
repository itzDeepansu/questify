"use client";
import React, { useEffect, useState } from "react";
import axios from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface Topic {
  id: number;
  name: string;
  image: string;
}

const TopicsFeed = () => {
    const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
const topicClickHandler = (topicName: string) => {
  router.push(`/topic/${topicName}`);
}
  const fetchTopics = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.post("/topic/getTopics", { page: pageNum });
      setTopics((prev) => [...prev, ...res.data.topics]);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Explore Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const backgroundImage = topic.image?.trim()
            ? topic.image
            : "/questify_logo.png";

          return (
            <div
              key={topic.id}
              className="relative h-40 rounded-xl overflow-hidden group shadow-md bg-white hover:cursor-pointer text-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => topicClickHandler(topic.name)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-200 group-hover:transform group-hover:scale-1"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-4xl font-semibold z-10 group-hover:hidden">
                  {topic.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicsFeed;
