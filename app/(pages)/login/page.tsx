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
import { Eye, EyeOff } from "lucide-react";
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="bg-white flex justify-center items-center h-[100vh] w-[100vw] transition-all duration-1000">
        <CircleLoader color="#000000" loading={submitting} size={400} />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-[100dvh] flex flex-col-reverse lg:flex-row text-black bg-[#f5f5f5] justify-center items-center">
      <div className="flex items-center justify-center py-20 rounded-xl px-8 border border-gray-300 bg-white w-[90dvw] md:w-fit">
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
                className="rounded-[3px] placeholder:text-[#817e7e] border-gray-300"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2 relative">
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
                type={showPassword ? "text" : "password"}
                required
                placeholder="**********"
                className="rounded-[3px] border-gray-300"
                {...register("password")}
              />
              <div className="absolute right-4 top-[58%]">
                {showPassword ? (
                  <Eye
                    size={15}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    size={15}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border cursor-pointer border-gray-300 transition-colors rounded-[3px]"
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
          className="-translate-x-3 xl:translate-x-32 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
