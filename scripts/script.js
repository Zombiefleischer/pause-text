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

  setTimeout(() => {
    // Set a timeout for slower loading system to not overwrite my styles
    // Make it work with dnd5e 3.x version
    if (
      game.data.system.id === "dnd5e" &&
      foundry.utils.isNewerVersion(game.data.system.version, "2.4.1")
    ) {
      $("#pause").removeClass("dnd5e2");
      $("#pause > img").addClass("fa-spin");
    }

    // Make it work with WoD
    if (game.data.system.id === "vtm5e") {
      $("#pause > img").each(function () {
        const img = $(this);

        if (img.hasClass("pause-overlay")) {
          img.remove();
        }

        if (img.hasClass("pause-border")) {
          img.removeClass("pause-border");
        }
      });
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

    // For Tidbits
    observePauseTextChanges(settings.fontSize, settings.fontFamily);

    const pauseImage = $("#pause.paused img");
    // Change the displayed image
    if (path === "None" || dimensionX === 0 || dimensionY === 0) {
      pauseImage.hide();
    } else {
      const pauseCss = {
        content: `url(${path})`,
        top: top,
        left: left,
        width: dimensionX,
        height: dimensionY,
        opacity: opacity,
      };
      if (foundry.utils.isNewerVersion(game.version, "10")) {
        pauseCss["--fa-animation-duration"] = speed;
        $("#pause img.fa-spin").css(
          "animation-duration",
          "var(--fa-animation-duration, 5s)",
        );
        if (reverse) {
          pauseCss["--fa-animation-direction"] = "reverse";
          $("#pause img.fa-spin").css(
            "animation-direction",
            "var(--fa-animation-direction, normal)",
          );
        }
      } else {
        pauseCss["-webkit-animation"] =
          `${speed} linear 0s infinite ${reverse ? "reverse" : "normal"} none running rotation`;
      }
      pauseImage.attr("src", path);
      pauseImage.css(pauseCss);
    }
  });
});

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

function getTextboxSize(length, fontSize, figcaptionHeight) {
  const calculatedWidth = (length * fontSize * 90) / 12 + 70;
  const maxWidth = $("#pause").width() * 0.5 + 300;
  const finalWidth = Math.min(calculatedWidth, maxWidth);

  const finalHeight = figcaptionHeight > 70 ? 200 : 100;

  const size = `${finalWidth}px ${finalHeight}px`;
  return size;
}

function getPauseSize(figcaptionHeight) {
  const figureHeight = figcaptionHeight > 70 ? 200 : 100;
  const paddingTop = figcaptionHeight > 70 ? 50 : 0;

  const size = {
    height: `${figureHeight}px`,
    paddingTop: `${paddingTop}px`,
  };
  return size;
}

function disableBackgroundIfTidbitPresent() {
  if ($("#pause.paused .tidbit-pause-text").length) {
    $("#pause.paused").css("background", "none");
  }
}

function displayPauseText(settings) {
  // Get text settings
  const text = settings.selectedText;
  const fontFamily = settings.fontFamily;
  const textColor = settings.textColor;
  const shadow = settings.shadow;
  const fontSize = settings.fontSize;
  // const size = `${(text.length * fontSize * 90) / 12 + 70}px 100px`;
  // const size = getTextboxSize(text.length, fontSize);

  // Change pause text
  if (foundry.utils.isNewerVersion(game.version, "10")) {
    $("#pause.paused figcaption").text(text);
    if (text.length !== 0 && shadow) {
      $("#pause.paused figcaption").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
        "padding-top": `30px`,
        "overflow-wrap": "break-word",
        // TODO: "font-variant": "small-caps",
      });
      const figcaptionHeight = $("#pause.paused figcaption").outerHeight();
      const size = getTextboxSize(text.length, fontSize, figcaptionHeight);
      const pauseSize = getPauseSize(figcaptionHeight);
      $("#pause.paused").css({ "background-size": size });
      $("#pause").css({
        height: pauseSize.height,
        "padding-top": pauseSize.paddingTop,
      });
      disableBackgroundIfTidbitPresent();
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused figcaption").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
        "padding-top": `24px`,
        "overflow-wrap": "break-word",
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
        "padding-top": `24px`,
        "overflow-wrap": "break-word",
      });
    } else if (text.length !== 0 && !shadow) {
      $("#pause.paused h3").css({
        color: textColor,
        "font-size": `${fontSize}em`,
        "font-family": `${fontFamily}`,
        width: `50%`,
        margin: `auto`,
        "line-height": `24px`,
        "padding-top": `24px`,
        "overflow-wrap": "break-word",
      });
      $("#pause.paused h3").css({ color: textColor });
      $("#pause.paused").css("background", "none");
    } else {
      $("#pause.paused").css("background", "none");
    }
  }
}

// Function to change tidbits Textstyle (Module: https://foundryvtt.com/packages/tidbits)
function tidbitsTextStyle(fontSize, fontFamily) {
  $("#pause.paused .tidbit-pause-text").css({
    "font-size": `${fontSize}em`,
    "font-family": `${fontFamily}`,
  });
}

// Function to observe changes to the figcaption element
function observePauseTextChanges(fontSize, fontFamily) {
  const pauseEl = document.getElementById("pause");

  if (pauseEl) {
    const textContainer = pauseEl.querySelector("figcaption");

    if (textContainer) {
      // Create a MutationObserver to watch for changes
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" || mutation.type === "subtree") {
            tidbitsTextStyle(fontSize, fontFamily);
            disableBackgroundIfTidbitPresent();
          }
        }
      });

      // Start observing the figcaption element for changes
      observer.observe(textContainer, {
        childList: true,
        subtree: true,
      });

      // Initial application of styles
      tidbitsTextStyle(fontSize, fontFamily);
      disableBackgroundIfTidbitPresent();
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
