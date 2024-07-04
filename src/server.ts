import express from "express";
import { createServer } from "http";
import puppeteer from "puppeteer";
import tabletRoute from "./server.tablet";

export let SongQueue: string[] = [];
export function updateSongQueue(queue: string[]) {
  SongQueue = queue;
}

const browser_promise = puppeteer.launch({ headless: true });
const app = express();
const server = createServer(app);

app.use("/tablet", tabletRoute);

browser_promise.then(async (browser) => {
  const page = await browser.newPage()
  await page.goto("https://www.youtube.com");
});
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

  // navigate to youtube.com
  let browser = await browser_promise;
  // check if page is already open
  const pages = await browser.pages();
  let page = pages[1];
  // clear input#search fully before typing
  await page.goto("https://www.youtube.com");

  await page.type("input#search", search_term);
  // click the search button
  await page.click("button#search-icon-legacy");
  // wait for the search results to load
  await page.waitForSelector("ytd-video-renderer");
  // for each search result, return the title and URL and creator
  const results = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("ytd-video-renderer"));
    return elements.map((element) => {
      // check if badge badge-style-type-verified-artist style-scope ytd-badge-supported-renderer style-scope ytd-badge-supported-renderer exists in the element
      // const verified = element.querySelector(".badge.badge-style-type-verified-artist.style-scope.ytd-badge-supported-renderer.style-scope.ytd-badge-supported-renderer") ? true : false;
      // if (!verified) return null;
      const title = element.querySelector("#video-title")?.textContent.trim().replace(/\n/g, "");
      const url = element.querySelector("#video-title")?.getAttribute("href");

      const creator = element.querySelector("yt-formatted-string.ytd-channel-name")?.textContent;
      return { title, url, creator };
    });
  });
  res.json(results);
})

app.post("/add_to_queue", (req, res) => {
  if (!req.query.url || typeof req.query.url !== "string") {
    return res.status(400).send("missing query parameter 'url'");
  }
  // extract the youtube video id
  const id = req.query.url.split("v=")[1];
  if (!id) {
    return res.status(400).send("invalid youtube video URL");
  }
  SongQueue.push(id);
  res.send("1");
});

// get ip address of the server
import ip from "ip";
const ipAddr = ip.address()

server.listen(4000, ipAddr, () => {
  console.log(`Server is running on http://${ipAddr}:4000`);
});
