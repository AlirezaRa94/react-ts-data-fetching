import { useState, useEffect, ReactNode } from "react";
import { z } from "zod";

import BlogPosts, { type BlogPost } from "./components/BlogPosts";
import { get } from "./utils/http";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await get("https://jsonplaceholder.typicode.com/posts");
        const parsedData = expectedResponseDataSchema.parse(data);

        const blogPosts: BlogPost[] = parsedData.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
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
