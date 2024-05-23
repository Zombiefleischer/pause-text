import { messages } from "./messages.js";
class PauseIconSubmenu extends FormApplication {
  constructor() {
    super({});
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      popOut: true,
      width: "550",
      height: "auto",
      template: `/modules/pause-text/templates/settings-submenu.html`,
      id: "pause-text-settings-submenu",
      title: game.i18n.format("PAUSEICON.settingsFormHeader"),
      resizable: false,
    });
  }
  activateListeners(html) {
    super.activateListeners(html);
    const saveButton = $(".pt-settings-save", html);
    saveButton[0].addEventListener("click", async function () {
      await game.settings.set("pause-text", "allSettings", {
        path: $(".pt-path", html).val(),
        opacity: Number($(".pt-opacity", html).val()),
        dimensionX: Number($(".pt-dimensionX", html).val()),
        dimensionY: Number($(".pt-dimensionY", html).val()),
        iconSpacingY: Number($(".pt-iconSpacingY", html).val()),
        allText: $(".pt-text", html).val(),
        sync: $(".pt-sync").prop("checked"),
        textChangeInterval: $(".pt-textChangeInterval", html).val(),
        fontFamily: $(".pt-fontFamily", html).val(),
        textColor: $(".pt-text-color", html).val(),
        shadow: $(".pt-shadow").prop("checked"),
        fontSize: $(".pt-font-size").val(),
        speed: $(".pt-speed").val(),
        reverse: $(".pt-reverse").prop("checked"),
      });
      window.location.reload();
    });
    const picker = $(".pt-picker-button", html);
    picker[0].addEventListener("click", async function () {
      new FilePicker({
        type: "image",
        callback: async function (imagePath) {
          $(".pt-path").val(imagePath);
        },
      }).render(true);
    });
  }
  getData() {
    let source = game.settings.get("pause-text", "allSettings");
    if (foundry.utils.isEmpty(source)) {
      source = {
        path: "icons/svg/clockwork.svg",
        opacity: 50,
        dimensionX: 128,
        dimensionY: 128,
        iconSpacingY: 0,
        allText: messages,
        sync: true,
        textChangeInterval: 0,
        fontFamily: "",
        textColor: "#EEEEEE",
        shadow: true,
        fontSize: 2,
        speed: "5",
        reverse: false,
      };
    }
    return source;
  }
  // _updateObject(event, formData) {
  //     console.log(`Alternative Pause Icon | Saving compendia sources:`);
  //     console.log(formData);
  //     //return game.settings.set("pause-text", "allSettings", formData);
  // }
}
export const registerSettings = function () {
  game.settings.register("pause-text", "allSettings", {
    scope: "world",
    config: false,
    type: Object,
    default: {
      path: "icons/svg/clockwork.svg",
      opacity: 50,
      dimensionX: 128,
      dimensionY: 128,
      iconSpacingY: 0,
      allText: messages,
      sync: true,
      textChangeInterval: 0,
      fontFamily: "",
      textColor: "#EEEEEE",
      shadow: true,
      fontSize: 2,
      speed: "5",
      reverse: false,
    },
  });
  game.settings.registerMenu("pause-text", "allSettings", {
    name: game.i18n.format("PAUSEICON.settings"),
    label: game.i18n.format("PAUSEICON.settingsButton"),
    icon: "fas fa-atlas",
    type: PauseIconSubmenu,
    restricted: true,
  });
};
