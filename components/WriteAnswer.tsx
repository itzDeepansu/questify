"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSessionContext } from "@/context/SessionContext";
import axios from "@/libs/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const WriteAnswer = ({ questionId, answerRefreshTrigger }) => {
  const [newAnswer, setNewAnswer] = useState("");
  const { user } = useSessionContext();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmitAnswer = async () => {
    setSubmitting(true);
    if (newAnswer.trim() === "") return;
    if (!user) return;
    try {
      const response = await axios.post("answer/writeAnswer", {
        questionId,
        userId: user.id,
        body: newAnswer,
      });
      if (response.status === 200) {
        toast.success("Answer submitted successfully!");
        setNewAnswer("");
        answerRefreshTrigger();
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
        <h3 className="font-semibold">Your Answer</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image || "/globe.svg"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Write your answer here... You can use markdown formatting."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewAnswer("")}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
                {submitting ? (
                  <Loader2 className="transform text-gray-400 w-4 h-4 animate-spin" />
                ) : (
                  "Post Answer"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WriteAnswer;
