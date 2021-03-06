import fs from "fs";
import path from "path";
import marked from "marked";
import grayMatter from "gray-matter";
import prism from "prismjs";

const renderer = new marked.Renderer();

renderer.code = (code, language) => {
  const parser = prism.languages[language] || prism.languages.html;
  const highlighted = prism.highlight(code, parser, language);
  return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
};

marked.use({ renderer });

const POSTS_DIR = "src/posts";

export function allPosts() {
  const posts = fs.readdirSync(POSTS_DIR).map((fileName) => {
    return onePost(fileName);
  });
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function onePost(fileName) {
  let file;
  try {
    file = fs.readFileSync(path.resolve(POSTS_DIR, fileName), "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Could not find file %s", fileName);
      return undefined;
    }
    throw error;
  }

  const { data, content } = grayMatter(file);
  const html = marked(content);

  return {
    ...data,
    html,
  };
}
