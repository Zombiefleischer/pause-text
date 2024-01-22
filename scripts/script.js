import { registerSettings } from "./settings.js";
let socket;

Hooks.on("setup", () => {
  registerSettings();
});

Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerModule("pause-text");
  socket.register("selectAndBroadcastPauseText", selectAndBroadcastPauseText);
  socket.register("displayPauseText", displayPauseText);
});

Hooks.on("renderPause", async function () {
  if ($("#pause").attr("class") !== "paused") return;

  // Get all settings
  const settings = game.settings.get("pause-text", "allSettings");

  // Get image settings
  const path = settings.path;
  const opacity = settings.opacity / 100;
  let speed = settings.speed + "s";
  const reverse = settings.reverse;
  const dimensionX = settings.dimensionX;
  const dimensionY = settings.dimensionY;
  const iconSpacingY = settings.iconSpacingY;
  const top = `${-16 - (dimensionY - 128) / 2 + iconSpacingY}px`;
  const left = `calc(50% - ${dimensionX / 2}px)`;

  // Get random text
  const message = settings.allText;
  const lines = message.split(/\n/);
  settings.selectedText = lines[Math.floor(Math.random() * lines.length)];

  // Get sync settings and open socket
  if ($("#pause").attr("class") === "paused" && settings.sync) {
    await socket.executeAsGM("selectAndBroadcastPauseText", settings);
  } else {
    displayPauseText(settings);
  }

  // Change the displayed image
  if (path === "None" || dimensionX === 0 || dimensionY === 0) {
    $("#pause.paused img").hide();
  } else {
    $("#pause.paused img").attr("src", path);
    if (isNewerVersion(game.version, "10")) {
      if (reverse) {
        $("#pause.paused img").css({
          top: top,
          left: left,
          width: dimensionX,
          height: dimensionY,
          opacity: opacity,
          "--fa-animation-duration": speed,
          "--fa-animation-direction": "reverse",
        });
      } else {
        $("#pause.paused img").css({
          top: top,
          left: left,
          width: dimensionX,
          height: dimensionY,
          opacity: opacity,
          "--fa-animation-duration": speed,
        });
      }
    } else {
      if (reverse) {
        speed += " linear 0s infinite reverse none running rotation";
        $("#pause.paused img").css({
          top: top,
          left: left,
          width: dimensionX,
          height: dimensionY,
          opacity: opacity,
          "-webkit-animation": speed,
        });
      } else {
        speed += " linear 0s infinite normal none running rotation";
        $("#pause.paused img").css({
          top: top,
          left: left,
          width: dimensionX,
          height: dimensionY,
          opacity: opacity,
          "-webkit-animation": speed,
        });
      }
    }
  }
});

async function selectAndBroadcastPauseText(settings) {
  if (game.user.isGM) {
    settings.randomText = settings.selectedText;
    await socket.executeForEveryone("displayPauseText", settings);
  }
}

function displayPauseText(settings) {
  // Get text settings
  const text = settings.selectedText;
  const fontFamily = settings.fontFamily;
  const textColor = settings.textColor;
  const shadow = settings.shadow;
  const fontSize = settings.fontSize;
  const size = `${(text.length * fontSize * 90) / 12 + 70}px 100px`;

  // Change pause text
  if (isNewerVersion(game.version, "10")) {
    $("#pause.paused figcaption").text(text);
    if (text.length !== 0 && shadow) {
      $("#pause.paused").css({ "background-size": size });
      $("#pause.paused figcaption").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
      });
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused figcaption").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
      });
      $("#pause.paused figcaption").css({ color: textColor });
      $("#pause.paused").css("background", "none");
    } else {
      $("#pause.paused").css("background", "none");
    }
  } else {
    $("#pause.paused h3").text(text);
    if (text.length !== 0 && shadow) {
      $("#pause.paused").css({ "background-size": size });
      $("#pause.paused h3").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
      });
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused h3").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
      });
      $("#pause.paused h3").css({ color: textColor });
      $("#pause.paused").css("background", "none");
    } else {
      $("#pause.paused").css("background", "none");
    }
  }
}
