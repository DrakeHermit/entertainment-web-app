import { CommentData } from "@/lib/types/types";
import UserAvatar from "./UserAvatar";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

const Comment = ({ comment }: { comment: CommentData }) => {
  const displayName = comment.user.username || comment.user.email;

  return (
    <div className="flex gap-3 bg-semi-dark-blue p-4 rounded-lg">
      <div className="shrink-0 pt-0.5">
        <UserAvatar user={comment.user} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-semibold truncate">
            {displayName}
          </span>
          <span className="text-white/50 text-xs shrink-0">
            {getRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default Comment;
