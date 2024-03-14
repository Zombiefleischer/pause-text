import { registerSettings } from "./settings.js";
let socket;
let pauseTextTimer = null;

Hooks.on("setup", () => {
  registerSettings();
});

Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerModule("pause-text");
  socket.register("selectAndBroadcastPauseText", selectAndBroadcastPauseText);
  socket.register("displayPauseText", displayPauseText);
});

Hooks.on("renderPause", function () {
  if (!$("#pause").hasClass("paused")) return;

  // Make it work with dnd5e 3.x version
  if (
    game.data.system.id === "dnd5e" &&
    isNewerVersion(game.data.system.version, "2.4.1")
  ) {
    $("#pause").removeClass("dnd5e2");
    $("#pause > img").addClass("fa-spin");
  }

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
  // const left = `calc(50% - ${dimensionX / 2 - iconSpacingX}px)`;

  // Get random text
  settings.selectedText = selectRandomPauseText(settings.allText);

  // Get sync settings and open socket
  if ($("#pause").hasClass("paused") && settings.sync) {
    socket.executeAsGM("selectAndBroadcastPauseText", settings);
  } else {
    displayPauseText(settings);
  }

  // Start or stop the text rotation
  const interval = settings.textChangeInterval;
  if ($("#pause").hasClass("paused")) {
    startPauseTextRotation(interval);
  } else if (pauseTextTimer) {
    clearInterval(pauseTextTimer);
    pauseTextTimer = null;
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

  // Set Animation
  if (settings.animation || true) {
    animationFunc(settings);
  }
});

document.getElementById("optionsAnimationDropdown");

function selectRandomPauseText(allText) {
  const lines = allText.split(/\n/);
  return lines[Math.floor(Math.random() * lines.length)];
}

function selectAndBroadcastPauseText(settings) {
  if (game.user.isGM) {
    settings.randomText = settings.selectedText;
    socket.executeForEveryone("displayPauseText", settings);
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
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
      });
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused figcaption").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
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
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
      });
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused h3").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
      });
      $("#pause.paused h3").css({ color: textColor });
      $("#pause.paused").css("background", "none");
    } else {
      $("#pause.paused").css("background", "none");
    }
  }
}

function startPauseTextRotation(interval) {
  if (pauseTextTimer) {
    clearInterval(pauseTextTimer); // Clear existing timer
    pauseTextTimer = null;
  }

  // Disable the timer if the interval is 0 or negative
  if (interval <= 0) {
    return;
  }

  pauseTextTimer = setInterval(() => {
    if (game.paused) {
      const settings = game.settings.get("pause-text", "allSettings");
      if (game.user.isGM && settings.sync) {
        settings.selectedText = selectRandomPauseText(settings.allText);
        selectAndBroadcastPauseText(settings);
      } else if (!settings.sync) {
        settings.selectedText = selectRandomPauseText(settings.allText);
        displayPauseText(settings);
      }
    } else {
      clearInterval(pauseTextTimer);
      pauseTextTimer = null;
    }
  }, interval * 1000);
}

// Handle the Animations
function animationFunc(settings) {
  $("#pause").addClass("pulsate");
}
