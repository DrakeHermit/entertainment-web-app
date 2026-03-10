import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/lib/types/types";
import { updateAccountDetails } from "@/actions/profile/updateProfile";
import { updatePassword as updatePasswordAction } from "@/actions/profile/updatePassword";
import { updateAvatar } from "@/actions/profile/updateAvatar";

export function useProfile(user: User) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar_url
  );
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousPreview = avatarPreview;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        setAvatarPreview(previousPreview);
        toast.error(data.error || "Failed to upload image");
        return;
      }

      const result = await updateAvatar(data.url);

      if (result.error) {
        setAvatarPreview(previousPreview);
        toast.error(result.error);
        return;
      }

      toast.success("Profile picture updated");
      router.refresh();
    } catch {
      setAvatarPreview(previousPreview);
      toast.error("Something went wrong");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    const previousPreview = avatarPreview;
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const result = await updateAvatar(null);

      if (result.error) {
        setAvatarPreview(previousPreview);
        toast.error(result.error);
        return;
      }

      toast.success("Profile picture removed");
      router.refresh();
    } catch {
      setAvatarPreview(previousPreview);
      toast.error("Something went wrong");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

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

      const result = await updatePasswordAction(formData);

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

  return {
    fileInputRef,

    email,
    setEmail,
    username,
    setUsername,
    avatarPreview,
    isUploadingAvatar,
    accountErrors,
    isSavingAccount,

    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordErrors,
    isSavingPassword,

    handleFileChange,
    handleRemoveAvatar,
    triggerFileInput,
    handleSaveAccount,
    handleUpdatePassword,
  };
}
