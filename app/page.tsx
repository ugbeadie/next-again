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

  const fetchPosts = async () => {
    const res = await fetch("/api/posts", {
      cache: "no-store",
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Public Site</h1>

      {posts.map((post) => (
        <div
          key={post._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </main>
  );
}
