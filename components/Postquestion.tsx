import React, { use, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionContext } from "@/context/SessionContext";
import toast from "react-hot-toast";
import axios from "@/libs/axios";
import { Loader2 } from "lucide-react";
const Postquestion = ({ answerRefreshTrigger }) => {
  const user = useSessionContext();
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmitQuestion = async () => {
    if (newQuestion.title && newQuestion.content) {
      setSubmitting(true);
      const tagsArray = newQuestion.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      const response = await axios.post("/question/postQuestion", {
        userId: user.user.id,
        title: newQuestion.title,
        body: newQuestion.content,
        topicNames: tagsArray,
      });
      if (response.status === 200) {
        setNewQuestion({ title: "", content: "", tags: "" });
        toast.success("Question submitted successfully!");
        answerRefreshTrigger();
      } else {
        toast.error("Error submitting question. Please try again.");
      }
    } else {
      toast.error("Title and content are required.");
    }
    setSubmitting(false);
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.user?.image} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="What do you want to ask or share?"
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border-none bg-gray-50 text-lg"
            />
          </div>
        </div>
      </CardHeader>
      {newQuestion.title && (
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Provide more details about your question..."
            value={newQuestion.content}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, content: e.target.value }))
            }
            className="min-h-[100px]"
          />
          <Input
            placeholder="Add tags (comma separated)"
            value={newQuestion.tags}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, tags: e.target.value }))
            }
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setNewQuestion({ title: "", content: "", tags: "" })
              }
            >
              Cancel
            </Button>
            <Button disabled={!user.user?.id || submitting} onClick={handleSubmitQuestion}>
              {submitting ? (
                <Loader2 className="transform text-gray-400 w-4 h-4 animate-spin" />
              ) : (
                "Post Question"
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Postquestion;
