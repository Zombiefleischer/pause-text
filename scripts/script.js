import {registerSettings} from "./settings.js"
Hooks.on('setup', () => {
    registerSettings();
});
Hooks.on("renderPause", function () {
    if ($("#pause").attr("class") !== "paused") return;
    const path = game.settings.get("pause-icon", "path");
    const opacity = parseInt(game.settings.get("pause-icon", "opacity")) / 100;
    const speed = game.settings.get("pause-icon", "speed") + "s linear 0s infinite normal none running rotation";
    $("#pause.paused img").attr("src", path);
    $("#pause.paused img").css({"opacity": opacity, "-webkit-animation": speed});
    $("#pause.paused h3").text(game.settings.get("pause-icon", "text"));
});