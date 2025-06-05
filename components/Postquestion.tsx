import React,{ useState} from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Postquestion = () => {
  const { data: session, status } = useSession();
    const [newQuestion, setNewQuestion] = useState({ title: "", content: "", tags: "" })
    const handleSubmitQuestion = () => {
    if (newQuestion.title && newQuestion.content) {
      // Handle the question submission here
      console.log("Question submitted:", newQuestion);
    }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session?.user?.image} />
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
            <Button onClick={handleSubmitQuestion}>Post Question</Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Postquestion;
