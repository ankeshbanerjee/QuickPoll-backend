import { createServer } from "http";
import app from "./app";
import { connectToDb } from "./utils/db.utils";

const admin = require("firebase-admin");
const serviceAccount = require("../firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const server = createServer(app);

connectToDb();

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
