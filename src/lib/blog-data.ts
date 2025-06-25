export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  gradient: string;
  author: string;
  authorInitials: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Why Kawaii Culture Is Taking Over India's Gen-Z Scene",
    slug: "kawaii-culture-india-genz",
    excerpt:
      "From Harajuku fashion to pastel aesthetics, we deep dive into how Japanese kawaii culture is reshaping youth trends across Indian cities.",
    category: "Kawaii",
    date: "June 18, 2025",
    readTime: "6 min read",
    gradient: "linear-gradient(135deg, #b06cf0, #ff6eb4)",
    author: "Priya Sharma",
    authorInitials: "PS",
  },
  {
    title: "Top 10 Anime Collectibles Worth Owning in 2025",
    slug: "top-anime-collectibles-2025",
    excerpt:
      "We researched hundreds of anime figures, keychains, and limited edition drops to bring you the definitive collector's guide for 2025.",
    category: "Anime",
    date: "June 12, 2025",
    readTime: "8 min read",
    gradient: "linear-gradient(135deg, #00d4aa, #00b4d8)",
    author: "Rahul Mehta",
    authorInitials: "RM",
  },
  {
    title: "The Perfect Unboxing Experience: How We Pack Every Scoop",
    slug: "perfect-unboxing-behind-scenes",
    excerpt:
      "Go behind the scenes at MysteryScoop HQ and discover how our curation team selects, packs, and ships each mystery box with love.",
    category: "Unboxing",
    date: "June 5, 2025",
    readTime: "5 min read",
    gradient: "linear-gradient(135deg, #ffd166, #ff9f43)",
    author: "Anjali Kapoor",
    authorInitials: "AK",
  },
  {
    title: "Aesthetic Journaling: 5 Styles You Need To Try This Season",
    slug: "aesthetic-journaling-styles-2025",
    excerpt:
      "Whether you're into cottagecore, dark academia, or minimalism — discover the journaling aesthetics that are trending right now.",
    category: "Culture",
    date: "May 28, 2025",
    readTime: "4 min read",
    gradient: "linear-gradient(135deg, #ff6eb4, #b06cf0)",
    author: "Sneha Iyer",
    authorInitials: "SI",
  },
  {
    title: "DIY Kawaii Accessories: Turn Your Mystery Items Into Art",
    slug: "diy-kawaii-accessories-ideas",
    excerpt:
      "Got a cute plushie keychain but not sure what to do with it? We show you 7 creative DIY ideas to customize and display your mystery box finds.",
    category: "Tips",
    date: "May 20, 2025",
    readTime: "7 min read",
    gradient: "linear-gradient(135deg, #00d4aa, #b06cf0)",
    author: "Priya Sharma",
    authorInitials: "PS",
  },
  {
    title: "Sanrio vs Ghibli: The Ultimate Kawaii Showdown",
    slug: "sanrio-vs-ghibli-kawaii-showdown",
    excerpt:
      "Hello Kitty or Totoro? Cinnamoroll or Kiki? We put Japan's two biggest kawaii universes head-to-head in the ultimate fan debate.",
    category: "Anime",
    date: "May 12, 2025",
    readTime: "9 min read",
    gradient: "linear-gradient(135deg, #ff6eb4, #ffd166)",
    author: "Rahul Mehta",
    authorInitials: "RM",
  },
];
