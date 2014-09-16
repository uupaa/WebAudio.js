var ModuleTestWMAudioUtil = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;


var ASSETS_DIR = "../node_modules/uupaa.wmcachetest.js/assets/";

var ctx = global.AudioContext       ? new global.AudioContext()
        : global.webkitAudioContext ? new global.webkitAudioContext() : null;

global.autoPlayTask = null;
global.autoPlay = WMAudioUtil.getAutoPlayFunction(ctx);

var buffer = {}; // decodedBuffer. { url: buffer, ... }
var source = {}; // AudioBufferSourceNode. { url: node ... }




var test = new Test("WMAudioUtil", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     true,
        both:       false, // test the primary module and secondary module
    }).add([
        testWMAudioUtil_setup,
        testWMAudioUtil_getAutoPlayFunction,
        testWMAudioUtil_tearDown,
    ]);

test.run().clone();


function testWMAudioUtil_setup(test, pass, miss) {

    document.body.innerHTML += '<input class="autoplay" type="button" value="enable auto play" onclick="autoPlay();autoPlayTask.pass()"></input>';
    test.done(pass());
}

function testWMAudioUtil_getAutoPlayFunction(test, pass, miss) {
    global.autoPlayTask = new Task(1, function() {
        _loadAndAutoPlay(ASSETS_DIR + "game.m4a", true, 3, function() {
            test.done(pass());
        });
    });
}


function _loadAndAutoPlay(url, play, time, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    ctx.decodeAudioData(xhr.response, function(buffer) {
      buffer[url] = buffer;
      source[url] = ctx.createBufferSource();
      source[url].buffer = buffer;
      source[url].connect(ctx.destination);
      if (play) {
        source[url].start(0, 0, time);
        setTimeout(callback, time * 1000);
      }
    });
  };
  xhr.responseType = "arraybuffer";
  xhr.open("GET", url);
  xhr.send();
}


function testWMAudioUtil_tearDown(test, pass, miss) {
    var node = document.querySelector(".autoplay");
    node.parentNode.removeChild(node);

    test.done(pass());
}

})((this || 0).self || global);

