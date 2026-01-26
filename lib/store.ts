import { Post } from "../types/post";

let posts: Post[] = [
  { id: "1", title: "Hello World", content: "My first post" },
];

export const getPosts = () => posts;

export const addPost = (post: Post) => {
  posts.push(post);
};

export const updatePost = (id: string, data: Partial<Post>) => {
  posts = posts.map((p) => (p.id === id ? { ...p, ...data } : p));
};

export const deletePost = (id: string) => {
  posts = posts.filter((p) => p.id !== id);
};
