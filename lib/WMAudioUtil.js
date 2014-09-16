(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

var SILENT_M4A = [
    0,0,0,24,102,116,121,112,77,52,65,32,0,0,2,0,105,115,111,109,105,115,111,
    50,0,0,0,8,102,114,101,101,0,0,0,61,109,100,97,116,222,4,0,0,108,105,98,
    102,97,97,99,32,49,46,50,56,0,0,1,104,1,0,71,0,180,0,128,35,128,0,180,0,
    128,35,128,0,180,64,128,35,128,0,180,131,252,8,224,0,180,192,128,35,128,
    0,0,2,180,109,111,111,118,0,0,0,108,109,118,104,100,0,0,0,0,124,37,176,
    128,124,37,176,128,0,0,3,232,0,0,0,140,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,224,116,114,
    97,107,0,0,0,92,116,107,104,100,0,0,0,15,124,37,176,128,124,37,176,128,0,
    0,0,1,0,0,0,0,0,0,0,140,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,
    0,0,1,124,109,100,105,97,0,0,0,32,109,100,104,100,0,0,0,0,124,37,176,128,
    124,37,176,128,0,0,172,68,0,0,24,0,85,196,0,0,0,0,0,45,104,100,108,114,0,
    0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,
    72,97,110,100,108,101,114,0,0,0,1,39,109,105,110,102,0,0,0,16,115,109,104,
    100,0,0,0,0,0,0,0,0,0,0,0,36,100,105,110,102,0,0,0,28,100,114,101,102,0,0,
    0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1,0,0,0,235,115,116,98,108,0,0,
    0,91,115,116,115,100,0,0,0,0,0,0,0,1,0,0,0,75,109,112,52,97,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0,0,0,2,0,16,0,0,0,0,172,68,0,0,0,0,0,39,101,115,100,115,0,
    0,0,0,3,25,0,1,0,4,17,64,21,0,0,0,0,1,126,208,0,0,0,0,5,2,18,8,6,1,2,0,0,
    0,24,115,116,116,115,0,0,0,0,0,0,0,1,0,0,0,6,0,0,4,0,0,0,0,28,115,116,115,
    99,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,44,115,116,115,122,0,0,0,
    0,0,0,0,0,0,0,0,6,0,0,0,23,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,
    40,115,116,99,111,0,0,0,0,0,0,0,6,0,0,0,40,0,0,0,63,0,0,0,69,0,0,0,75,0,0,
    0,81,0,0,0,87,0,0,0,96,117,100,116,97,0,0,0,88,109,101,116,97,0,0,0,0,0,0,
    0,33,104,100,108,114,0,0,0,0,0,0,0,0,109,100,105,114,97,112,112,108,0,0,0,
    0,0,0,0,0,0,0,0,0,43,105,108,115,116,0,0,0,35,169,116,111,111,0,0,0,27,100,
    97,116,97,0,0,0,1,0,0,0,0,76,97,118,102,53,50,46,54,52,46,50];

// --- class / interfaces ----------------------------------
function WMAudioUtil() {
}

//{@dev
WMAudioUtil["repository"] = "https://github.com/uupaa/WMAudioUtil.js"; // GitHub repository URL. http://git.io/Help
//}@dev

WMAudioUtil["getAutoPlayFunction"] = WMAudioUtil_getAutoPlayFunction; // WMAudioUtil.getAutoPlayFunction(ctx:AudioContext):Function

// --- implements ------------------------------------------
function WMAudioUtil_getAutoPlayFunction(ctx) { // @arg AudioContext
                                                // @ret Function
//{@dev
    $valid($type(ctx, "AudioContext|webkitAudioContext"), WMAudioUtil_getAutoPlayFunction, "ctx");
//}@dev

    var source = ctx["createBufferSource"]();

    ctx["decodeAudioData"](new Uint8Array(SILENT_M4A).buffer, function(buffer) {
        source.buffer = buffer;
    });
    return function() {
        if (source) {
            source["start"](0);
            source["stop"](0);
          //source.buffer = null; -> throw
            source = null;
        }
    };
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = WMAudioUtil;
}
global["WMAudioUtil" in global ? "WMAudioUtil_" : "WMAudioUtil"] = WMAudioUtil; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule


