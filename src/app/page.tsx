import { getHomeFaqs, getPosts, getTestimonials } from "@/lib/cms";

import { Home } from "./home";

/** The home page. Its blog slider and FAQ come from the CMS; the rest is in home.tsx. */
export default async function HomePage() {
  const [posts, faqs, testimonials] = await Promise.all([getPosts(), getHomeFaqs(), getTestimonials()]);
  return <Home posts={posts} faqs={faqs} testimonials={testimonials} />;
}
