import { MODULE_ID } from "./main.js";
let socket;
let pauseTextTimer = null;


// Little alias function to get the settings from Foundry
let setting = key => {
  return game.settings.get(MODULE_ID, key);
};


// Create the inital sockets and functions asociated with the socket
Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerModule("pause-text");
  socket.register("displayPauseText", displayPauseText);
  socket.register("setMessageAndBackground", setMessageAndBackground);
});


// The main function to set the Pause UI
export async function setPauseUI() {
  // Get pause status
  const pauseElement = document.getElementById("pause");

  // Return if pause is not displayed
  if (!pauseElement) { return; } else {
    // set the Image Element
    setImage(pauseElement);

    // Run once to set the message initially, since the `pauseTextTimer` only runs after the first interval has passed
    updatePauseDisplay();

    // Clear existing timer
    if (pauseTextTimer) {
      clearInterval(pauseTextTimer);
      pauseTextTimer = null;
    }
    
    // Check for the message change interval
    const changeInterval = setting("changeInterval");
    if (changeInterval <= 0) {
      updatePauseDisplay();
      return; // Everything after this gets not run
    }

    // Will not run if changeInterval <= 0
    // Runs the first time, after the interval has passed
    pauseTextTimer = setInterval(() => {
      updatePauseDisplay();
    }, changeInterval * 1000); //
    return;
  }
}



// Function to set the pause image
function setImage(pauseElement) {
  // Get the html element
  const pauseImg = pauseElement.querySelector("img");

  // Change the Pause Image
  const imgPath = setting("pauseImage") || "None";
  const imgWidth = setting("imgWidth");
  const imgHeight = setting("imgHeight");
  
  // Check if the image will be displayed
  if (imgPath === "None" || imgWidth === 0 || imgHeight === 0){
    pauseImg.hidden = true;
  } else {
    const imgOpacity = setting("imgOpacity") / 100;
    const imgRotationSpeed = setting("speedRotation");
    const imgRotationReversed = setting("reverseRotation");

    // Change the properties of the image to display it with the settings made
    pauseImg.src = imgPath;
    pauseImg.style.opacity = imgOpacity;
    pauseImg.style.width = `${imgWidth}px`;
    pauseImg.style.height = `${imgHeight}px`;
    pauseImg.style.rotate = `${setting("initRotation")}deg`;
    if (imgRotationSpeed > 0) {
      pauseImg.classList.add("fa-spin");
      pauseImg.style.cssText += `--fa-animation-duration: ${imgRotationSpeed}s`;
      if (imgRotationReversed) {
        pauseImg.style.cssText += `--fa-animation-direction: reverse`;
      }
    }
  } 
}


// Function to check if the message gets synced or not
function updatePauseDisplay() {
  // Get sync
  const syncEnabled = setting("textSync");
  
  // Get random message
  const selectedMessage = selectRandomPauseText(setting("messages"));

  if (syncEnabled) {
    socket.executeAsGM("setMessageAndBackground", true, selectedMessage);
  } else {
    setMessageAndBackground(false, selectedMessage);
  }   
}


// Function to get the random message and call the socket or not
function setMessageAndBackground(syncEnabled, selectedMessage) {

  if (syncEnabled) {
    if (game.user.isGM) {
      socket.executeForEveryone("displayPauseText", selectedMessage)
    }
  } else {
    displayPauseText(selectedMessage)
  }
}


function displayPauseText(selectedMessage) {
  
  const html = document.querySelector("#pause");

  // Get caption
  const pauseElement = document.getElementById("pause");
  const pauseText = pauseElement.querySelector("figcaption");

  // Change pause text
  pauseText.innerText = selectedMessage.replaceAll(/\\n/g, "\n");
  pauseText.style.color = setting("fontColor");
  pauseText.style.textAlign = setting("textAlign");
  pauseText.style.textTransform = setting("fontCaps");
  pauseText.style["font-size"] = `${setting("fontSize")}em`;
  pauseText.style["line-height"] = `${setting("lineHeight")}rem`;
  const fontFamily = setting("fontFamily");
  if (setting("useGoogleFont") && fontFamily) {
    loadGoogleFont(fontFamily);
  }
  pauseText.style.fontFamily = setting("fontFamily");
  pauseText.style.fontStyle = setting("fontItalic") ? "italic" : "normal";
  pauseText.style.fontWeight = setting("fontBold") ? "bold" : "normal";
  pauseText.style.fontVariant = setting("fontSmallCaps") ? "small-caps" : "normal";

  // Improve spacing with long text
  pauseText.style.maxWidth = "90%";
  pauseText.style.margin = "1rem auto 0 auto";
  pauseText.style.padding = "0 1em";
  pauseText.style["transform"] = `translateY(${setting("lineOffset")}px)`;
  
  pauseText.style.textShadow = setting("textShadow") ? "2px 2px black" : "none";


  // Change the gradient background
  const background = setting("gradientBackground");

  // Get the required settings
  const gradientColor = setting("gradientColor");
  const lineHeight = measureHeight(pauseText);
  const imgElement = pauseElement.querySelector("img");
  const verticalPos = setting("verticalPos");
  const horizontalPos = setting("horizontalPos");
  const imgHeight = !imgElement.hidden ? setting("imgHeight") : 0;

  // Set the background color
  const backgroundOpacity = setting("gradientOpacity").toString(16).padStart(2, '0');
  html.style.background = `linear-gradient(to right, transparent 0%, ${gradientColor}${backgroundOpacity} 40%, ${gradientColor}${backgroundOpacity} 60%, transparent 100%)`;


  // Set the background height
  html.style.height = `${Math.round(64 + imgHeight + lineHeight)}px`;

  // Set the vertical position
  html.style.top = `calc(${verticalPos}vh - ${100 + 0.5 * (imgHeight - 100) + 0.5 * (lineHeight - 16)}px)`;

  // Set the horizontal position
  html.style.left = `${horizontalPos - 50}vw`;

  // Check if the background will be displayed
  if (!background) {
    html.style.background = "none";
  }

  // Set animation
  if (setting("animationType") === "none") {
    html.style.animation = "none";
  } else {
    applyAnimation(html);
  }
}

// Function to apply animations to the whole pause element
function applyAnimation(html) {
  const animationType = setting("animationType");
  const duration = setting("animationDuration");

  html.style.animation = "none";

  switch (animationType) {
    case "rainbow":
      html.style.animationName = "hue-rotate";
      html.style.animationDuration = `${duration}s`;
      html.style.animationTimingFunction = "linear";
      html.style.animationIterationCount = "infinite";
      break;

    case "breath":
      html.style.animationName = "breath";
      html.style.animationDuration = `${duration}s`;
      html.style.setProperty("--breath-glow", setting("animationColor"));
      html.style.animationTimingFunction = "ease-in-out";
      html.style.animationIterationCount = "infinite";
      html.style.animationDirection = "alternate";
      break;

    case "glow":
      html.style.animationName = "glow";
      html.style.animationDuration = `${duration}s`;
      html.style.setProperty("--glow", setting("animationColor"));
      html.style.animationTimingFunction = "ease-in-out";
      html.style.animationIterationCount = "infinite";
      break;

    case "pulse":
    default:
      html.style.animationName = "pulse";
      html.style.animationDuration = `${duration}s`;
      html.style.animationTimingFunction = "ease-in-out";
      html.style.animationDelay = "0s";
      html.style.animationIterationCount = "infinite";
      html.style.animationDirection = "normal";
      html.style.animationFillMode = "none";
      html.style.animationPlayState = "running";
      html.style.animationTimeline = "auto";
      html.style.animationRangeStart = "normal";
      html.style.animationRangeEnd = "normal";
      break;
  }
}

function selectRandomPauseText(allText) {
  const lines = allText.split(/\n/);
  return lines[Math.floor(Math.random() * lines.length)];
}

function measureHeight(element) {
  // Calculate the line height to adjust for multiline text
  const clone = element.cloneNode(true);
  const computed = window.getComputedStyle(element);
  for (const prop of computed) {
    clone.style[prop] = computed.getPropertyValue(prop);
  }
  
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.animation = "none";
  clone.style.transform = "none";
  clone.style.transition = "none";
  clone.style.width = `${element.offsetWidth}px`;

  document.body.appendChild(clone);
  const height = clone.getBoundingClientRect().height;
  document.body.removeChild(clone);
  
  return height;
}

function loadGoogleFont(fontFamily) {
  const fontSlug = fontFamily.replace(/ /g, "+");
  const id = `google-font-${fontSlug}`;

  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}&display=swap`;
  document.head.appendChild(link);
}
