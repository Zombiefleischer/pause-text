class PauseIconSubmenu extends FormApplication {
    constructor() {
        super({});
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            width: "550",
            height: "auto",
            template: `/modules/pause-icon/templates/settings-submenu.html`,
            id: 'pause-icon-settings-submenu',
            title: 'Alternative Pause Icon Settings',
            resizable: false,
            
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        const saveButton = $(".pi-settings-save", html);
        saveButton[0].addEventListener("click", async function(){
            await game.settings.set("pause-icon", "allSettings", {
                path: $(".pi-path", html).val(),
                opacity: Number($(".pi-opacity", html).val()),
                dimensionX: Number($(".pi-dimensionX", html).val()),
                dimensionY: Number($(".pi-dimensionY", html).val()),
                text: $(".pi-text", html).val(),
                textColor: $(".pi-text-color", html).val(),
                shadow: $(".pi-shadow").prop("checked"),
                fontSize: $(".pi-font-size").val(),
                speed: $(".pi-speed").val()
            });
            window.location.reload();
        });
        const picker = $(".pi-picker-button", html);
        picker[0].addEventListener("click", async function(){
            new FilePicker({
                type: "image",
                callback: async function (imagePath) {
                  $(".pi-path").val(imagePath);
                }}).render(true);
        })
    }
    getData() {
        let source = game.settings.get("pause-icon", "allSettings");
        if (foundry.utils.isObjectEmpty(source)) {
            source = {
                path: "icons/svg/clockwork.svg",
                opacity: 50,
                dimensionX: 128,
                dimensionY: 128,
                text: game.i18n.format("GAME.Paused"),
                textColor: "#EEEEEE",
                shadow: true,
                fontSize: 2,
                speed: "5"
            };
        }
        return source;
    }
}
export const registerSettings = function () {
    game.settings.register("pause-icon", "allSettings", {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            path: "icons/svg/clockwork.svg",
            opacity: 50,
            dimensionX: 128,
            dimensionY: 128,
            text: game.i18n.format("GAME.Paused"),
            textColor: "#EEEEEE",
            shadow: true,
            fontSize: 2,
            speed: "5"
        },
    });
    game.settings.registerMenu("pause-icon", "allSettings", {
        name: game.i18n.format("PAUSEICON.settings"),
        label: game.i18n.format("PAUSEICON.settingsButton"),
        icon: 'fas fa-atlas',
        type: PauseIconSubmenu,
        restricted: true
    })
};