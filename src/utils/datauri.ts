import DataURIParser from "datauri/parser";
import path from "path";

const dataUri = (file: Express.Multer.File) => {
  const parser = new DataURIParser();
  const fileExtension = path.extname(file.originalname).toString();
  const { content } = parser.format(fileExtension, file.buffer);
  return { content, fileExtension };
};

export { dataUri };
