"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "@/libs/axios";
import { useSessionContext } from "@/context/SessionContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const WriteDiscussion = ({ questionId, discussionRefreshTrigger }) => {
  const [newDiscussion, setNewDiscussion] = useState("");
  const { user } = useSessionContext();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmitDiscussion = async () => {
    setSubmitting(true);
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
    setSubmitting(false);
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
                {submitting ? (
                  <Loader2 className="transform text-gray-400 w-4 h-4 animate-spin" />
                ) : (
                  "Post Discussion"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WriteDiscussion;
