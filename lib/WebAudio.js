(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("WebAudio", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {

"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var AudioContext = global["AudioContext"]       ||       // [Chrome][Firefox][Edge]
                   global["webkitAudioContext"] || null; // [iOS Safari 6+]

// --- class / interfaces ----------------------------------
var WebAudio = {
    "VERBOSE":      VERBOSE,
    "ctx":          AudioContext ? new AudioContext() : null,
    "init":         WebAudio_init,
    "ready":        false,
    "getContext":   WebAudio_getContext,
};

// --- implements ------------------------------------------
function WebAudio_getContext() {
    return this["ctx"];
}

function WebAudio_init(callback,          // @arg Function - callback(playableAudioContext:AudioContext|null):void
                       touchTargetNode) { // @arg Node = document.body
//{@dev
    $valid($type(callback,        "Function"),  WebAudio_init, "callback");
    $valid($type(touchTargetNode, "Node|omit"), WebAudio_init, "touchTargetNode");
//}@dev

    touchTargetNode = touchTargetNode || document.body;
    var that = this;

    var ctx = that["ctx"];

    if (!ctx) { // WebAudio unsupported browser
        if (WebAudio["VERBOSE"]) {
            console.warn("Unsupported WebAudio");
        }
        callback(null);
    } else if (that["ready"]) { // already
        callback(ctx);
    } else if ( /iPhone|iPad|iPod/.test(navigator.userAgent) ) { // iOS Safari
        touchTargetNode.addEventListener("touchend", _playSlientSound, true);
        touchTargetNode.addEventListener("click",    _playSlientSound, true);
    } else { // Chrome, Safari, Firefox, Edge
        that["ready"] = true;
        callback(ctx);
    }

    function _playSlientSound(event) {
        if (WebAudio["VERBOSE"]) {
            console.info("click " + event.target.tagName);
        }
        touchTargetNode.removeEventListener("touchend", _playSlientSound, true);
        touchTargetNode.removeEventListener("click",    _playSlientSound, true);

        var source = ctx["createBufferSource"]();

        source["buffer"] = ctx["createBuffer"](1, 1, ctx["sampleRate"]);
        if (source["start"]) {
            source["start"](0);
        } else {
            source["noteOn"](0); // [DEPRECATED][iOS 6 only]
        }
        that["ready"] = true; // iOS Safari
        callback(ctx);
    }
}

return WebAudio; // return entity

});

