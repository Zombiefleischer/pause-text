import { MODULE_ID } from "./main.js";
import { messages } from "./messages.js";
const { DialogV2, HandlebarsApplicationMixin, ApplicationV2 } =
  foundry.applications.api;

// Register all settings in the settings menu
export function registerSettings() {
  game.settings.register(MODULE_ID, "pauseImage", {
    name: game.i18n.localize("pauseText.image.source.name"),
    hint: game.i18n.localize("pauseText.image.source.hint"),
    scope: "world",
    config: true,
    default: "icons/svg/clockwork.svg",
    type: String,
    filePicker: "image",
    requiresReload: false,
  });

  game.settings.register(MODULE_ID, "imgOpacity", {
    name: game.i18n.localize("pauseText.image.opacity.name"),
    hint: game.i18n.localize("pauseText.image.opacity.hint"),
    scope: "world",
    config: true,
    default: 50,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "imgWidth", {
    name: game.i18n.localize("pauseText.image.width.name"),
    hint: game.i18n.localize("pauseText.image.width.hint"),
    scope: "world",
    config: true,
    default: 100,
    type: Number,
  });

  game.settings.register(MODULE_ID, "imgHeight", {
    name: game.i18n.localize("pauseText.image.height.name"),
    hint: game.i18n.localize("pauseText.image.height.hint"),
    scope: "world",
    config: true,
    default: 100,
    type: Number,
  });

  game.settings.register(MODULE_ID, "initRotation", {
    name: game.i18n.localize("pauseText.image.initRotation.name"),
    hint: game.i18n.localize("pauseText.image.initRotation.hint"),
    scope: "world",
    config: true,
    default: 0,
    type: Number,
    range: {
      min: 0,
      max: 360,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "speedRotation", {
    name: game.i18n.localize("pauseText.image.speed.name"),
    hint: game.i18n.localize("pauseText.image.speed.hint"),
    scope: "world",
    config: true,
    default: "5",
    type: String,
  });

  game.settings.register(MODULE_ID, "reverseRotation", {
    name: game.i18n.localize("pauseText.image.reverse.name"),
    hint: game.i18n.localize("pauseText.image.reverse.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "verticalPos", {
    name: game.i18n.localize("pauseText.image.verticalPos.name"),
    hint: game.i18n.localize("pauseText.image.verticalPos.hint"),
    scope: "world",
    config: true,
    default: 50,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "horizontalPos", {
    name: game.i18n.localize("pauseText.image.horizontalPos.name"),
    hint: game.i18n.localize("pauseText.image.horizontalPos.hint"),
    scope: "world",
    config: true,
    default: 50,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "gradientBackground", {
    name: game.i18n.localize("pauseText.image.gradientBackground.name"),
    hint: game.i18n.localize("pauseText.image.gradientBackground.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "gradientColor", {
    name: game.i18n.localize("pauseText.image.gradientColor.name"),
    hint: game.i18n.localize("pauseText.image.gradientColor.hint"),
    scope: "world",
    config: true,
    default: "#0b0a13",
    type: String,
  });

  game.settings.register(MODULE_ID, "gradientOpacity", {
    name: game.i18n.localize("pauseText.image.gradientOpacity.name"),
    hint: game.i18n.localize("pauseText.image.gradientOpacity.hint"),
    scope: "world",
    config: true,
    default: 128,
    type: Number,
    range: {
      min: 1,
      max: 255,
      step: 1,
    },
  });

  // Create the button for the messages pop-up
  game.settings.registerMenu(MODULE_ID, "pauseMessages", {
    name: game.i18n.localize("pauseText.text.messages.name"),
    hint: game.i18n.localize("pauseText.text.messages.hint"),
    label: game.i18n.localize("pauseText.text.messages.label"),
    restricted: true,
    type: PauseMessagesSubmenu,
    icon: "fa fa-file-text",
  });

  // Create the hidden message settings value
  game.settings.register(MODULE_ID, "messages", {
    scope: "world",
    config: false,
    default: messages,
    type: String,
  });

  game.settings.register(MODULE_ID, "textSync", {
    name: game.i18n.localize("pauseText.text.textSync.name"),
    hint: game.i18n.localize("pauseText.text.textSync.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "textSelectionMode", {
    name: game.i18n.localize("pauseText.text.textSelectionMode.name"),
    hint: game.i18n.localize("pauseText.text.textSelectionMode.hint"),
    scope: "world",
    config: true,
    default: "random",
    type: String,
    choices: {
      ordered: game.i18n.localize(
        "pauseText.text.textSelectionMode.choices.ordered",
      ),
      random: game.i18n.localize(
        "pauseText.text.textSelectionMode.choices.random",
      ),
      perceivedRandom: game.i18n.localize(
        "pauseText.text.textSelectionMode.choices.perceivedRandom",
      ),
    },
  });

  game.settings.register(MODULE_ID, "changeInterval", {
    name: game.i18n.localize("pauseText.text.changeInterval.name"),
    hint: game.i18n.localize("pauseText.text.changeInterval.hint"),
    scope: "world",
    config: true,
    default: 15,
    type: Number,
  });

  game.settings.register(MODULE_ID, "textWidth", {
    name: game.i18n.localize("pauseText.text.textWidth.name"),
    hint: game.i18n.localize("pauseText.text.textWidth.hint"),
    scope: "world",
    config: true,
    default: 90,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "fontFamily", {
    name: game.i18n.localize("pauseText.text.fontFamily.name"),
    hint: game.i18n.localize("pauseText.text.fontFamily.hint"),
    scope: "world",
    config: true,
    default: "",
    type: String,
  });

  game.settings.register(MODULE_ID, "useGoogleFont", {
    name: game.i18n.localize("pauseText.text.useGoogleFont.name"),
    hint: game.i18n.localize("pauseText.text.useGoogleFont.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "fontColor", {
    name: game.i18n.localize("pauseText.text.fontColor.name"),
    hint: game.i18n.localize("pauseText.text.fontColor.hint"),
    scope: "world",
    config: true,
    default: "#ada7b8",
    type: String,
  });

  game.settings.register(MODULE_ID, "fontSize", {
    name: game.i18n.localize("pauseText.text.fontSize.name"),
    hint: game.i18n.localize("pauseText.text.fontSize.hint"),
    scope: "world",
    config: true,
    default: 2,
    type: Number,
  });

  game.settings.register(MODULE_ID, "fontBold", {
    name: game.i18n.localize("pauseText.text.fontBold.name"),
    hint: game.i18n.localize("pauseText.text.fontBold.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "fontItalic", {
    name: game.i18n.localize("pauseText.text.fontItalic.name"),
    hint: game.i18n.localize("pauseText.text.fontItalic.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "fontSmallCaps", {
    name: game.i18n.localize("pauseText.text.fontSmallCaps.name"),
    hint: game.i18n.localize("pauseText.text.fontSmallCaps.name"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "lineHeight", {
    name: game.i18n.localize("pauseText.text.lineHeight.name"),
    hint: game.i18n.localize("pauseText.text.lineHeight.hint"),
    scope: "world",
    config: true,
    default: 1,
    type: Number,
  });

  game.settings.register(MODULE_ID, "lineOffset", {
    name: game.i18n.localize("pauseText.text.lineOffset.name"),
    hint: game.i18n.localize("pauseText.text.lineOffset.hint"),
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });
    //Word & letter spacing added by KoggaJ
  game.settings.register(MODULE_ID, "letterSpacing", {
    name: game.i18n.localize("pauseText.text.letterSpacing.name"),
    hint: game.i18n.localize("pauseText.text.letterSpacing.hint"),
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });

  game.settings.register(MODULE_ID, "wordSpacing", {
    name: game.i18n.localize("pauseText.text.wordSpacing.name"),
    hint: game.i18n.localize("pauseText.text.wordSpacing.hint"),
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });  

  game.settings.register(MODULE_ID, "textShadow", {
    name: game.i18n.localize("pauseText.text.textShadow.name"),
    hint: game.i18n.localize("pauseText.text.textShadow.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "textAlign", {
    name: game.i18n.localize("pauseText.text.textAlign.name"),
    hint: game.i18n.localize("pauseText.text.textAlign.hint"),
    scope: "world",
    config: true,
    default: "center",
    type: String,
    choices: {
      center: game.i18n.localize("pauseText.text.textAlign.choices.center"),
      left: game.i18n.localize("pauseText.text.textAlign.choices.left"),
      right: game.i18n.localize("pauseText.text.textAlign.choices.right"),
    },
  });

  game.settings.register(MODULE_ID, "fontCaps", {
    name: game.i18n.localize("pauseText.text.fontCaps.name"),
    hint: game.i18n.localize("pauseText.text.fontCaps.hint"),
    scope: "world",
    config: true,
    default: "uppercase",
    type: String,
    choices: {
      none: game.i18n.localize("pauseText.text.fontCaps.choices.none"),
      capitalize: game.i18n.localize(
        "pauseText.text.fontCaps.choices.capitalize",
      ),
      uppercase: game.i18n.localize(
        "pauseText.text.fontCaps.choices.uppercase",
      ),
    },
  });

  game.settings.register(MODULE_ID, "animationType", {
    name: game.i18n.localize("pauseText.animation.animationType.name"),
    hint: game.i18n.localize("pauseText.animation.animationType.hint"),
    scope: "world",
    config: true,
    default: "pulse",
    type: String,
    choices: {
      none: game.i18n.localize(
        "pauseText.animation.animationType.choices.none",
      ),
      pulse: game.i18n.localize(
        "pauseText.animation.animationType.choices.pulse",
      ),
      rainbow: game.i18n.localize(
        "pauseText.animation.animationType.choices.rainbow",
      ),
      breath: game.i18n.localize(
        "pauseText.animation.animationType.choices.breath",
      ),
      glow: game.i18n.localize(
        "pauseText.animation.animationType.choices.glow",
      ),
    },
  });

  game.settings.register(MODULE_ID, "animationDuration", {
    name: game.i18n.localize("pauseText.animation.animationDuration.name"),
    hint: game.i18n.localize("pauseText.animation.animationDuration.hint"),
    scope: "world",
    config: true,
    default: 3,
    type: Number,
    range: {
      min: 0,
      max: 10,
      step: 1,
    },
  });

  game.settings.register(MODULE_ID, "animationColor", {
    name: game.i18n.localize("pauseText.animation.animationColor.name"),
    hint: game.i18n.localize("pauseText.animation.animationColor.hint"),
    scope: "world",
    config: true,
    default: "#ffffff",
    type: String,
  });
}

// Create the messages settings pop-up window in ApplicationV2
class PauseMessagesSubmenu extends HandlebarsApplicationMixin(ApplicationV2) {
  // Set the default options of the ApplicationV2 window
  static DEFAULT_OPTIONS = {
    id: "pause-text-messages-submenu",
    form: {
      closeOnSubmit: true,
      submitOnChange: false,
      handler: PauseMessagesSubmenu.#onSubmit,
    },
    position: {
      width: 550,
      height: 600,
    },
    tag: "form",
    window: {
      title: "pauseText.text.messages.submenuTitle",
      resizable: true,
      icon: "fa fa-file-text",
      contentClasses: ["standard-form"],
    },
    options: {
      scrollable: true,
    },
  };
  // Set the html template for the pop-up window
  static PARTS = {
    form: {
      template: "./modules/pause-text/templates/messages-submenu.html",
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };
  // Set the title of the pop-up window
  get title() {
    return `${game.i18n.format(this.options.window.title)}`;
  }

  // Prepare the content for being displayed
  async _prepareContext() {
    const messages = game.settings.get(MODULE_ID, "messages");

    return {
      messages,
      buttons: [
        {
          type: "submit",
          icon: "fa-solid fa-save",
          label: "pauseText.text.messages.saveButton",
        },
      ],
    };
  }

  // Render the content inside the window
  _onRender(context, options) {
    // console.log(context, options, this.element);
    const select = this.element.querySelector("[name=messages]");
    select.value = context.messages;
    
    // Add file import functionality
    this.#setupFileImport();
  }

  // Setup file import button and handler
  #setupFileImport() {
    const form = this.element.querySelector("form");
    const messagesField = this.element.querySelector("[name=messages]");
    
    // Create a container for the import button if it doesn't exist
    let importContainer = this.element.querySelector(".file-import-container");
    if (!importContainer) {
      importContainer = document.createElement("div");
      importContainer.className = "file-import-container";
      importContainer.style.marginBottom = "0px";
      importContainer.style.paddingTop = "10px";
      importContainer.style.display = "flex";
      importContainer.style.justifyContent = "center";
      
      // Create file input (hidden)
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".txt";
      fileInput.id = "pause-text-import";
      fileInput.style.display = "none";
      
      // Create import button
      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.className = "file-import-button";
      importButton.innerHTML = '<i class="fas fa-upload"></i> Import Text File';
      importButton.style.marginRight = "5px";
      
      // Attach file input to button click
      importButton.addEventListener("click", (e) => {
        e.preventDefault();
        fileInput.click();
      });
      
      // Handle file selection
      fileInput.addEventListener("change", (e) => {
        this.#handleFileImport(e, messagesField);
      });
      
      importContainer.appendChild(importButton);
      importContainer.appendChild(fileInput);
      
      // Insert the import button above the help text if present, otherwise above the messages field.
      const helpText = this.element.querySelector("p.hint");
      const insertPoint = helpText ?? messagesField;
      insertPoint.parentElement.insertBefore(importContainer, insertPoint);
    }
  }

  // Handle file import and read contents
  async #handleFileImport(event, messagesField) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes("text") && !file.name.endsWith(".txt")) {
      ui.notifications.error("Please select a valid .txt file");
      return;
    }
    
    try {
      const fileContent = await file.text();
      messagesField.value = fileContent;
      ui.notifications.info(`Imported ${file.name}`);
    } catch (error) {
      console.error("Error reading file:", error);
      ui.notifications.error("Error reading file. Please try again.");
    }
  }

  // Add "Save" button functionality
  static async #onSubmit(event, form, formData) {
    const messages = foundry.utils.expandObject(formData.object);
    await Promise.all(
      Object.entries(messages).map(([key, value]) =>
        game.settings.set(MODULE_ID, key, value),
      ),
    );
  }
}

// Set color picker html tag for setting
Hooks.on("renderSettingsConfig", (app, html, user) => {
  $("input[name='pause-text.fontColor']", html).replaceWith(`
    <color-picker name="pause-text.fontColor" value="${game.settings.get(MODULE_ID, "fontColor")}"></color-picker>
  `);
  $("input[name='pause-text.gradientColor']", html).replaceWith(`
    <color-picker name="pause-text.gradientColor" value="${game.settings.get(MODULE_ID, "gradientColor")}"></color-picker>
`);
  $("input[name='pause-text.animationColor']", html).replaceWith(`
    <color-picker name="pause-text.animationColor" value="${game.settings.get(MODULE_ID, "animationColor")}"></color-picker>
`);
});
