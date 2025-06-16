"use client";

import { useState } from "react";
import {
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

import QuestionSection from "@/components/QuestionSection";
import WriteAnswer from "@/components/WriteAnswer";
import ExistingAnswers from "@/components/ExistingAnswers";
import WriteDiscussion from "@/components/WriteDiscussion";
import ExistingDiscussions from "@/components/ExistingDiscussions";
const Page = () => {
  const params = useParams();
  const questionId = +params.slug;
  const [discussionRefreshFlag, setDiscussionRefreshFlag] = useState(false);
  const [answerRefreshFlag, setAnswerRefreshFlag] = useState(false);
  const triggerDiscussionRefresh = () => setDiscussionRefreshFlag(prev=>!prev);
  const triggerAnswerRefresh = () => setAnswerRefreshFlag(prev=>!prev);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Section */}
        <QuestionSection questionId={questionId} />

        {/* Answers and Discussions Tabs */}
        <Tabs defaultValue="answers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="answers"
              className="flex items-center space-x-2"
            >
              <span>Answers</span>
            </TabsTrigger>
            <TabsTrigger
              value="discussions"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discussions</span>
            </TabsTrigger>
          </TabsList>

          {/* Answers Tab */}
          <TabsContent value="answers" className="space-y-6">
            {/* Write Answer */}
            <WriteAnswer questionId={questionId} answerRefreshTrigger={triggerAnswerRefresh}/>

            {/* Existing Answers */}
            <ExistingAnswers questionId={questionId} refreshFlag={answerRefreshFlag}/>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            {/* Start Discussion */}
            <WriteDiscussion questionId={questionId} discussionRefreshTrigger={triggerDiscussionRefresh}/>

            {/* Existing Discussions */}
            <ExistingDiscussions questionId={questionId} refreshFlag={discussionRefreshFlag}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
