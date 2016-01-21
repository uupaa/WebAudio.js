(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("WebAudio", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
var UserAgent = global["WebModule"]["UserAgent"];

// --- define / local variables ----------------------------
var VERIFY  = global["WebModule"]["verify"]  || false;
var VERBOSE = global["WebModule"]["verbose"] || false;

var audioContext = _initAudioContext();

// --- class / interfaces ----------------------------------
var WebAudio = {
        getContext: function() {
            return audioContext;
        }
    };

// --- implements ------------------------------------------
function _initAudioContext() { // @ret AudioContext
    var audioContext = new (global["AudioContext"] || global["webkitAudioContext"])();
    var targetNode = document.body;

    if ( /iPhone|iPad|iPod/.test(navigator.userAgent) ) {
        targetNode.addEventListener("touchstart", _playSlientSound);
        targetNode.addEventListener("touchend",   _playSlientSound);
        targetNode.addEventListener("click",      _playSlientSound);
    }
    return audioContext;

    function _playSlientSound(event) {
        if (/^(touchstart|touchend|click)$/.test(event.type)) {
            targetNode.removeEventListener("touchstart", _playSlientSound);
            targetNode.removeEventListener("touchend",   _playSlientSound);
            targetNode.removeEventListener("click",      _playSlientSound);

            var source = _createWhiteNoise(audioContext, 0.001, !VERBOSE);
//          source["connect"](audioContext["destination"]);
            source["start"] ? source["start"](0)
                            : source["noteOn"](0); // [DEPRECATED][iOS 6]
        }
    }
}

function _createWhiteNoise(audioContext, // @arg AudioContext
                           duration,     // @arg Number
                           silent) {     // @arg Boolean
                                         // @ret AudioBufferSourceNode
    var frameCount = audioContext["sampleRate"] * duration;
    var buffer = audioContext["createBuffer"](1, frameCount, audioContext["sampleRate"]);

    if (!silent) {
        var pcm = buffer["getChannelData"](0);

        for (var i = 0; i < frameCount; ++i) {
            pcm[i] = Math.random() * 2 - 1;
        }
    }
    var source = audioContext["createBufferSource"]();

    source["buffer"] = buffer;
    return source;
}

return WebAudio; // return entity

});

