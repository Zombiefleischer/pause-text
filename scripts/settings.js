export const registerSettings = function () {
    game.settings.register("pause-icon", "path", {
        name: game.i18n.format("PAUSEICON.path_name"),
        hint: game.i18n.format("PAUSEICON.path_hint"),
        scope: "world",
        config: true,
        default: "icons/svg/clockwork.svg",
        type: String,
        filePicker: true,
        onChange: () => window.location.reload()
    });
    game.settings.register("pause-icon", "opacity", {
        name: game.i18n.format("PAUSEICON.opacity_name"),
        hint: game.i18n.format("PAUSEICON.opacity_hint"),
        scope: "world",
        config: true,
        default: 50,
        type: Number,
        onChange: () => window.location.reload()
    });
    game.settings.register("pause-icon", "dimension", {
        name: game.i18n.format("PAUSEICON.dimension_name"),
        hint: game.i18n.format("PAUSEICON.dimension_hint"),
        scope: "world",
        config: true,
        default: 128,
        type: Number,
        onChange: () => window.location.reload()
    });
    game.settings.register("pause-icon", "text", {
        name: game.i18n.format("PAUSEICON.text_name"),
        hint: game.i18n.format("PAUSEICON.text_hint"),
        scope: "world",
        config: true,
        default: game.i18n.format("GAME.Paused"),
        type: String,
        onChange: () => window.location.reload()
    });
    game.settings.register("pause-icon", "speed", {
        name: game.i18n.format("PAUSEICON.speed_name"),
        hint: game.i18n.format("PAUSEICON.speed_hint"),
        scope: "world",
        config: true,
        default: "5",
        type: Number,
        onChange: () => window.location.reload()
    });
};