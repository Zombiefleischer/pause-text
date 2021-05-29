import IconPicker from "./IconPicker.js";

export const registerSettings = function () {
    game.settings.register("pause-icon", "path", {
        name: game.i18n.format("PAUSEICON.path_name"),
        hint: game.i18n.format("PAUSEICON.path_hint"),
        scope: "world",
        config: true,
        default: "[data] icons/svg/clockwork.svg",
        type: IconPicker.Image,
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
    game.settings.register("pause-icon", "text", {
        name: game.i18n.format("PAUSEICON.text_name"),
        hint: game.i18n.format("PAUSEICON.text_hint"),
        scope: "world",
        config: true,
        default: "GAME.Paused",
        type: String,
        onChange: () => window.location.reload()
    })
};