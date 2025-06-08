"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import { useParams } from "next/navigation";

import QuestionSection from "@/components/QuestionSection";
import WriteAnswer from "@/components/WriteAnswer";
import ExistingAnswers from "@/components/ExistingAnswers";
import WriteDiscussion from "@/components/WriteDiscussion";
import ExistingDiscussions from "@/components/ExistingDiscussions";
interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  upvotes: number;
  tags: string[];
  createdAt: string;
  views: number;
}

interface Answer {
  id: number;
  content: string;
  author: string;
  authorAvatar: string;
  upvotes: number;
  createdAt: string;
}

interface Discussion {
  id: number;
  content: string;
  author: string;
  authorAvatar: string;
  upvotes: number;
  createdAt: string;
  replies?: Discussion[];
}
const Page = () => {
  const params = useParams();
  const questionId = +params.slug;
  const { user } = useSessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (!user || !questionId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/question/getQuestionById", {
          questionId,
          userId: user.id,
        });
        setData(response.data);
        console.log(response.data);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [questionId, user?.id]);

  // Mock data - in a real app, this would come from an API
  const [question, setQuestion] = useState<Question>({
    id: questionId,
    title: "What are the best practices for React development in 2024?",
    content:
      "I'm looking to improve my React skills and want to know what the current best practices are for building modern React applications. I'm particularly interested in performance optimization, state management, and testing strategies. Any insights from experienced developers would be greatly appreciated!",
    author: "Sarah Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    upvotes: 24,
    tags: ["React", "JavaScript", "Web Development", "Best Practices"],
    createdAt: "2 hours ago",
    views: 1247,
  });

  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: 1,
      content:
        "Here are some key best practices I'd recommend for React development in 2024:\n\n1. **Use Functional Components with Hooks**: Class components are largely deprecated. Embrace hooks like useState, useEffect, useContext, and custom hooks.\n\n2. **TypeScript Integration**: Use TypeScript for better type safety and developer experience. It catches errors early and improves code maintainability.\n\n3. **Performance Optimization**: \n   - Use React.memo() for component memoization\n   - Implement useMemo() and useCallback() judiciously\n   - Code splitting with React.lazy() and Suspense\n\n4. **State Management**: \n   - Use built-in state for local component state\n   - Consider Zustand or Redux Toolkit for global state\n   - React Query/TanStack Query for server state\n\n5. **Testing Strategy**:\n   - Unit tests with Jest and React Testing Library\n   - Integration tests for user workflows\n   - E2E tests with Playwright or Cypress\n\n6. **Modern Patterns**:\n   - Server Components (Next.js 13+)\n   - Concurrent features like Suspense\n   - Error boundaries for graceful error handling",
      author: "Alex Rodriguez",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      upvotes: 18,
      createdAt: "1 hour ago",
    },
    {
      id: 2,
      content:
        "Great question! I'd like to add a few more points to what Alex mentioned:\n\n**Architecture & Organization:**\n- Follow the single responsibility principle\n- Use custom hooks to extract and reuse logic\n- Implement proper folder structure (feature-based or atomic design)\n\n**Development Tools:**\n- ESLint and Prettier for code consistency\n- Husky for git hooks\n- Storybook for component documentation\n\n**Performance Monitoring:**\n- React DevTools Profiler\n- Web Vitals monitoring\n- Bundle analysis tools\n\nThe key is to not over-engineer early but be prepared to scale when needed.",
      author: "Emma Wilson",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      upvotes: 12,
      createdAt: "45 minutes ago",
    },
  ]);

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      content:
        "This is really helpful! I'm curious about the learning curve for TypeScript. How long did it take you to feel comfortable with it?",
      author: "Mike Johnson",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      upvotes: 5,
      createdAt: "30 minutes ago",
      replies: [
        {
          id: 2,
          content:
            "For me, it took about 2-3 weeks of daily practice to feel comfortable. The key is to start with basic types and gradually work your way up to more complex patterns.",
          author: "Alex Rodriguez",
          authorAvatar: "/placeholder.svg?height=32&width=32",
          upvotes: 3,
          createdAt: "25 minutes ago",
        },
      ],
    },
    {
      id: 3,
      content:
        "What about React 18's concurrent features? Are they production-ready now?",
      author: "Lisa Zhang",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      upvotes: 8,
      createdAt: "20 minutes ago",
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");
  const [newDiscussion, setNewDiscussion] = useState("");
  const [questionUpvotes, setQuestionUpvotes] = useState(question.upvotes);

  const handleUpvote = async (
    type: string,
    questionId: number,
    userId: number
  ) => {
    try {
      const response = await axios.post(`/${type}/upvote`, {
        [`${type}Id`]: questionId,
        userId,
      });
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };
  const handleDownvote = async (
    type: string,
    questionId: number,
    userId: number
  ) => {
    try {
      const response = await axios.post(`/${type}/downvote`, {
        [`${type}Id`]: questionId,
        userId,
      });
    } catch (error) {
      console.error("Error downvoting question:", error);
    }
  };
  const handleUpvoteQuestion = () => {
    handleUpvote("question", questionId, user.id);
    setQuestionUpvotes((prev) => prev + 1);
    setData((prev) => ({ ...prev, alreadyUpvoted: true }));
  };

  const handleUpvoteAnswer = (answerId: number) => {
    // handleUpvote("answer", answerId, user.id);
    setData((prev) =>
      prev.answers.map((answer) =>
        answer.id === answerId
          ? { ...answer, alreadyUpvoted: true }
          : answer
      )
    );
  };

  const handleUpvoteDiscussion = (discussionId: number) => {
    // handleUpvote("discussion", discussionId, user.id);
    setData((prev) =>
      prev.discussions.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, alreadyUpvoted: true }
          : discussion
      )
    );
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      const answer: Answer = {
        id: Date.now(),
        content: newAnswer,
        author: "You",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        upvotes: 0,
        createdAt: "Just now",
      };
      setAnswers((prev) => [...prev, answer]);
      setNewAnswer("");
    }
  };

  const handleSubmitDiscussion = () => {
    if (newDiscussion.trim()) {
      const discussion: Discussion = {
        id: Date.now(),
        content: newDiscussion,
        author: "You",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        upvotes: 0,
        createdAt: "Just now",
      };
      setDiscussions((prev) => [...prev, discussion]);
      setNewDiscussion("");
    }
  };

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
            <WriteAnswer questionId={questionId} />

            {/* Existing Answers */}
            <ExistingAnswers questionId={questionId} />
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            {/* Start Discussion */}
            <WriteDiscussion questionId={questionId} />

            {/* Existing Discussions */}
            <ExistingDiscussions questionId={questionId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
