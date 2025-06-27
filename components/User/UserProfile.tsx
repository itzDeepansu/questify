"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/libs/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  HelpCircle,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { CircleLoader } from "react-spinners";
import Link from "next/link";
const UserProfile = () => {
  const params = useParams();
  const userId = +params.slug;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.post("user/getPublicUserProfile", {
          id: userId,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);
   if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <CircleLoader color="#000000" loading={loading} size={400} />
      </div>
    );
  }
  if (!user) return <div className="p-8">User not found</div>;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="container mx-auto px-4 py-2">
        <div className="bg-gray-100 rounded-3xl shadow p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <Avatar className="h-40 w-40">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-4xl bg-gray-300 text-white font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-4">@{user.username}</h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 mb-6">
                <CalendarDays className="h-5 w-5" />
                <span className="text-lg">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  label="Questions"
                  count={user.questions.length}
                  color="text-blue-600"
                />
                <StatCard
                  label="Answers"
                  count={user.answers.length}
                  color="text-green-600"
                />
                <StatCard
                  label="Discussions"
                  count={user.discussions.length}
                  color="text-purple-600"
                />
              </div>

              <h3 className="font-bold text-xl mb-4">Interests</h3>
              <div className="flex flex-wrap gap-3">
                {user.interests.map((i: any, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {i.interest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
            <TabsTrigger value="questions" className="rounded-md">
              <HelpCircle className="h-4 w-4 mr-1" /> Questions (
              {user.questions.length})
            </TabsTrigger>
            <TabsTrigger value="answers" className="rounded-md">
              <MessageSquare className="h-4 w-4 mr-1" /> Answers (
              {user.answers.length})
            </TabsTrigger>
            <TabsTrigger value="discussions" className="rounded-md">
              <MessageCircle className="h-4 w-4 mr-1" /> Discussions (
              {user.discussions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {user.questions.map((q: any) => (
              <ContentCard
                key={q.id}
                title={q.title}
                createdAt={q.createdAt}
                votes={q._count.upvotes}
                link={q.id}
              />
            ))}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            {user.answers.map((a: any) => (
              <ContentCard
                key={a.id}
                title={a.question.title}
                createdAt={a.createdAt}
                votes={a._count.upvotes}
                link={a.questionId}
              />
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4">
            {user.discussions.map((d: any) => (
              <ContentCard
                key={d.id}
                title={d.content}
                createdAt={d.createdAt}
                votes={d._count.upvotes}
                link={d.questionId}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 text-center shadow ">
      <div className={`text-3xl font-bold ${color} mb-1`}>{count ?? 0}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function ContentCard({ title, createdAt, votes,link }) {
  return (
    <Link href={`/question/${link}`} className="block ">
      <div className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition-all hover:bg-[#ecb7327b] duration-500 ease-in-out hover:scale-102">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" /> {votes}
          </span>
        </div>
      </div>
    </Link>
  );
}
