import express from "express";
import { createServer } from "http";
import tabletRoute from "./server.tablet";
import remoteRoute from "./server.remote";
import { Innertube } from "youtubei.js"
let youtube: Innertube;

export let SongQueue: string[] = [];
export let VideoMap = new Map<string, { title: string, creator: string }>();

export function updateSongQueue(queue: string[]) {
  SongQueue = queue;
}

const app = express();
const server = createServer(app);

app.use(express.json());
app.use("/tablet", tabletRoute);
app.use("/remote", remoteRoute);

app.get("/", (req, res) => {
  res.send("hello world!")
});

app.get("/ilove", (req, res) => {
  res.send("i love undertime slopper + 2")
});

app.get("/search", async (req, res) => {
  const search_term = req.query.q;
  if (!search_term || typeof search_term !== "string") {
    return res.status(400).send("missing query parameter 'q'");
  }
  const results = (await youtube.search(search_term, { type: "video" })).videos as VideoCard[];
  res.json(results);
})

app.get("/queue", (req, res) => {
  res.json({ queue: SongQueue, map: Object.fromEntries(VideoMap) });
});
app.post("/add_to_queue", (req, res) => {
  if (!req.query.url || typeof req.query.url !== "string") {
    return res.status(400).send("missing query parameter 'url'");
  }
  // extract the youtube video id
  const id = req.query.url.split("v=")[1];
  if (!id) {
    return res.status(400).send("invalid youtube video URL");
  }

  VideoMap.set(id, { title: req.body.title, creator: req.body.creator })
  SongQueue.push(id);
  res.send("1");
});

// get ip address of the server
import ip from "ip";
import { VideoCard } from "youtubei.js/dist/src/parser/nodes";
const ipAddr = ip.address()

server.listen(4000, ipAddr, async () => {
  youtube = await Innertube.create();


  console.log(`Server is running on http://${ipAddr}:4000`);
});
