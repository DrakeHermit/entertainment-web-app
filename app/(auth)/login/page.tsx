"use client";

import Link from "next/link";
import { loginAccount } from "@/actions/auth/loginAccount";
import { useActionState, useState } from "react";

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(loginAccount, {
    error: null,
  });
  const [clientError, setClientError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (formData: FormData) => {
    setClientError(null);

    if (!email || !password) {
      setClientError("All fields are required");
      return;
    }

    formAction(formData);
    setEmail("");
    setPassword("");
  };

  const error = clientError || state.error;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-full max-w-[400px] bg-semi-dark-blue rounded-2xl p-8">
      <h1 className="text-[32px] font-light text-white tracking-tight mb-10">
        Sign In
      </h1>
      <form className="flex flex-col gap-6" action={handleSubmit} noValidate>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        {error && <p className="text-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-red hover:bg-white hover:text-background text-white py-4 rounded-md font-light text-[15px] mt-4 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login to your account"}
        </button>
        <p className="text-[15px] text-white font-light text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-red hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};
export default LoginPage;
