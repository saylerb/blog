import { allPosts } from "./_loadPosts";

export function get(req, res) {
  const posts = allPosts();

  const json = JSON.stringify(posts);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(json);
}
