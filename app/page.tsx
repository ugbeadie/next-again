"use client";

import { useEffect, useState } from "react";
import { Post } from "../types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/public-posts", { cache: "no-store" });

      if (!res.ok) {
        setPosts([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Website(User Only)</h1>

      {!loading && posts.length === 0 && (
        <p className="text-sm text-gray-500">No posts yet.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-gray-700 mt-1">{post.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
