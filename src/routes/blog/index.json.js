import loadPosts from "./_loadPosts";

export function get(req, res) {
  const posts = loadPosts("src/posts");

  const json = JSON.stringify(posts);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(json);
}
