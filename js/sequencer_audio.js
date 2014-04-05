
// Trigger a function when each chunk of audio is played
// Note that this may go out of sync if the user shifts focus away from the page.
// You will need to supply your Echo Nest API key, the trackID, and a URL to the track.
// The supplied track can be found in the audio subdirectory.
var apiKey = 'NODV0LSHAP8SI9WAF';
var trackID = 'TRXOLHK13B0BC4D02B';
var trackURL = 'http://funandplausible.com/bangarang.mp3'

var remixer;
var player;
var track;
var remixed;

var beatCount = 0;

function trigger() {
    window.currentBeat += 1;
    window.currentBeat = window.currentBeat % 16;
    window.ping();
}

function init() {
    if (window.webkitAudioContext === undefined) {
        error("Sorry, this app needs advanced web audio. Your browser doesn't"
            + " support it. Try the latest version of Chrome");
    } else {
        var context = new webkitAudioContext();
        remixer = createJRemixer(context, $, apiKey);
        var effects = [];
        player = remixer.getPlayer(effects);

        window.gain = effects[0];
        $("#info").text("Loading analysis data...");

        remixer.remixTrackById(trackID, trackURL, function(t, percent) {
            track = t;

            $("#info").text(percent + "% of the track loaded");
            if (percent == 100) {
                $("#info").text(percent + "% of the track loaded, remixing...");
            }

            if (track.status == 'ok') {
                player.addOnPlayCallback(trigger);
                $("#info").text("Remix complete!");
                $("#info").hide();
                window.gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                window.gameManager.restart();
                window.ping();
            }
        });
    }
}

window.onload = init;
$(document).keyup(function(e) {
    if (e.keyCode == 32) {
        player.stop();
    }
});

