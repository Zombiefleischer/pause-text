import { registerSettings } from './settings.js';
Hooks.on('setup', () => {
  registerSettings();
});
Hooks.on('renderPause', function () {
  if ($('#pause').attr('class') !== 'paused') return;
  const path = game.settings.get('pause-text', 'allSettings').path;
  const opacity = game.settings.get('pause-text', 'allSettings').opacity / 100;
  const speed =
    game.settings.get('pause-text', 'allSettings').speed +
    's linear 0s infinite normal none running rotation';
  const lines = game.settings.get('pause-text', 'allSettings').text
  const text = lines[Math.floor(Math.random() * lines.length)];
  const dimensionX = game.settings.get('pause-text', 'allSettings').dimensionX;
  const dimensionY = game.settings.get('pause-text', 'allSettings').dimensionY;
  const top = `${-16 - (dimensionY - 128) / 2}px`;
  const left = `calc(50% - ${dimensionX / 2}px)`;
  const textColor = game.settings.get('pause-text', 'allSettings').textColor;
  const shadow = game.settings.get('pause-text', 'allSettings').shadow;
  const fontSize = game.settings.get('pause-text', 'allSettings').fontSize;
  const size = `${(text.length * fontSize * 90) / 12 + 70}px 100px`;
  if (path === 'None' || dimensionX === 0 || dimensionY === 0) {
    $('#pause.paused img').hide();
  } else {
    $('#pause.paused img').attr('src', path);
    $('#pause.paused img').css({
      top: top,
      left: left,
      width: dimensionX,
      height: dimensionY,
      opacity: opacity,
      '-webkit-animation': speed,
    });
  }
  $('#pause.paused h3').text(text);
  if (text.length !== 0 && shadow) {
    $('#pause.paused').css({ 'background-size': size });
    $('#pause.paused h3').css({
      color: textColor,
      'font-size': `${fontSize}em`,
    });
  } else if (text.length !== 0 && !shadow) {
    $('#pause.paused h3').css({
      color: textColor,
      'font-size': `${fontSize}em`,
    });
    $('#pause.paused h3').css({ color: textColor });
    $('#pause.paused').css('background', 'none');
  } else {
    $('#pause.paused').css('background', 'none');
  }
});
