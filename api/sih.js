import { readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "sih26033.json"
    );

    const data = JSON.parse(
      await readFile(filePath, "utf8")
    );

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Live data file unavailable",
      message: error.message
    });
  }
}
