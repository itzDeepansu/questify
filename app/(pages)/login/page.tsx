"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginFormInputs) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (res?.error) {
        console.error(res.error);
        setError("Invalid email or password.");
        setSubmitting(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
      setSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await handleLogin(data);
  };

  if (submitting) {
    return (
      <div className="bg-black flex justify-center items-center h-[100vh] w-[100vw] transition-all duration-1000">
        <CircleLoader color="#ffffff" loading={submitting} size={400} />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-[100dvh] flex flex-col-reverse lg:flex-row bg-[#171717] text-white justify-center items-center">
      <div className="flex items-center justify-center py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-[#817e7e]">
              Enter your credentials below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="alice@example.com"
                required
                className="rounded-[3px] placeholder:text-[#817e7e]"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forget-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="rounded-[3px]"
                {...register("password")}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-white text-black hover:text-white rounded-[3px]"
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
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

export default Login;
