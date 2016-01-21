# WebAudio.js [![Build Status](https://travis-ci.org/uupaa/WebAudio.js.svg)](https://travis-ci.org/uupaa/WebAudio.js)

[![npm](https://nodei.co/npm/uupaa.webaudio.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.webaudio.js/)

Create new WebAudio context.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/WebAudio.js/wiki/)
- [API Spec](https://github.com/uupaa/WebAudio.js/wiki/WebAudio)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/WebAudio.js"></script>
<script>

var audioContext = WebAudio.getContext();

console.log( audioContext.currentTime ); // -> 0.000000000 (maybe)

</script>
```

