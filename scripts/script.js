import {registerSettings} from "./settings.js"
Hooks.on('init', () => {
    registerSettings();
});
Hooks.on("renderPause", function () {
    if ($("#pause").attr("class") !== "paused") return;
    const path = game.settings.get("pause-icon", "path").replace(/(\[.*?\] )/g, "");
    $("#pause.paused img").attr("src", path);
    $("#pause.paused img").css("opacity", parseInt(game.settings.get("pause-icon", "opacity")) / 100);
});