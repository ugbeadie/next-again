// // app/page.tsx
// "use client";

// import { useEffect, useState } from "react";

// export type Item = {
//   id: number;
//   title: string;
//   description: string;
// };

// async function fetchItems(): Promise<Item[]> {
//   // This would be replaced by real API call in production
//   return [
//     { id: 1, title: "Item One", description: "Details of Item One" },
//     { id: 2, title: "Item Two", description: "Details of Item Two" },
//     { id: 3, title: "Item Three", description: "Details of Item Three" },
//   ];
// }

// export default function HomePage() {
//   const [items, setItems] = useState<Item[]>([]);
//   const [selectedId, setSelectedId] = useState<number | null>(null);

//   useEffect(() => {
//     fetchItems().then(setItems);
//   }, []);

//   const selectedItem = items.find((item) => item.id === selectedId) || null;

//   return (
//     <main className="flex h-screen font-sans">
//       <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Items</h2>
//         <ul className="space-y-2">
//           {items.map((item) => (
//             <li
//               key={item.id}
//               onClick={() => setSelectedId(item.id)}
//               className={`cursor-pointer p-2 rounded ${
//                 item.id === selectedId ? "bg-blue-100" : "hover:bg-gray-100"
//               }`}
//             >
//               {item.title}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="flex-1 p-6 overflow-y-auto">
//         {selectedItem ? (
//           <>
//             <h1 className="text-2xl font-bold mb-2">{selectedItem.title}</h1>
//             <p className="text-gray-700">{selectedItem.description}</p>
//           </>
//         ) : (
//           <p className="text-gray-500">Select an item to view its details.</p>
//         )}
//       </div>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Post } from "../types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      setPosts(data);
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

      {loading && (
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
      )}

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
