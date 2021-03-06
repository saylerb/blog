import { allPosts } from "./_loadPosts";

export function get(req, res) {
  const posts = allPosts().filter(
    (post) => process.env.NODE_ENV === "development" || post.published
  );

  const json = JSON.stringify(posts);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(json);
}
