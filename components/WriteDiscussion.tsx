"use client";

import { useState, useEffect, use } from "react";
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
import toast  from "react-hot-toast";
const WriteDiscussion = ({ questionId ,discussionRefreshTrigger }) => {
  const [newDiscussion, setNewDiscussion] = useState("");
  const { user } = useSessionContext();
  const handleSubmitDiscussion = async () => {
    if (newDiscussion.trim() === "") return;
    if (!user) return;
    try {
      const response = await axios.post("discussion/writeDiscussion", {
        questionId,
        userId: user.id,
        content: newDiscussion,
      });
      if (response.status === 200) {
        toast.success("Answer submitted successfully!");
        setNewDiscussion("");
        discussionRefreshTrigger();
      }
    } catch (err) {
      toast.error("Error submitting answer. Please try again.");
      console.error(err);
    }
  };
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Start a Discussion</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image || "/globe.svg"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your thoughts, ask follow-up questions, or start a discussion..."
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewDiscussion("")}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitDiscussion}
                disabled={!newDiscussion.trim()}
              >
                Post Discussion
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WriteDiscussion;
