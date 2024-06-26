import { Route, Routes, Link, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useFollowUser, useUnfollowUser } from "@/lib/react-query/queries";
import { GridPostList, Loader } from "@/components/shared";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  console.log("user in profile", user)
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const isFollowing = Array.isArray(currentUser.followers) && currentUser.followers.includes(user.id);

  const handleFollow = () => {
    followUserMutation.mutate({ currentUserId: user.id, targetUserId: currentUser.$id });
  };

  const handleUnfollow = () => {
    unfollowUserMutation.mutate({ currentUserId: user.id, targetUserId: currentUser.$id });
  };

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="h-24 w-24 rounded-full object-cover object-top"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={currentUser.followers.length} label="Followers" />
              <StatBlock value={currentUser.following.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {user.id === currentUser.$id ? (
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            ) : (
              isFollowing ? (
                <Button type="button" className="shad-button_primary px-8 cursor-pointer" onClick={handleUnfollow}>
                  Unfollow
                </Button>
              ) : (
                <Button type="button" className="shad-button_primary px-8 cursor-pointer" onClick={handleFollow}>
                  Follow
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}
          >
            <img src={"/assets/icons/posts.svg"} alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"}`}
          >
            <img src={"/assets/icons/like.svg"} alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
    </div>
  );
};

export default Profile;
