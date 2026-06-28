import "server-only";
import { readCollection, writeCollection, uniqueId, slugify } from "./store";

export type PostStatus = "Draft" | "Published";
export type CommentStatus = "Pending" | "Approved";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  status: PostStatus;
  date: string;
  readingTime: number;
};

export type BlogComment = {
  id: string;
  postTitle: string;
  author: string;
  body: string;
  date: string;
  status: CommentStatus;
};

const POSTS = "blog-posts";
const COMMENTS = "blog-comments";

const postSeed: BlogPost[] = [
  {
    id: "smash-secret",
    title: "The Secret Behind Our Smash Patty",
    slug: "smash-secret",
    excerpt: "Why we press every fillet to order — and what that crispy lacework crust really does for flavour.",
    body: "At FRYO, every patty is smashed to order on a screaming-hot flat-top. That Maillard crust is where the magic lives...",
    author: "Chef Marco",
    category: "Behind the Scenes",
    tags: ["beef", "technique"],
    status: "Published",
    date: "24 Jun 2026",
    readingTime: 3,
  },
  {
    id: "algerian-sauce",
    title: "Algerian Hot: The Sauce That Started a Cult",
    slug: "algerian-sauce",
    excerpt: "A little history on our most-requested sauce and the heat that keeps people coming back.",
    body: "It began as a staff-meal experiment. Now it's the reason half our orders come with 'extra Algerian'...",
    author: "Sana K.",
    category: "Recipes",
    tags: ["sauce", "spicy"],
    status: "Published",
    date: "18 Jun 2026",
    readingTime: 4,
  },
  {
    id: "delivery-under-10",
    title: "How We Hit Sub-10-Minute Delivery",
    slug: "delivery-under-10",
    excerpt: "A peek at the kitchen pipeline that gets a fresh build to your door before it cools.",
    body: "Speed without sacrificing quality is a logistics problem. Here's how our order pipeline works...",
    author: "Ops Team",
    category: "Behind the Scenes",
    tags: ["delivery", "ops"],
    status: "Draft",
    date: "12 Jun 2026",
    readingTime: 5,
  },
  {
    id: "smash-not-stack",
    title: "Why We Smash, Not Stack",
    slug: "smash-not-stack",
    excerpt: "Tall burgers look great on camera, but a proper smash wins on flavour every time. Here's the science.",
    body: "A smashed patty isn't about height — it's about surface area. When beef hits a screaming flat-top and gets pressed thin, the Maillard reaction goes into overdrive across the whole patty.\n\nThe result is a lacy, caramelised crust that a thick stacked patty simply can't match. We'd rather you taste the beef than dislocate your jaw.\n\nThat's why every FRYO build starts with a smash, not a stack.",
    author: "Chef Marco",
    category: "Recipes",
    tags: ["beef", "technique", "flavour"],
    status: "Published",
    date: "20 Jun 2026",
    readingTime: 3,
  },
  {
    id: "team-pass",
    title: "Meet the Crew Behind the Pass",
    slug: "team-pass",
    excerpt: "From the fry station to the front of house — the people who make every order fly out the door.",
    body: "A great burger is a team sport. Behind every FRYO order is a tight crew working the pass in sync.\n\nMarco runs the grill, Sana keeps the sauces flowing, and the front-of-house team make sure your order is hot, correct and out the door in minutes.\n\nWe hire for energy and train for skill — and it shows in every build.",
    author: "Sana K.",
    category: "Behind the Scenes",
    tags: ["team", "culture"],
    status: "Published",
    date: "16 Jun 2026",
    readingTime: 2,
  },
  {
    id: "build-a-better-burger",
    title: "5 Ways to Build a Better Burger",
    slug: "build-a-better-burger",
    excerpt: "Make the customize screen work for you — five combos our regulars swear by.",
    body: "The build-your-own flow is where the magic happens. Here are five regular-approved combos:\n\n1. Sourdough + Garlic Aioli + Extra Patty for a heavyweight.\n2. Lettuce Wrap + Buffalo for a low-carb kick.\n3. Brioche + Algerian Hot + Crispy Onions — the classic charge.\n4. Sesame + BBQ + Smoked Bacon for the smokehouse.\n5. Add Avocado to anything. Trust us.\n\nMix, match and make it yours.",
    author: "Sana K.",
    category: "Guides",
    tags: ["customize", "tips"],
    status: "Published",
    date: "10 Jun 2026",
    readingTime: 4,
  },
];

const commentSeed: BlogComment[] = [
  { id: "cm-1", postTitle: "The Secret Behind Our Smash Patty", author: "Maya R.", body: "This explains why the edges are so good. Mind blown.", date: "25 Jun 2026", status: "Approved" },
  { id: "cm-2", postTitle: "Algerian Hot: The Sauce That Started a Cult", author: "Tariq B.", body: "Need this by the bottle. Please.", date: "20 Jun 2026", status: "Pending" },
  { id: "cm-3", postTitle: "The Secret Behind Our Smash Patty", author: "spam_bot_99", body: "Cheap watches click here >>>", date: "26 Jun 2026", status: "Pending" },
  { id: "cm-4", postTitle: "Algerian Hot: The Sauce That Started a Cult", author: "Jess W.", body: "The medium is plenty hot for me but my partner loves the inferno.", date: "21 Jun 2026", status: "Pending" },
];

/* ── Posts ── */
export async function listPosts(): Promise<BlogPost[]> {
  return readCollection<BlogPost>(POSTS, postSeed);
}

export async function getPost(id: string): Promise<BlogPost | null> {
  return (await listPosts()).find((p) => p.id === id) ?? null;
}

/** Public site: published posts only. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  return (await listPosts()).filter((p) => p.status === "Published");
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await listPosts()).find((p) => p.slug === slug && p.status === "Published") ?? null;
}

export type PostInput = {
  id?: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  status: PostStatus;
};

export async function savePost(input: PostInput): Promise<BlogPost> {
  const rows = await listPosts();
  const readingTime = Math.max(1, Math.round(input.body.split(/\s+/).filter(Boolean).length / 200));
  if (input.id) {
    let updated: BlogPost | null = null;
    const next = rows.map((p) => {
      if (p.id !== input.id) return p;
      updated = { ...p, ...input, slug: slugify(input.title) || p.slug, readingTime, id: p.id };
      return updated;
    });
    await writeCollection(POSTS, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.title || "post", rows.map((p) => p.id));
  const post: BlogPost = {
    ...input,
    id,
    slug: slugify(input.title) || id,
    readingTime,
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
  await writeCollection(POSTS, [post, ...rows]);
  return post;
}

export async function updatePostStatus(id: string, status: PostStatus): Promise<void> {
  const rows = await listPosts();
  await writeCollection(POSTS, rows.map((p) => (p.id === id ? { ...p, status } : p)));
}

export async function deletePost(id: string): Promise<void> {
  const rows = await listPosts();
  await writeCollection(POSTS, rows.filter((p) => p.id !== id));
}

/* ── Comments ── */
export async function listComments(): Promise<BlogComment[]> {
  return readCollection<BlogComment>(COMMENTS, commentSeed);
}

export async function updateCommentStatus(id: string, status: CommentStatus): Promise<void> {
  const rows = await listComments();
  await writeCollection(COMMENTS, rows.map((c) => (c.id === id ? { ...c, status } : c)));
}

export async function deleteComment(id: string): Promise<void> {
  const rows = await listComments();
  await writeCollection(COMMENTS, rows.filter((c) => c.id !== id));
}
