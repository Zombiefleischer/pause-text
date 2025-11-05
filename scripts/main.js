import { registerSettings } from "./settings.js";
import { setPauseUI } from "./pause-text.js";

export const MODULE_ID = "pause-text";

Hooks.on("init", async () => {
  registerSettings();
});

Hooks.on("renderGamePause", function (_, html, options) {
  if (options.cssClass === "paused") {
    setTimeout(() => {
      setPauseUI(html);
    });
  }
});

// Sadly doesn't set the image on the first load
// Hooks.on("pauseGame", (paused, html) => {
//   if (paused) {
//     setTimeout(() => {
//       setPauseUI(html);
//     }, 1);
//   }
// })
