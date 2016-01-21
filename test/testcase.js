var ModuleTestWebAudio = (function(global) {

var test = new Test(["WebAudio"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false,  // enable worker test.
        node:       false,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       false,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL || IN_WORKER || IN_NODE) {
    test.add([
    ]);
}
if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
    ]);
}
if (IN_WORKER) {
    test.add([
    ]);
}
if (IN_NODE) {
    test.add([
    ]);
}

// --- test cases ------------------------------------------
global.test1 = test1;

function test1(actx) {
    var files = [
            "../assets/aac/2.aac",
            "../assets/aac/3.aac",
            "../assets/aac/4.aac",
            "../assets/aac/5.aac",
            "../assets/aac/6.aac",
            "../assets/aac/7.aac",
            "../assets/aac/8.aac",
            "../assets/aac/9.aac",
        ];

    _loadResource(files, function(res) { // [ArrayBuffer, ...]
        var blob = new Blob(res, { type: "audio/aac" });

        _fread(blob, function(arrayBuffer) {
            actx.decodeAudioData(arrayBuffer, function(pcm) { // AudioBuffer
                console.log(pcm.duration, pcm.length, pcm.sampleRate, pcm.numberOfChannels);

                var source = actx.createBufferSource();

                source.buffer = pcm;
                source.connect(actx.destination);

                console.log("playing");
                //source.start(0);
                source.start ? source.start(0)
                             : source.noteOn(0);
            });
        });

    });
}

function _loadResource(files, callback) {
    var task = new Task("AAC loader", files.length, function(error, buffer) {
            callback(buffer);
        });

    files.forEach(function(file, index) {
        console.log(file);
        _fread(file, function(arrayBuffer, file) {
            task.buffer[index] = arrayBuffer;
            task.pass();
        });
    });
}

function _fread(source,      // @arg BlobURLString|URLString|Blob|File|TypedArray|ArrayBuffer
                callback,    // @arg Function - callback(result:ArrayBuffer, source:Any):void
                errorback) { // @arg Function = null - errorback(err:Error, source:Any):void
                             // @desc read file.
    if (source) {
        if (global["ArrayBuffer"]) {
            if (source instanceof ArrayBuffer) { // ArrayBuffer -> ArrayBuffer
                callback(source, source);
                return;
            }
            if (source["buffer"] instanceof ArrayBuffer) { // TypedArray -> ArrayBuffer
                callback(source["buffer"], source);
                return;
            }
        }
        if (IN_NW || IN_EL) {
            if (typeof source === "string" && _isLocalFile(source)) { // BlobURLString or URLString
                try {
                    var fs = require("fs");
                    var result = fs.readFileSync(source)
                    callback(new Uint8Array(result).buffer, source);
                } catch ( o__o ) {
                    if (errorback) {
                        errorback(o__o, source);
                    }
                }
                return;
            }
        }
        if (global["XMLHttpRequest"]) {
            if (typeof source === "string") { // BlobURLString or URLString -> ArrayBuffer
                var xhr = new XMLHttpRequest();

                xhr["responseType"] = "arraybuffer";
                xhr["onload"] = function() {
                    if ((IN_NW || IN_EL) && xhr.status === 0) {
                        callback(xhr["response"], source);
                    } else if (xhr.status >= 200 && xhr.status < 300) {
                        callback(xhr["response"], source);
                    } else if (errorback) {
                        errorback( new Error(xhr["statusText"] || "", source) );
                    }
                    xhr["onerror"] = null;
                    xhr["onload"] = null;
                    xhr = null;
                };
                xhr["onerror"] = function(event) {
                    errorback(event, source);
                    xhr["onerror"] = null;
                    xhr["onload"] = null;
                    xhr = null;
                };
                xhr.open("GET", source);
                xhr.send();
                return;
            }
        }
        if (global["Blob"] && global["FileReader"]) {
            if (source instanceof Blob) { // Blob or File -> ArrayBuffer

                var reader = new FileReader();

                reader["onload"] = function() {
                    callback(reader["result"], source);
                    reader["onerror"] = null;
                    reader["onload"] = null;
                    reader = null;
                };
                reader["onerror"] = function() {
                    if (errorback) {
                        errorback(reader["error"], source);
                    }
                    reader["onerror"] = null;
                    reader["onload"] = null;
                    reader = null;
                };
                reader["readAsArrayBuffer"](source);
                return;
            }
        }
    }
    throw new TypeError("Unknown source type");

    function _isLocalFile(url) {
        return !/^(https?|wss?):/.test(url);
    }
}

return test.run();

})(GLOBAL);

