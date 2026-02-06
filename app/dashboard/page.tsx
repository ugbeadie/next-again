"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/post";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [email, setEmail] = useState<string | null>(null);

  const fetchMe = async () => {
    const res = await fetch("/api/me");
    if (res.ok) {
      const data = await res.json();
      setEmail(data.email);
    }
  };

  const fetchPosts = async () => {
    const res = await fetch("/api/posts", { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to fetch posts");
      return;
    }

    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMe();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        alert("Failed to create post");
        return;
      }

      const newPost: Post = await res.json();

      // update UI immediately
      setPosts((prev) => [newPost, ...prev]);

      setTitle("");
      setContent("");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingPost) return;

    try {
      setSaving(true);

      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPost._id,
          title: editTitle,
          content: editContent,
        }),
      });

      if (!res.ok) {
        alert("Failed to update post");
        return;
      }

      const updated: Post = await res.json();

      // update local list
      setPosts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p)),
      );

      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      alert("Failed to delete post");
      return;
    }

    // update local list
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {email && (
            <p className="text-sm text-gray-500">Logged in as {email}</p>
          )}
        </div>

        <button onClick={logout} className="text-sm border px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <div className="rounded-lg border bg-white p-4 mb-8 space-y-3">
        <h2 className="font-medium">Create post</h2>

        <input
          className="w-full border rounded-md px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px]"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createPost}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create post"}
        </button>
      </div>

      {editingPost && (
        <div className="rounded-lg border bg-blue-50 p-4 mb-8 space-y-3">
          <h2 className="font-medium">Edit post</h2>

          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px]"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              disabled={saving}
              className="rounded-md bg-green-600 px-4 py-2 text-white text-sm disabled:opacity-50"
            >
              Save changes
            </button>

            <button
              onClick={cancelEdit}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-sm text-gray-500">No posts yet.</p>
      )}

      <div className="space-y-4">
        {posts
          .filter((post) => post._id !== editingPost?._id)
          .map((post) => (
            <div
              key={post._id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-gray-700 mt-1">{post.content}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => startEdit(post)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePost(post._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
