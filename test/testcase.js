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

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testWebAudio_ready,
    ]);
}

// --- test cases ------------------------------------------
function testWebAudio_ready(test, pass, miss) {
    WebAudio.init(function() {
        if (WebAudio.ready) {
            _test1( WebAudio.getContext() );
        } else {
            alert("WebAudio not function");
        }
    }, document.body);

    function _test1(audioContext) {
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

        _loadResource(files, function(buffer) { // [ArrayBuffer, ...]
            var blob = new Blob(buffer, { type: "audio/aac" });

            FileLoader.toArrayBuffer(blob, function(arrayBuffer) {
                audioContext.decodeAudioData(arrayBuffer, function(pcm) { // AudioBuffer
                    console.log(pcm.duration, pcm.length, pcm.sampleRate, pcm.numberOfChannels);

                    var source = audioContext.createBufferSource();

                    source.buffer = pcm;
                    source.connect(audioContext.destination);

                    console.log("playing");
                    //source.start(0);
                    source.start ? source.start(0)
                                 : source.noteOn(0);
                    setTimeout(function() {
                        test.done(pass());
                    }, pcm.duration * 1000);
                });
            });

        });
    }
}

function _loadResource(files, callback) {
    var task = new Task("AAC loader", files.length, function(error, buffer) {
            callback(buffer);
        });

    files.forEach(function(file, index) {
        console.log(file);
        FileLoader.toArrayBuffer(file, function(arrayBuffer, file) {
            task.buffer[index] = arrayBuffer;
            task.pass();
        });
    });
}

return test.run();

})(GLOBAL);

