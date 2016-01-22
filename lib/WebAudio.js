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
var AudioContext = global["AudioContext"]       ||       // [Chrome][Firefox][Edge]
                   global["webkitAudioContext"] || null; // [iOS Safari 6+]

// --- class / interfaces ----------------------------------
var WebAudio = {
    "ctx":          AudioContext ? new AudioContext() : null,
    "init":         WebAudio_init,
    "ready":        false,
    "getContext":   WebAudio_getContext,
};

// --- implements ------------------------------------------
function WebAudio_getContext() {
    return this["ctx"];
}

function WebAudio_init(callback,          // @arg Function - callback(audioContext:AudioContext|null):void
                       touchTargetNode) { // @arg Node = document.body

    touchTargetNode = touchTargetNode || document.body;
    var ctx = this["ctx"];

    if (!ctx) { // WebAudio unsupported browser
        callback(null);
    } else if (WebAudio["ready"]) { // already
        callback(ctx);
    } else if ( /iPhone|iPad|iPod/.test(navigator.userAgent) ) { // iOS Safari
        touchTargetNode.addEventListener("touchend", _playSlientSound, true);
        touchTargetNode.addEventListener("click",    _playSlientSound, true);
    } else { // Chrome, Safari, Firefox, Edge
        WebAudio["ready"] = true;
        callback(ctx);
    }

    function _playSlientSound(event) {
        touchTargetNode.removeEventListener("touchend", _playSlientSound, true);
        touchTargetNode.removeEventListener("click",    _playSlientSound, true);

        var source = ctx["createBufferSource"]();

        source["buffer"] = ctx["createBuffer"](1, 1, ctx["sampleRate"]);
        source["start"] ? source["start"](0)
                        : source["noteOn"](0); // [DEPRECATED][iOS 6 only]

        WebAudio["ready"] = true;
        callback(ctx);
    }
}

return WebAudio; // return entity

});

