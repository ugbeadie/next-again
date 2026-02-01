"use client";

import { useEffect, useState } from "react";
import { Post } from "../../types/post";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    setSaving(false);
    fetchPosts();
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

    setSaving(true);

    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingPost._id,
        title: editTitle,
        content: editContent,
      }),
    });

    setSaving(false);
    cancelEdit();
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchPosts();
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard(Admin Only)</h1>

      {/* Create post */}
      <div className="rounded-lg border bg-white p-4 mb-8 space-y-3">
        <h2 className="font-medium">Create post</h2>

        <input
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createPost}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm disabled:opacity-50 cursor-pointer"
        >
          {saving && (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          )}
          Create post
        </button>
      </div>

      {/* Edit panel */}
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

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border p-4 space-y-3"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
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
                    className="text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="text-sm text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
