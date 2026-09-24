/**
 * Photos shown at /gallery.
 *
 * Only add photos taken at GIT Education, with the permission of anyone clearly shown.
 * Captions describe what is in the frame. Do not name colleges or events that the photo
 * does not actually show.
 */

export type GalleryPhoto = {
  src: string;
  /** Short caption, also used as the image alt text. */
  caption: string;
};

export const PHOTOS: GalleryPhoto[] = [
  { src: "/images/about/alpine-college-full-hall.jpeg", caption: "A full hall at one of our seminar sessions" },
  { src: "/images/about/alpine-college-team-with-faculty.jpeg", caption: "Our team with faculty after a session" },
  { src: "/images/about/team.jpg", caption: "The GIT Education team" },
  { src: "/images/categories/office.jpg", caption: "Computer and MS Office practice" },
  { src: "/images/categories/accounts.jpg", caption: "Accounts and Tally Prime classes" },
  { src: "/images/categories/cad.jpg", caption: "CAD/CAM drawing work" },
  { src: "/images/categories/design.jpg", caption: "Graphic design practice" },
  { src: "/images/categories/digital.jpg", caption: "Digital marketing sessions" },
  { src: "/images/categories/web.jpg", caption: "Working on the web" },
];
