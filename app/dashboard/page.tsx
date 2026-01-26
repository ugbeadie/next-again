"use client";

import { useEffect, useState } from "react";
import { Post } from "../../types/post";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const triggerRefresh = async () => {
    await fetch("/api/revalidate", { method: "POST" });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    await triggerRefresh();
    fetchPosts();
  };

  const updatePost = async (id: string) => {
    const newTitle = prompt("New title?");
    const newContent = prompt("New content?");

    if (!newTitle || !newContent) return;

    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: newTitle, content: newContent }),
    });

    await triggerRefresh();
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    await triggerRefresh();
    fetchPosts();
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={createPost}>Create Post</button>

      <hr />

      {posts.map((post) => (
        <div
          key={post._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => updatePost(post._id)}>Edit</button>
          <button onClick={() => deletePost(post._id)}>Delete</button>
        </div>
      ))}
    </main>
  );
}
