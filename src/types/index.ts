export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  type:string;
  tags?: string;
};

export type IUser = {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  followers?:number;
  following?:number;
};

export type INewUser = {
  username: string;
  email: string;
  password:string,
  language: string;
  accountType: string;
};
export type IMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
};

export type IConversation = {
  id:string;
  participants: string[];
  timestamp: string;
  messages: IMessage[];
};