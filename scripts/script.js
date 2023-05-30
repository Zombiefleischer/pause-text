import {registerSettings} from "./settings.js"
Hooks.on('setup', () => {
    registerSettings();
});
Hooks.on("renderPause", function () {
  if ($("#pause").attr("class") !== "paused") return;
  const message = game.settings.get('pause-text', 'allSettings').text;
  const lines = message.split(/\n/);
  const text = lines[Math.floor(Math.random() * lines.length)];
  const fontFamily= game.settings.get("pause-text", "allSettings").fontFamily;
  const textColor = game.settings.get("pause-text", "allSettings").textColor;
  const shadow = game.settings.get("pause-text", "allSettings").shadow;
  const fontSize = game.settings.get("pause-text", "allSettings").fontSize;
  const size = `${(text.length * fontSize * 90 / 12) + 70}px 100px`;

  const path = game.settings.get("pause-text", "allSettings").path;
  const opacity = game.settings.get("pause-text", "allSettings").opacity / 100;
  let speed = game.settings.get("pause-text", "allSettings").speed + "s";
  const reverse = game.settings.get("pause-text", "allSettings").reverse;
  const dimensionX = game.settings.get("pause-text", "allSettings").dimensionX;
  const dimensionY = game.settings.get("pause-text", "allSettings").dimensionY;
  const iconSpacingY = game.settings.get("pause-text", "allSettings").iconSpacingY;
  const top = `${-16 - (dimensionY - 128) / 2 + iconSpacingY}px`;
  const left = `calc(50% - ${dimensionX / 2}px)`;


  if (path === "None" || dimensionX === 0 || dimensionY === 0) {
    $("#pause.paused img").hide();
  }
  else {
    $("#pause.paused img").attr("src", path);
    if (isNewerVersion(game.version, "10")) {
      if (reverse) {
        $("#pause.paused img").css({ "top": top, "left": left, "width": dimensionX, "height": dimensionY, "opacity": opacity, "--fa-animation-duration": speed, "--fa-animation-direction": "reverse" });
      } else {
        $("#pause.paused img").css({ "top": top, "left": left, "width": dimensionX, "height": dimensionY, "opacity": opacity, "--fa-animation-duration": speed });
      }
    }
    else {
      if (reverse) {
        speed += " linear 0s infinite reverse none running rotation";
        $("#pause.paused img").css({ "top": top, "left": left, "width": dimensionX, "height": dimensionY, "opacity": opacity, "-webkit-animation": speed });
      }
      else {
        speed += " linear 0s infinite normal none running rotation";
        $("#pause.paused img").css({ "top": top, "left": left, "width": dimensionX, "height": dimensionY, "opacity": opacity, "-webkit-animation": speed });
      }
    }
  }

  if (isNewerVersion(game.version, "10")) {
    $("#pause.paused figcaption").text(text);
    if (text.length !== 0 && shadow) {
      $("#pause.paused").css({ "background-size": size });
      $("#pause.paused figcaption").css({ "color": textColor, "font-size": `${fontSize}em`, "font-family": `${fontFamily}` });
    }
    else if (text.length !== 0 && !shadow) {
      $("#pause.paused figcaption").css({ "color": textColor, "font-size": `${fontSize}em`, "font-family": `${fontFamily}` });
      $("#pause.paused figcaption").css({ "color": textColor });
      $("#pause.paused").css("background", "none");
    }
    else {
      $("#pause.paused").css("background", "none");
    }
  }
  else {
    $("#pause.paused h3").text(text);
    if (text.length !== 0 && shadow) {
      $("#pause.paused").css({ "background-size": size });
      $("#pause.paused h3").css({ "color": textColor, "font-size": `${fontSize}em`, "font-family": `${fontFamily}` });
    }
    else if (text.length !== 0 && !shadow) {
      $("#pause.paused h3").css({ "color": textColor, "font-size": `${fontSize}em`, "font-family": `${fontFamily}` });
      $("#pause.paused h3").css({ "color": textColor });
      $("#pause.paused").css("background", "none");
    }
    else {
      $("#pause.paused").css("background", "none");
    }
  }
});