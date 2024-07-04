// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
declare global {
  interface Window {
    electronAPI: {
      getQueue: () => Promise<string[]>;
      removeQueue: (element: string) => Promise<void>;
    };
  }
  // add YT class and set to any
  var YT: any;
}

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getQueue: () => ipcRenderer.invoke("get_queue"),
  removeQueue: (element: string) => ipcRenderer.invoke("remove_queue", element),
});

window.addEventListener("remove_queue", async (event: CustomEvent) => {
  await ipcRenderer.invoke("remove_queue", event.detail);
  console.log("removed :)")
})
setInterval(async () => {
  const queue = await ipcRenderer.invoke("get_queue");
  window.dispatchEvent(new CustomEvent("queue_update", { detail: queue }));
}, 50);

