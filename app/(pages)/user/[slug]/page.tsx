"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Lock, Camera } from "lucide-react";

import { useForm, SubmitHandler, set } from "react-hook-form";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import type { RcFile, UploadRequestOption } from "rc-upload/lib/interface";
import axios from "@/libs/axios";
import type { UploadFile } from "antd/es/upload/interface";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
interface FormValues {
  username: string;
  email: string;
  password: string;
  image: string;
}

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
const page = () => {
  const params = useParams();
  const userId = +params.slug;
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [finalImgUrl, setFinalImgUrl] = useState<string>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "John Doe",
      email: "john.doe@example.com",
      password: "",
      image: "/placeholder.svg?height=120&width=120",
    },
  });
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.post("user/findUserDetailsById", {
          userId,
        });
        const user = res.data;
        setImageUrl(user.image);
        setUserData(user);
        reset({
          username: user.username,
          email: user.email,
          password: "",
          image: user.image || "/placeholder.svg?height=120&width=120",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [reset, userId]);
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSubmitting(true);
    setFormError(null);
    if (
      data.username == userData.username &&
      data.email == userData.email &&
      (finalImgUrl == userData.image || !finalImgUrl) &&
      !data.password
    ) {
      toast.error("No changes made.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await axios.post("user/updateDetails", {
        ...data,
        image: finalImgUrl || "",
        userId,
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully.");
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (err) {
      if (err.status === 409) {
        toast.error("User already exists. Please login.");
      } else {
        console.error(err.status);
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const callreset = () => {
    reset();
    setImageUrl(userData.image);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eab530] to-[#d4465b] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-2xl bg-black/20 rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-white/80">Manage your account details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image - Read Only */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="flex justify-center items-center invert">
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
                        className="invert rounded-full object-fill"
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
              <p className="text-white/60 text-sm">Profile image</p>
            </div>

            {/* Name Field - Editable */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-white font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  {...register("username", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/50 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.username && (
                <p className="text-red-300 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field - Read Only */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white font-medium flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  {...register("email")}
                  readOnly
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="bg-white/20 rounded-full px-2 py-1">
                    <span className="text-xs text-white/60">Read-only</span>
                  </div>
                </div>
              </div>
              <p className="text-white/50 text-xs">Email cannot be changed</p>
            </div>

            {/* Password Field - Editable */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/50 transition-all duration-200"
                  placeholder="Enter new password (optional)"
                />
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm">
                  {errors.password.message}
                </p>
              )}
              <p className="text-white/50 text-xs">
                Leave blank to keep current password
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-white/20 hover:bg-white/30  text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                {submitting ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => callreset()}
                className="bg-transparent hover:bg-white/10 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-white/60 text-sm">
                {userData?.createdAt && (
                  <div>
                    Created On : {" "}
                    {new Date(userData.createdAt).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
