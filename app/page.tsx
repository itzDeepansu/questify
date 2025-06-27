"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Postquestion from "@/components/Postquestion";
import Questionsfeed from "@/components/Questionsfeed";
import Topicsbar from "@/components/Topicsbar";
import { CircleLoader } from "react-spinners";
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [answerRefreshFlag, setAnswerRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const answerRefreshTrigger = () => {
    setAnswerRefreshFlag((prev) => !prev);
  };
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh] w-[100vw]">
        <CircleLoader color="#000000" loading={loading} size={400} />
      </div>
    );
  }
  return (
    <div className="max-w-100dvw max-h-100dvh">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Postquestion answerRefreshTrigger={answerRefreshTrigger} />
            <Questionsfeed refreshFlag={answerRefreshFlag} />
          </div>
          <Topicsbar />
        </div>
      </div>
    </div>
  );
}
