import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";

import { Button } from "../ui/button";
import { useGetUserById } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user:TheUser }: UserCardProps) => {
  const { user } = useUserContext();
  const isFollowing = Array.isArray(TheUser?.followers) && TheUser.followers.includes(user.id);
  console.log(TheUser, isFollowing)
  return (
    <Link to={`/profile/${TheUser.$id}`} className="user-card">
      <img
        src={TheUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {TheUser.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{TheUser.username}
        </p>
      </div>
      {(
         isFollowing ? (
          <Button type="button" className="shad-button_primary px-8 cursor-pointer">
            Unfollow
          </Button>
        ) : (
          <Button type="button" className="shad-button_primary px-8 cursor-pointer" >
            Follow
          </Button>
        )
      )}
    </Link>
  );
};

export default UserCard;
