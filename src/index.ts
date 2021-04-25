import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import sendMail from "./sendMail";
import imap from "./readMail";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static("public"));

app.get("/send", (req, res) => {
  res.send("Hi");
});

app.post("/send", async (req, res) => {
  const data = req.body;
  try {
    await sendMail(res, data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
  imap(process.env.USER_NAME as string, process.env.PASSWORD as string);
});
