import { useState, useEffect, ReactNode } from "react";

import BlogPosts, { type BlogPost } from "./components/BlogPosts";
import { get } from "./utils/http";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawBlogPost[];

        const blogPosts: BlogPost[] = data.map((post) => ({
          id: post.id,
          title: post.title,
          text: post.body,
        }));

        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (isFetching) {
    content = <p id='loading-fallback'>Fetching posts...</p>;
  }

  if (fetchedPosts.length > 0) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  return (
    <main>
      <img src={fetchingImg} alt='An abstract image depicting data fetching' />
      {content}
    </main>
  );
}

export default App;
