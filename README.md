# WMAudioUtil.js [![Build Status](https://travis-ci.org/uupaa/WMAudioUtil.js.png)](http://travis-ci.org/uupaa/WMAudioUtil.js)

[![npm](https://nodei.co/npm/uupaa.wmaudioutil.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.wmaudioutil.js/)

Audio and WebAudio utility functions.

## Document

- [WMAudioUtil.js wiki](https://github.com/uupaa/WMAudioUtil.js/wiki/WMAudioUtil)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/WMAudioUtil.js"></script>
<script>
var ctx = window.AudioContext       ? new window.AudioContext()
        : window.webkitAudioContext ? new window.webkitAudioContext() : null;
var autoPlay = WMAudioUtil.getAutoPlayFunction(ctx);


var buffer = {}; // decodedBuffer. { url: buffer, ... }
var source = {}; // AudioBufferSourceNode. { url: node ... }

function _loadAndAutoPlay(url, play) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    ctx.decodeAudioData(xhr.response, function(buffer) {
      buffer[url] = buffer;
      source[url] = ctx.createBufferSource();
      source[url].buffer = buffer;
      source[url].connect(ctx.destination);
      if (play) {
        source[url].start(0);
      }
    });
  };
  xhr.responseType = "arraybuffer";
  xhr.open("GET", url);
  xhr.send();
}

_loadAndAutoPlay("demo.m4a", true); // Auto play, supports iOS Devices.

</script>
<input type="button" value="enable auto play" onclick="autoPlay()"></input>
```


