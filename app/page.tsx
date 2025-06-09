"use client";
import {useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Postquestion from "@/components/Postquestion";
import Questionsfeed from "@/components/Questionsfeed";
import Topicsbar from "@/components/Topicsbar";
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [answerRefreshFlag, setAnswerRefreshFlag] = useState(false);
  const answerRefreshTrigger = () => {
    setAnswerRefreshFlag((prev) => !prev);
  }
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  return (
    <div className="max-w-100dvw max-h-100dvh">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Postquestion answerRefreshTrigger={answerRefreshTrigger}/>
            <Questionsfeed refreshFlag={answerRefreshFlag}/>
          </div>
          <Topicsbar />
        </div>
      </div>
      <Button
        className="border-[#5d5d64] border h-8 ml-auto rounded-[3px] hover:bg-white hover:text-black"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </Button>
    </div>
  );
}
