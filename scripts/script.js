import {registerSettings} from "./settings.js"
Hooks.on('setup', () => {
    registerSettings();
});
Hooks.on("renderPause", function () {
    if ($("#pause").attr("class") !== "paused") return;
    const path = game.settings.get("pause-icon", "path");
    const opacity = parseInt(game.settings.get("pause-icon", "opacity")) / 100;
    const speed = game.settings.get("pause-icon", "speed") + "s linear 0s infinite normal none running rotation";
    const text = game.settings.get("pause-icon", "text");
    const dimension = game.settings.get("pause-icon", "dimension");
    const top = `${-16 - (dimension - 128) / 2}px`;
    const left = `calc(50% - ${dimension / 2}px)`;
    const height = dimension;
    const width = dimension;
    const size = `${(text.length * 180 / 12) + 70}px 100px`;
    if(path === "None" || dimension === 0) {
        $("#pause.paused img").hide();
    }
    else {
        $("#pause.paused img").attr("src", path);
        $("#pause.paused img").css({"top": top, "left": left, "width": width, "height": height, "opacity": opacity, "-webkit-animation": speed});
    }
    $("#pause.paused h3").text(text);
    if (text.length !== 0) {
        $("#pause.paused").css("background-size", size);
    }
    else {
        $("#pause.paused").css("background", "none");
    }
});