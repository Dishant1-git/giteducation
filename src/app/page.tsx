import { getHomeFaqs, getPosts } from "@/lib/cms";

import { Home } from "./home";

/** The home page. Its blog slider and FAQ come from the CMS; the rest is in home.tsx. */
export default async function HomePage() {
  const [posts, faqs] = await Promise.all([getPosts(), getHomeFaqs()]);
  return <Home posts={posts} faqs={faqs} />;
}
