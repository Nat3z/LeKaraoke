
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";

let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// on song_queue eventr
//
let playingVideo = false;
var player: any;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
    }
  });
}
let videoIntervalId: any;

let queue: string[] = [];
function onPlayerReady(event: any) {
  console.log("PLAYER IS READY!!")
  event.target.playVideo();
}
let videoPlayerAnimStarted = false;
function videoInterval() {
  console.log("executed")
  if (player.videoTitle !== "10 Hours of Nothing" && player.getDuration() !== 0 && player.getPlayerState() === 1) {
    playingVideo = true;
  }
  if (player.getDuration() !== 0 && player.getDuration() - player.getCurrentTime() < 8 && playingVideo) {
    if (!videoPlayerAnimStarted) {
      videoPlayerAnimStarted = true;
      if (queue.length > 1)
        videoOverlayFadeIn();
    }
  }
  if ((player.getPlayerState() === 0 || player.getPlayerState() === -1) && playingVideo) {
    stepQueue();
    if (queue.length >= 1) {
      overlayFadeOut();
      player.loadVideoById(queue[0]);
      if (videoIntervalId) clearInterval(videoIntervalId);
      videoIntervalId = setInterval(videoInterval, 50);
    }
    videoPlayerAnimStarted = false;
    if (queue.length < 1 && playingVideo) {
      // fade in main container and change scale from 1.2 to 1
      main_container.style.display = "flex";
      main_container.animate([
        { opacity: "0", transform: "scale(1.2)" },
        { opacity: "1", transform: "scale(1)" }
      ], {
        duration: 1500,
        easing: "ease-in-out",
        fill: "forwards"
      });

      video_player.animate([
        { opacity: "1" },
        { opacity: "0" }
      ], {
        duration: 200,
        easing: "ease-in-out",
        fill: "forwards"
      });
      playingVideo = false;

      clearInterval(videoIntervalId);
      setTimeout(() => video_player.style.display = "none", 2000);
    }
  }
}

function stepQueue() {
  const element_removed = queue[0];
  queue.splice(0, 1);
  window.dispatchEvent(new CustomEvent("remove_queue", { detail: element_removed }))
}
window.addEventListener("queue_update", (event: CustomEvent) => {
  queue = event.detail;

  if (queue.length > 0 && !playingVideo) {
    playingVideo = true;
    try {
      player.loadVideoById(queue[0]);
      if (videoIntervalId) clearInterval(videoIntervalId);
      videoIntervalId = setInterval(videoInterval, 50);

      console.log("loaded video" + queue[0])
      video_player.style.display = "flex";
      video_overlay.style.display = "none";
      main_container.style.display = "flex";
      main_container.animate([
        { opacity: "1", transform: "scale(1)" },
        { opacity: "0", transform: "scale(1.2)" }
      ], {
        duration: 1500,
        easing: "ease-in-out",
        fill: "forwards"
      });

      video_player.animate([
        { opacity: "0" },
        { opacity: "1" }
      ], {
        duration: 200,
        easing: "ease-in-out",
        fill: "forwards"
      });
      setTimeout(() => main_container.style.display = "none", 2000)

    } catch (_) {
      console.error(_)
      console.warn("Video player not ready")
      playingVideo = false;
    }
  }
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "r" && event.ctrlKey) {
    window.location.reload()
  }
})

const main_container = document.querySelector("main")! as HTMLDivElement;
const video_player = document.querySelector("#video-player")! as HTMLDivElement;
const video_overlay = document.querySelector("#up-next-overlay")! as HTMLDivElement;
const video_overlay_text = video_overlay.querySelector("h1")! as HTMLHeadingElement;
const video_overlay_title = video_overlay.querySelector("#up-next-text")! as HTMLDivElement;
const video_overlay_queue = video_overlay.querySelector("h4")! as HTMLHeadingElement;
const video_overlay_thumbnail = video_overlay.querySelector("#thumbnail")! as HTMLImageElement;
const video_overlay_author = video_overlay.querySelector("h2")! as HTMLHeadingElement;
const video_overlay_logo = video_overlay.querySelector("#logo")! as HTMLImageElement;

async function videoOverlayFadeIn() {
  video_overlay.style.opacity = "0";
  video_overlay_title.style.left = "-50rem";
  video_overlay_title.style.opacity = "0";
  video_overlay.style.display = "flex";
  video_overlay_queue.style.bottom = "-5rem";
  video_overlay_text.style.left = "-5rem";
  video_overlay_logo.style.top = "-5rem";
  if (queue.length > 0) {
    let vidDetails = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${queue[1]}`).then(res => res.json()).then(data => data);
    video_overlay_title.querySelector("h2")!.textContent = vidDetails.author_name + " - " + vidDetails.title;

    video_overlay_thumbnail.src = vidDetails.thumbnail_url;
    video_overlay_queue.textContent = `${queue.length - 1} videos in queue`;
  }
  else return;
  // animate the overlay to fade in
  video_overlay.animate([
    { opacity: "0" },
    { opacity: "1" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards"
  });

  video_overlay_title.animate([
    { left: "-60rem", opacity: "0" },
    { left: "0", opacity: "1" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
    delay: 1000
  });

  video_overlay_queue.animate([
    { bottom: "-5rem" },
    { bottom: "1rem" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
    delay: 1000
  });

  video_overlay_logo.animate([
    { top: "-5rem" },
    { top: "1rem" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards"
  });

}
// fade out
//
function overlayFadeOut() {
  video_overlay.animate([
    { opacity: "1" },
    { opacity: "0" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
  });

  video_overlay_title.animate([
    { left: "0", opacity: "1" },
    { left: "-50rem", opacity: "0" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
  });

  video_overlay_queue.animate([
    { bottom: "1rem" },
    { bottom: "-5rem" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
  });

  video_overlay_logo.animate([
    { top: "1rem" },
    { top: "-5rem" }
  ], {
    duration: 1500,
    easing: "ease-in-out",
    fill: "forwards",
  });

  setTimeout(() => video_overlay.style.display = "none", 8000)
}

video_overlay.style.display = "none"
main_container.style.display = "flex"
