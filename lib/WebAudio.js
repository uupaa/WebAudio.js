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
    "init":         WebAudio_init,      // WebAudio.init(readyCallback:Function, target:Node|MouseEvent|TouchEvent = document.body):void
    "ready":        false,
    "getContext":   WebAudio_getContext,
};

// --- implements ------------------------------------------
function WebAudio_getContext() {
    return this["ctx"];
}

function WebAudio_init(readyCallback, // @arg Function - readyCallback(playableAudioContext:AudioContext|null):void
                       target) {      // @arg Node|MouseEvent|TouchEvent = document.body - touch target HTMLElement or event object
//{@dev
    if (VERIFY) {
        $valid($type(readyCallback, "Function"), WebAudio_init, "readyCallback");
        $valid($type(target, "Node|Event|omit"), WebAudio_init, "target");
    }
//}@dev

    target = target || document.body || null;

    var that = this;
    var ctx = that["ctx"];

    if (!ctx) { // WebAudio unsupported browser
        if (WebAudio["VERBOSE"]) {
            console.warn("Unsupported WebAudio");
        }
        readyCallback(null);
    } else if (that["ready"]) { // already
        readyCallback(ctx);
    } else if ( /iPhone|iPad|iPod/.test(navigator.userAgent) ) { // iOS Safari
        if (target && target instanceof Event) {
            _playSlientSound(target);
        } else if (target && target instanceof Node) {
            target.addEventListener("touchend", _playSlientSound, true);
            target.addEventListener("click",    _playSlientSound, true);
        }
    } else { // Chrome, Safari, Firefox, Edge
        that["ready"] = true;
        readyCallback(ctx);
    }

    function _playSlientSound(event) { // @arg Node|Event
        if (WebAudio["VERBOSE"]) {
            console.info("click " + event.target.tagName);
        }
        if (target instanceof Node) {
            target.removeEventListener("touchend", _playSlientSound, true);
            target.removeEventListener("click",    _playSlientSound, true);
        }
        var source = ctx["createBufferSource"]();

        source["buffer"] = ctx["createBuffer"](1, 1, ctx["sampleRate"]);
        if (source["start"]) {
            source["start"](0);
        } else {
            source["noteOn"](0); // [DEPRECATED][iOS 6 only]
        }
        that["ready"] = true; // iOS Safari
        readyCallback(ctx);
    }
}

return WebAudio; // return entity

});

