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
    "init":         WebAudio_init,      // WebAudio.init(callback:Function, touchs:Node|MouseEvent|TouchEvent = document.body):void
    "ready":        false,
    "getContext":   WebAudio_getContext,
};

// --- implements ------------------------------------------
function WebAudio_getContext() {
    return this["ctx"];
}

function WebAudio_init(callback, // @arg Function - callback(playableAudioContext:AudioContext|null):void
                       touchs) { // @arg Node|MouseEvent|TouchEvent = document.body - touch target HTMLElement or event
//{@dev
    if (VERIFY) {
        $valid($type(callback, "Function"),        WebAudio_init, "callback");
        $valid($type(touchs,   "Node|Event|omit"), WebAudio_init, "touchs");
    }
//}@dev

    touchs = touchs || document.body || null;

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
        if (touchs && touchs instanceof Event) {
            _playSlientSound(touchs);
        } else if (touchs && touchs instanceof Node) {
            touchs.addEventListener("touchend", _playSlientSound, true);
            touchs.addEventListener("click",    _playSlientSound, true);
        }
    } else { // Chrome, Safari, Firefox, Edge
        that["ready"] = true;
        callback(ctx);
    }

    function _playSlientSound(event) { // @arg Node|Event
        if (WebAudio["VERBOSE"]) {
            console.info("click " + event.target.tagName);
        }
        if (touchs instanceof Node) {
            touchs.removeEventListener("touchend", _playSlientSound, true);
            touchs.removeEventListener("click",    _playSlientSound, true);
        }
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

