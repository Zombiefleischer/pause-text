Hooks.on('init', () => {
    game.settings.register("pause-icon", "path", {
        name: game.i18n.format("PAUSEICON.path_name"),
        hint: game.i18n.format("PAUSEICON.path_hint"),
        scope: "world",
        config: true,
        default: "icons/svg/clockwork.svg",
        type: String,
    });
    game.settings.register("pause-icon", "opacity", {
        name: game.i18n.format("PAUSEICON.opacity_name"),
        hint: game.i18n.format("PAUSEICON.opacity_hint"),
        scope: "world",
        config: true,
        default: 50,
        type: Number,
    });
 });
Hooks.on("renderPause", function () {
    if($("#pause").attr("class") !== "paused") return;
	$("#pause.paused img").attr("src", game.settings.get("pause-icon", "path"));
	$("#pause.paused img").css("opacity", parseInt(game.settings.get("pause-icon", "opacity")) / 100);
});