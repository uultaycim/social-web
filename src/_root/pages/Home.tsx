import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const Home = () => {
  const { user } = useUserContext();
  console.log(user.imageUrl, "user imageurl")
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  // Фильтруем посты, чтобы отображать только те, на создателей которых подписан пользователь
  const filteredPosts = posts?.documents.filter(post => 
    post.creator && Array.isArray(post.creator.followers) && post.creator.followers.includes(user.id)
);


  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {filteredPosts.length === 0 ? (
                <p className="body-medium text-light-1">No posts to show</p>
              ) : (
                filteredPosts.map((post: Models.Document) => (
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              creator?.$id !== user.id && (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
