"use client";

import Link from "next/link";
import { registerAccount } from "@/actions/auth/registerAccount";
import { useActionState, useState } from "react";

const RegisterPage = () => {
  const [state, formAction, isPending] = useActionState(registerAccount, {
    error: null,
  });
  const [clientError, setClientError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (formData: FormData) => {
    setClientError(null);

    if (!email || !password || !confirmPassword) {
      setClientError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setClientError("Passwords don't match");
      return;
    }

    formAction(formData);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    console.log("Account logged in successfully");
  };

  const error = clientError || state.error;

  return (
    <div className="w-full max-w-[400px] bg-semi-dark-blue rounded-2xl p-8">
      <h1 className="text-[32px] font-light text-white tracking-tight mb-10">
        Sign Up
      </h1>
      <form className="flex flex-col gap-6" action={handleSubmit} noValidate>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors focus:ring-0"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        {error && <p className="text-red text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-red hover:bg-white hover:text-background text-white py-4 rounded-md font-light text-[15px] mt-4 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Create an account"}
        </button>
        <p className="text-[15px] text-white font-light text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-red hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default RegisterPage;
