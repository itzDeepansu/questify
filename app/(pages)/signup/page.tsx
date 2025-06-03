"use client";

import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import type { RcFile, UploadRequestOption } from "rc-upload/lib/interface";
import axios from "@/libs/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { CircleLoader } from "react-spinners";
import type { UploadFile } from "antd/es/upload/interface";
import toast from "react-hot-toast";

interface FormValues {
  username: string;
  email: string;
  password: string;
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

const Signup = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [finalImgUrl, setFinalImgUrl] = useState<string>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();

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
    try {
      const res = await axios.post("register/user", {
        ...data,
        image: finalImgUrl,
      });
      if (res.status === 200) {
        router.push("/");
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (err) {
        if(err.status === 409){
            toast.error("User already exists. Please login.");
        }else{
            console.error(err.status);
            setFormError("An unexpected error occurred. Please try again.");
        }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="bg-black flex justify-center items-center h-[100vh] w-[100vw]">
        <CircleLoader color="#ffffff" loading={submitting} size={400} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] flex flex-col-reverse lg:flex-row bg-[#171717] text-white justify-center items-center">
      <div className="flex items-center justify-center py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">SignUp</h1>
            <p className="text-balance text-[#817e7e]">
              Enter the details below to create an Account
            </p>
          </div>
          <div className="grid gap-4">
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
              <p className="text-red-500 text-sm text-center">{uploadError}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                placeholder="Deepansu"
                required
                className="rounded-[3px] placeholder:text-[#817e7e]"
                {...register("username")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                required
                placeholder="alice@gmail.com"
                className="rounded-[3px] placeholder:text-[#817e7e]"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="rounded-[3px]"
                {...register("password")}
              />
            </div>
            {formError && (
              <p className="text-red-500 text-sm text-center">{formError}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-white text-black hover:text-white rounded-[3px]"
            >
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log In
            </Link>
          </div>
        </form>
      </div>
      <div className="w-1/2 h-[12vh] lg:h-[100dvh]">
        <img
          src="/questify_logo.png"
          alt="logo"
          className="-translate-x-3 xl:translate-x-44 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
