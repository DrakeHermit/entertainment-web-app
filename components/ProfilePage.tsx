"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/types/types";
import DetailsBackButton from "./DetailsBackButton";
import { updateAccountDetails } from "@/actions/profile/updateProfile";
import { updatePassword } from "@/actions/profile/updatePassword";

type ProfilePageProps = {
  user: User;
};

const getInitials = (user: User): string => {
  if (user.username) {
    return user.username
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return user.email[0].toUpperCase();
};

const ProfilePage = ({ user }: ProfilePageProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar_url,
  );
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>(
    {},
  );
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAccount = async () => {
    setAccountErrors({});
    setIsSavingAccount(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);

      const result = await updateAccountDetails(formData);

      if (result.fieldErrors) {
        setAccountErrors(result.fieldErrors);
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account details updated");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordErrors({});
    setIsSavingPassword(true);

    try {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const result = await updatePassword(formData);

      if (result.fieldErrors) {
        setPasswordErrors(result.fieldErrors);
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl py-8 md:py-12">
      <DetailsBackButton />

      <h1 className="text-3xl font-light tracking-tight mb-10">Profile</h1>

      <section className="bg-semi-dark-blue rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center bg-background">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile picture"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-red">
                  {getInitials(user)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col items-center sm:items-start gap-2">
            <h2 className="text-xl font-medium">
              {user.username || "No username set"}
            </h2>
            <p className="text-white/60 text-sm">{user.email}</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-red hover:text-white transition-colors cursor-pointer"
              >
                Upload new photo
              </button>
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-sm text-white/40 hover:text-red transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-semi-dark-blue rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-red" />
          Account Details
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-white/50 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-background text-white pl-11 pr-4 py-3.5 rounded-lg border border-white/10 focus:border-red focus:outline-none caret-red transition-colors placeholder-white/30"
              />
            </div>
            {accountErrors.email && (
              <p className="text-red text-xs mt-1">{accountErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-2">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (optional)"
                className="w-full bg-background text-white pl-11 pr-4 py-3.5 rounded-lg border border-white/10 focus:border-red focus:outline-none caret-red transition-colors placeholder-white/30"
              />
            </div>
            {accountErrors.username && (
              <p className="text-red text-xs mt-1">{accountErrors.username}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveAccount}
            disabled={isSavingAccount}
            className="w-full sm:w-auto bg-red hover:bg-white hover:text-background text-white py-3 px-8 rounded-lg font-light text-[15px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSavingAccount ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      <section className="bg-semi-dark-blue rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red" />
          Change Password
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-white/50 text-sm mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-background text-white pl-11 pr-12 py-3.5 rounded-lg border border-white/10 focus:border-red focus:outline-none caret-red transition-colors placeholder-white/30"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-red text-xs mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-background text-white pl-11 pr-12 py-3.5 rounded-lg border border-white/10 focus:border-red focus:outline-none caret-red transition-colors placeholder-white/30"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-red text-xs mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-background text-white pl-11 pr-12 py-3.5 rounded-lg border border-white/10 focus:border-red focus:outline-none caret-red transition-colors placeholder-white/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-red text-xs mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={isSavingPassword}
            className="w-full sm:w-auto bg-red hover:bg-white hover:text-background text-white py-3 px-8 rounded-lg font-light text-[15px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSavingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
