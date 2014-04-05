
// Trigger a function when each chunk of audio is played
// Note that this may go out of sync if the user shifts focus away from the page.
// You will need to supply your Echo Nest API key, the trackID, and a URL to the track.
// The supplied track can be found in the audio subdirectory.
var apiKey = 'NODV0LSHAP8SI9WAF';

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

function analyzeAudio(audio, tag, callback) {
    var url = 'http://remix.echonest.com/Uploader/qanalyze?callback=?'
    $.getJSON(url, { url:audio, api_key:apiKey, tag:tag}, function(data) {
        if (data.status === 'done' || data.status === 'error') {
            callback(data);
        } else {
            $("#info").text(data.status + ' - ready in about ' + data.estimated_wait + ' secs. ');
            setTimeout(function() { analyzeAudio(audio, tag, callback); }, 8000);
        } 
    });
}

function init(trackID, trackURL) {
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

            window.artist = track.artist;
            window.title = track.title;

            $("#info").text(percent + "% of the track loaded");
            if (percent == 100) {
                $("#info").text(percent + "% of the track loaded, remixing...");
            }

            if (track.status == 'ok') {
                player.addOnPlayCallback(trigger);
                $("#info").text("Remix complete!");
                $("#info").hide();
                $("#expl").append('<a href="https://twitter.com/share" class="twitter-share-button" data-text="I\'m playing 2048 with \'' + window.title + '\' by \'' + window.artist + '\'" data-via="funandplausible" data-hashtags="musichackday">Tweet</a>');
                twttr.widgets.load();
                window.gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                window.gameManager.restart();
                window.ping();
            }
        });
    }
}

$(document).ready(function() {
    fetchSignature();
    console.log("hi");
    $(".restart-button").mouseup(function() {
        console.log("lols");
        $("#redirect-url").attr("value", window.location.href);
        $("input[type=file]").click();
        $("input[type=file]").change(function() {
            $("#nest").submit();
        });
    });
    var params = {};
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            var pv = q[i].split('=');
            var p = pv[0];
            var v = pv[1];
            params[p] = v;
        }
    }

    if ('key' in params) {
        // We just uploaded a track.
        // We need to log the trackID and the URL, and then redirect.
        console.log("here");
        $(".restart-button").text("Upload and play with a different song (mp3 only)");
        $("#play-remix").hide();
        $("#info").show();
        $("#info").text("Analyzing audio...");
        trackURL = 'http://' + params['bucket'] + '/' + urldecode(params['key']);

        analyzeAudio(trackURL, 'tag', function(data) {
            if (data.status === 'done') {
                var newUrl = location.protocol + "//" +  location.host + location.pathname + "?trid=" + data.trid;
                location.href = newUrl;
            }
        });
    } else if ('trid' in params) {
        $(".restart-button").text("Upload and play with a different song (mp3 only)");
        var trackID = params['trid'].replace("/", "");
        var urlXHR = getProfile(trackID, function(data) {
            if (data.status == true) {
                console.log(data);
                trackURL = data.url;
                $("#info").show();
                init(trackID, trackURL);
            } else {
                console.log("Track id error.");
            }
        });
    }
});

var playing = true;
$(document).keyup(function(e) {
    if (e.keyCode == 32) {
        if (playing) {
            player.stop();
            playing = false;
        } else {
            playing = true;
            window.ping();
            player.play();
        }
    }
});

