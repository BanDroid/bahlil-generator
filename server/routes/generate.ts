import { Router } from "express";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import multer from "multer";

const upload = multer();

export const generateRoute = Router();

generateRoute.post("/", upload.single("gambar"), async (req, res) => {
  try {
    const bahlilJpg = await readFile(
      resolve(process.cwd(), "assets/bahlil.jpg")
    );
    const targetImg = req.file;
    if (!targetImg) throw new Error("target image is null");
    const formData = new FormData();
    formData.append(
      "srcimage",
      new File([bahlilJpg], "bahlil.jpg", { type: "image/jpeg" })
    );
    formData.append(
      "targetimage",
      new File([new Uint8Array(targetImg.buffer)], targetImg.originalname, {
        type: targetImg.mimetype,
      })
    );
    formData.append("enhance", "false");
    const response = await fetch(
      "https://taiapi.aiphotocraft.com/api/faceswap/multi-face-swap",
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.AIPHOTOCRAFT_API_KEY || "",
          accept: "application/json",
        },
        body: formData,
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.json({ task_id: null });
  }
});

generateRoute.get("/status", async (req, res) => {
  if (!req.query.task_id) return res.json({ result: null });
  try {
    const response = await fetch(
      `https://taiapi.aiphotocraft.com/api/task-status/${req.query.task_id}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.AIPHOTOCRAFT_API_KEY || "",
          accept: "application/json",
        },
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.json({ result: null });
  }
});
