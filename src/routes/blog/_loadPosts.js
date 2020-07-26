import fs from "fs";
import path from "path";
import marked from "marked";

const renderer = new marked.Renderer();

marked.use({ renderer });

const POSTS_DIR = "src/posts";

export function allPosts() {
  return fs.readdirSync(POSTS_DIR).map((fileName, index) => {
    return onePost(fileName, index);
  });
}

export function onePost(fileName, index = Math.floor(10 * Math.random())) {
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

  return {
    title: "post " + index,
    slug: fileName,
    html: marked(file),
  };
}
