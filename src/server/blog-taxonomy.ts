import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type BlogTerm = { id: string; name: string };
export type BlogAuthor = { id: string; name: string; email: string; bio: string };

const CATS = "blog-categories";
const TAGS = "blog-tags";
const AUTHORS = "blog-authors";

const catSeed: BlogTerm[] = [
  { id: "behind-the-scenes", name: "Behind the Scenes" },
  { id: "recipes", name: "Recipes" },
  { id: "guides", name: "Guides" },
  { id: "news", name: "News" },
];
const tagSeed: BlogTerm[] = [
  { id: "beef", name: "beef" },
  { id: "technique", name: "technique" },
  { id: "sauce", name: "sauce" },
  { id: "spicy", name: "spicy" },
  { id: "delivery", name: "delivery" },
  { id: "team", name: "team" },
];
const authorSeed: BlogAuthor[] = [
  { id: "chef-marco", name: "Chef Marco", email: "marco@fryo.co.uk", bio: "Head chef. Lives by the flat-top." },
  { id: "sana-k", name: "Sana K.", email: "sana@fryo.co.uk", bio: "Sauce alchemist & ops lead." },
  { id: "ops-team", name: "Ops Team", email: "ops@fryo.co.uk", bio: "Keeps the pipeline sub-10." },
];

/* generic term helpers (categories + tags) */
async function listTerms(file: string, seed: BlogTerm[]) {
  return readCollection<BlogTerm>(file, seed);
}
async function saveTerm(file: string, seed: BlogTerm[], input: { id?: string; name: string }) {
  const rows = await listTerms(file, seed);
  if (input.id) {
    await writeCollection(file, rows.map((t) => (t.id === input.id ? { ...t, name: input.name } : t)));
    return;
  }
  const id = uniqueId(input.name || "term", rows.map((t) => t.id));
  await writeCollection(file, [...rows, { id, name: input.name }]);
}
async function deleteTerm(file: string, seed: BlogTerm[], id: string) {
  const rows = await listTerms(file, seed);
  await writeCollection(file, rows.filter((t) => t.id !== id));
}

export const listCategories = () => listTerms(CATS, catSeed);
export const saveCategory = (i: { id?: string; name: string }) => saveTerm(CATS, catSeed, i);
export const deleteCategory = (id: string) => deleteTerm(CATS, catSeed, id);

export const listTags = () => listTerms(TAGS, tagSeed);
export const saveTag = (i: { id?: string; name: string }) => saveTerm(TAGS, tagSeed, i);
export const deleteTag = (id: string) => deleteTerm(TAGS, tagSeed, id);

/* authors */
export async function listAuthors(): Promise<BlogAuthor[]> {
  return readCollection<BlogAuthor>(AUTHORS, authorSeed);
}
export async function saveAuthor(input: { id?: string; name: string; email: string; bio: string }): Promise<void> {
  const rows = await listAuthors();
  if (input.id) {
    await writeCollection(AUTHORS, rows.map((a) => (a.id === input.id ? { ...a, ...input, id: a.id } : a)));
    return;
  }
  const id = uniqueId(input.name || "author", rows.map((a) => a.id));
  await writeCollection(AUTHORS, [...rows, { id, name: input.name, email: input.email, bio: input.bio }]);
}
export async function deleteAuthor(id: string): Promise<void> {
  const rows = await listAuthors();
  await writeCollection(AUTHORS, rows.filter((a) => a.id !== id));
}
