"use client";

import Link from "next/link";
import { registerAccount } from "@/actions/auth/registerAccount";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { registerSchema, flattenFieldErrors } from "@/lib/validations/auth";

const RegisterPage = () => {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setGeneralError(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setGeneralError("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const result = registerSchema.safeParse({
      email,
      username,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setFieldErrors(flattenFieldErrors(result.error));
      setIsSubmitting(false);
      return;
    }

    try {
      let avatarUrl = null;

      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", avatarFile);

        const response = await fetch("/api/upload-avatar", {
          method: "POST",
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          setGeneralError(data.error || "Failed to upload avatar");
          setIsSubmitting(false);
          return;
        }

        avatarUrl = data.url;
      }

      const formData = new FormData();
      formData.append("email", result.data.email);
      formData.append("username", result.data.username ?? "");
      formData.append("password", result.data.password);
      formData.append("confirmPassword", result.data.confirmPassword);
      if (avatarUrl) {
        formData.append("avatarUrl", avatarUrl);
      }

      const serverResult = await registerAccount({ error: null }, formData);

      if (serverResult.fieldErrors) {
        setFieldErrors(serverResult.fieldErrors);
        setIsSubmitting(false);
        return;
      }

      if (serverResult.error) {
        setGeneralError(serverResult.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Account created successfully");
      router.push("/");
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-semi-dark-blue rounded-2xl p-8">
      <h1 className="text-[32px] font-light text-white tracking-tight mb-10">
        Sign Up
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors focus:ring-0"
          />
          {fieldErrors.email && (
            <p className="text-red text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
          {fieldErrors.username && (
            <p className="text-red text-xs mt-1">{fieldErrors.username}</p>
          )}
        </div>
        <div className="relative">
          <label className="block text-white/70 text-sm mb-2">
            Profile Picture (optional)
          </label>
          <div className="flex items-center gap-4">
            {avatarPreview && (
              <Image
                width={80}
                height={80}
                src={avatarPreview}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
              />
            )}
            <label className="flex-1 cursor-pointer">
              <div className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 hover:border-white transition-colors">
                <span className="text-white/50">
                  {avatarFile ? avatarFile.name : "Choose an image..."}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
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
          {fieldErrors.password && (
            <p className="text-red text-xs mt-1">{fieldErrors.password}</p>
          )}
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
          {fieldErrors.confirmPassword && (
            <p className="text-red text-xs mt-1">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
        {generalError && <p className="text-red text-sm">{generalError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red hover:bg-white hover:text-background text-white py-4 rounded-md font-light text-[15px] mt-4 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create an account"}
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
