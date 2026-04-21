import fs from "fs";
import path from "path";
import projectsData from "@/content/projects.json";

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  coverImage: string;
  heroImage: string;
  shortDescription: string;
  concept: string;
  spatialIdea: string;
  materials: string;
  gallery: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  preview: string;
  published: boolean;
  content: string[];
};

export function getProjects(): Project[] {
  return projectsData;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().slice(0, 3);
}

export function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "content", "blog");

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => readBlogPost(path.join(blogDir, file)))
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function readBlogPost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const fallbackSlug = path.basename(filePath, ".md");

  return {
    slug: frontmatter.slug || fallbackSlug,
    title: frontmatter.title || fallbackSlug,
    date: frontmatter.date || "2026-04-20",
    coverImage: frontmatter.coverImage || "/assets/source/p22_01_13ac514cfa_461x308.png",
    preview: frontmatter.preview || "",
    published: frontmatter.published !== "false",
    content: body
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  if (!raw.startsWith("---")) {
    return { frontmatter: {}, body: raw };
  }

  const end = raw.indexOf("\n---", 3);

  if (end === -1) {
    return { frontmatter: {}, body: raw };
  }

  const frontmatterRaw = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const frontmatter = Object.fromEntries(
    frontmatterRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        const key = separator === -1 ? line : line.slice(0, separator).trim();
        const value = separator === -1 ? "" : line.slice(separator + 1).trim();

        return [key, value.replace(/^["']|["']$/g, "")];
      }),
  );

  return { frontmatter, body };
}
