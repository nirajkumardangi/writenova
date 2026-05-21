import { useEffect, useState } from "react";
import { fetchPosts } from "./api";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((res) => setPosts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
