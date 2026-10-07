export type CmsNavPage = {
  slug: string;
  label: string;
  placement: "header" | "footer";
};

export type SiteTestimonial = {
  studentName: string;
  photo?: string;
  courseName?: string;
  batch?: string;
  rating: number;
  quote: string;
  videoUrl?: string;
  googleReviewUrl?: string;
};
