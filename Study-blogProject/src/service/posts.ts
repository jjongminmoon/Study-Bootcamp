import path from "path";
import { readFile } from "fs/promises";
import { cache } from "react";

export type Post = {
  title: string;
  description: string;
  date: Date;
  category: string;
  path: string;
  featured: boolean;
};

export type PostData = Post & { content: string; next: Post | null; prev: Post | null };

export const getPosts = cache(async () => {
  const filePath = path.join(process.cwd(), "data", "posts.json");

  return readFile(filePath, "utf-8")
    .then<Post[]>(JSON.parse)
    .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
});

// export async function getPosts(): Promise<Post[]> {
//   const filePath = path.join(process.cwd(), "data", "posts.json");

//   return readFile(filePath, "utf-8")
//     .then<Post[]>(JSON.parse)
//     .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
// }

export async function getPostData(fileName: string): Promise<PostData> {
  const filePath = path.join(process.cwd(), "data", "posts", `${fileName}.md`);
  const posts = await getPosts();
  const post = posts.find((post) => post.path === fileName);

  if (!post) throw new Error(`${fileName}에 해당하는 포스트를 찾을 수 없음`);

  const index = posts.indexOf(post);
  const next = index < posts.length - 1 ? posts[index + 1] : null;
  const prev = index > 0 ? posts[index - 1] : null;
  const content = await readFile(filePath, "utf-8");

  return { ...post, content, next, prev };
}
