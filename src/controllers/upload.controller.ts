import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/app.utils";
import { dataUri } from "../utils/datauri";
import { v2 as cloudinary } from "cloudinary";

export const uploadController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      const { content, fileExtension } = dataUri(req.file);
      if (!content) {
        return next(new Error("Error in converting file to data uri"));
      }
      const { secure_url } = await cloudinary.uploader.upload(content, {
        format: fileExtension.slice(1),
        resource_type: "auto",
      });
      sendResponse(
        res,
        201,
        { url: secure_url, extension: fileExtension },
        "File uploaded successfully"
      );
    } else {
      sendResponse(res, 400, {}, "No file found in request");
    }
  } catch (error) {
    console.log("Error in uploading file", error);
    next(error);
  }
};
