import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";
// import User from "@/chat/models/user.model";

export async function deleteSession() {
  try {
    const result = await account.deleteSessions();
    return result;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error; // Throw the error to be caught by the caller
  }
}

// ============================== FOLLOW / UNFOLLOW USER
export async function followUser(currentUserId: string, targetUserId: string) {
  try {
    // Выполняем запросы параллельно
    const [currentUser, targetUser] = await Promise.all([
      getUserById(currentUserId),
      getUserById(targetUserId)
    ]);

    if (!currentUser || !targetUser) {
      throw new Error(`One of the users not found`);
    }

    // Обновляем подписки и подписчиков
    const updatedFollowing = Array.isArray(currentUser.following) ? [...currentUser.following, targetUserId] : [targetUserId];
    const updatedFollowers = Array.isArray(targetUser.followers) ? [...targetUser.followers, currentUserId] : [currentUserId];

    await Promise.all([
      updateUser({
        userId: currentUser.$id, following: updatedFollowing,
        username: currentUser.name,
        bio: currentUser.bio,
        imageId: currentUser.imageId,
        imageUrl: currentUser.imageUrl,
        file: currentUser.file
      }),
      updateUser({
        userId: targetUser.$id, followers: updatedFollowers,
        username: targetUser.name,
        bio: targetUser.bio,
        imageId: targetUser.imageId,
        imageUrl: targetUser.imageUrl,
        file: targetUser.file
      })
    ]);

    return { status: "Ok" };
  } catch (error) {
    console.error('Error in followUser:', error);
    return { status: "Error", message: error};
  }
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  try {
    // Выполняем запросы параллельно
    const [currentUser, targetUser] = await Promise.all([
      getUserById(currentUserId),
      getUserById(targetUserId)
    ]);

    if (!currentUser || !targetUser) {
      throw new Error(`One of the users not found`);
    }

    // Обновляем подписки и подписчиков
    const updatedFollowing = currentUser.following.filter((id: string) => id !== targetUserId);
    const updatedFollowers = targetUser.followers.filter((id: string) => id !== currentUserId);

    await Promise.all([
      updateUser({
        userId: currentUser.$id, following: updatedFollowing,
        username: currentUser.name,
        bio: currentUser.bio,
        imageId: currentUser.imageId,
        imageUrl: currentUser.imageUrl,
        file: currentUser.file
      }),
      updateUser({
        userId: targetUser.$id, followers: updatedFollowers,
        username: targetUser.name,
        bio: targetUser.bio,
        imageId: targetUser.imageId,
        imageUrl: targetUser.imageUrl,
        file: targetUser.file
      })
    ]);

    return { status: "Ok" };
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    return { status: "Error", message: error};
  }
}

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    debugger;
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );
    console.log(newAccount, "newAccount")
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.username);
  
    debugger;
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      username: newAccount.name, //name==username
      email: newAccount.email,
      imageUrl: avatarUrl,
      language: user.language,
      accountType: user.accountType,
      followers: [],
      following: []
    });
    console.log(newUser,"newUser")
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  username: string;
  language:string,
  accountType:string,
  // rated:number,
  imageUrl: URL;
  followers?: string[];
  following?:string[]
}) {
  
  try {
    debugger;
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    console.log(newUser, "createdDoc into db!")
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}
// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    debugger;
    const currentAccount = await account.get();
    
    console.log(currentAccount, "currentAccount")
    return currentAccount; 
    
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    debugger;
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    console.log(currentUser, "currentUser")

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    console.log(post.file[0],"Goes into uploadFile")
    debugger;
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const filetype = post.file[0].type
    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        type:filetype, 
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    debugger;
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
   
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    debugger;
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
      // 2000,
      // 2000,
      // "top",
      // 100
    );
    console.log(fileUrl)
    if (!fileUrl) throw Error;
    debugger;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const [postsByTags, postsByCaption] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("tags", searchTerm)]
      ),
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
      )
    ]);

    // Объединение результатов и удаление дубликатов
    const allPosts = [...postsByTags.documents, ...postsByCaption.documents];
    const uniquePosts = allPosts.filter((post, index, self) =>
      index === self.findIndex((p) => p.$id === post.$id)
    );

    return { documents: uniquePosts };
  } catch (error) {
    console.log(error);
    return { documents: [] }; // возвращаем пустой массив документов при ошибке
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    debugger;
    console.log(userId)
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        users: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    debugger;
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    console.log(posts, "getRecentPosts")
    debugger;
    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];
  if (limit) {
    queries.push(Query.limit(limit));
  }
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  console.log("updateUser in api.ts, user", user.userId)
  const hasFileToUpdate = user.file
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      console.log("image", image)
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        username: user.username,
        bio: user.bio,
        imageUrl: image.imageUrl,
        followers:user.followers,
        following:user.following
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}