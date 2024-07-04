import express from "express";
import path from "path";

const app = express.Router();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./ui/tablet/app.html"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.resolve("./dist/tabletui.js"));
});

app.get("/logo.svg", (req, res) => {
  res.sendFile(path.resolve("./ui/logo.svg"));
});

app.get("/background.svg", (req, res) => {
  res.sendFile(path.resolve("./ui/background.svg"));
});

app.get("/app.css", (req, res) =>
  res.sendFile(path.resolve("./ui/tablet/app.css"))
);

export default app;
