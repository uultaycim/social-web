import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  console.log(post.imageUrl, "post url");

  // Ensure video doesn't overflow the postcard
  const MAX_POSTCARD_HEIGHT = window.innerHeight; // Get device screen height
  const videoAspectRatio = 16 / 9; // Common video aspect ratio (adjust if needed)

  const calculateVideoHeight = (postcardWidth: number) => {
    return Math.min(MAX_POSTCARD_HEIGHT, postcardWidth / videoAspectRatio);
  };

  return (
    <div className="post-card">
      <div className="flex-between">
        {/* User info section */}
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${post.creator.$id}`}>
              <p className="base-medium lg:body-bold text-light-1">
                {post.creator.username}
              </p>
            </Link>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
            </div>
          </div>
        </div>

        {/* Edit button (hidden if not current user's post) */}
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        {/* Post caption and tags */}
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: any) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Responsive video or image */}
        {post.type.startsWith("image") ? (
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img"
          />
        ) : (
          <video
            src={post.imageUrl}
            className="post-card_video py-4"
            controls
            style={{ maxHeight: calculateVideoHeight(document.body.clientWidth)-250}} // Set dynamic max-height
          />
        )}
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;

