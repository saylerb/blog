import fs from "fs";
import path from "path";
import marked from "marked";

const renderer = new marked.Renderer();

marked.use({ renderer });

export default function (directoryPath) {
  return fs.readdirSync(directoryPath).map((fileName, index) => {
    const file = fs.readFileSync(
      path.resolve(directoryPath, fileName),
      "utf-8"
    );
    return {
      title: "post " + index,
      slug: fileName,
      html: marked(file),
    };
  });
}
