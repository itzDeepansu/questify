import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionContext } from "@/context/SessionContext";
import toast from "react-hot-toast";
import axios from "@/libs/axios";
import { Loader2 } from "lucide-react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import type { RcFile, UploadRequestOption } from "rc-upload/lib/interface";
import type { UploadFile } from "antd/es/upload/interface";
interface UploadChangeParam<T = UploadFile<any>> {
  file: T;
  fileList: T[];
  event?: { percent: number };
}

const getBase64 = (
  img: RcFile,
  callback: (url: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
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
        image:finalImgUrl,
      });
      if (response.status === 200) {
        setNewQuestion({ title: "", content: "", tags: "" });
        toast.success("Question submitted successfully!");
        answerRefreshTrigger();
        setFinalImgUrl("");
      } else {
        toast.error("Error submitting question. Please try again.");
      }
    } else {
      toast.error("Title and content are required.");
    }
    setSubmitting(false);
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [finalImgUrl, setFinalImgUrl] = useState<string>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        if (typeof url === "string") {
          setImageUrl(url);
        }
      });
    }
  };

  const handleUpload = async (options: UploadRequestOption) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file as RcFile);
    formData.append("upload_preset", "non_secure_images_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqjqvajd/image/upload",
        formData
      );
      const { secure_url } = res.data;
      setFinalImgUrl(secure_url);
      setUploadError(null);
      onSuccess?.(secure_url);
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload image. Please try again.");
      onError?.(err as Error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
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
          <div className="flex gap-6">
            
            <div className="relative mr-auto overflow-hidden">
              <div className="flex justify-center items-center">
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={handleUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      className="rounded-full object-fill"
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
              {uploadError && (
                <p className="text-red-500 text-sm text-center">
                  {uploadError}
                </p>
              )}
            </div>
            <Input
              placeholder="Add tags (comma separated)"
              value={newQuestion.tags}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, tags: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setNewQuestion({ title: "", content: "", tags: "" })
              }
            >
              Cancel
            </Button>
            <Button
              disabled={!user.user?.id || submitting}
              onClick={handleSubmitQuestion}
            >
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
