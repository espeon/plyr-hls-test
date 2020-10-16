document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("video");
    const source = video.getElementsByTagName("source")[0].src;
  
    // For more options see: https://github.com/sampotts/plyr/#options
    const defaultOptions = {};
  
    if (Hls.isSupported()) {
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      const hls = new Hls();
      hls.loadSource(source);
  
      // From the m3u8 playlist, hls parses the manifest and returns
      // all available video qualities. This is important, in this approach,
      // we will have one source on the Plyr player.
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0); //prepend 0 to quality array
        defaultOptions.quality = {
          default: 0, //Default - AUTO
          options: availableQualities,
          forced: true,
          onChange: (e) => updateQuality(e)
        };
        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          var span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          var span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          if (hls.autoLevelEnabled) {
            span.innerHTML = `Auto (${hls.levels[data.level].height}p)`;
          } else {
            span.innerHTML = `Auto`;
          }
        });
        var player = new Plyr(video, defaultOptions);
      });
      hls.attachMedia(video);
      window.hls = hls;
    } else {
      // default options with no quality update in case Hls is not supported
      const player = new Plyr(video, defaultOptions);
    }
  
    function updateQuality(newQuality) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
            console.log("Auto quality selection");
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }
  });