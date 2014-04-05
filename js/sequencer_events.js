(function() {

    function tomaHawk(artist, title, loadCallback) {
        var track;
        console.log("hawk");
        track = window.tomahkAPI.Track(title,artist, {
            width:0,
              height:0,
              disabledResolvers: [
            "Youtube",
              "Exfm", "SpotifyMetadata"
            // options: "SoundCloud", "Officialfm", "Lastfm", "Jamendo", "Youtube", "Rdio", "SpotifyMetadata", "Deezer", "Exfm"
            ],
              handlers: {
                  onloaded: function() {
                      console.log(track.connection+":\n  api loaded");
                  },
              onended: function() {
                  console.log(track.connection+":\n  Song ended: "+track.artist+" - "+track.title);
              },
              onplayable: function() {
                  console.log(track.connection+":\n  playable");
                  loadCallback();
              },
              onresolved: function(resolver, result) {
              },
              ontimeupdate: function(timeupdate) {

              }
              }
        });
        $("body").append(track.render());
        return track;

    }
    var BPM = 120;
    var currentBeat = 4;
    var increment = 1;
    $(document).keyup(function(e) {
        if (e.keyCode == 32) {
            increment = 1-increment;
        }
    });
    function countProperties(obj) {
        var count = 0;

        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                ++count;
        }

        return count;
    }
    var completed_retreivals = 0;
    function art_callback(i, artist, title) {
        return function(art_url) {
            if (art_url.indexOf("http") != -1) {
                var stylesheet = document.styleSheets[0];
                var index = Math.pow(2, i+1);
                var selector = ".tile-" + index + " .tile-inner";
                var rule = "background-image:url('" + art_url + "') !important;";
                var rule2 = "background-size:cover !important;";
                setTimeout(function() {
                window.tomahawks[Math.pow(2, i+1)] = tomaHawk(artist, title, function() {
                    completed_retreivals += 1;
                    $("#info").text("Loaded: " + completed_retreivals + " out of 10 tracks");
                    if ((completed_retreivals) == 10) {
                        $("#info").hide();
                        window.gameManager =  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                        window.gameManager.restart();
                    }
                });
                }, i*1000);

                window.playing_hawks[Math.pow(2, i+1)] = false;

                if (stylesheet.insertRule) {
                    stylesheet.insertRule(selector + " {" + rule + "}", stylesheet.cssRules.length);
                    stylesheet.insertRule(selector + " {" + rule2 + "}", stylesheet.cssRules.length);
                } else if (stylesheet.addRule) {
                    stylesheet.addRule(selector, rule, -1);
                    stylesheet.addRule(selector, rule2, -1);
                }
            }
        }
    }

    function getTrack(i, title, artist) {
        var name = title;
        $.get("http://funandplausible.com:5118/?artist=" + artist + "&track=" + name, art_callback(i, artist, name));
    }

    $(document).ready(function() {
        var artist = "Ellie Goulding";
        window.tomahawks = {};
        window.playing_hawks = {};
        $.get("http://developer.echonest.com/api/v4/artist/songs?api_key=NODV0LSHAP8SI9WAF&name=" + artist + "&format=json&results=11&start=0", function(response) {
            var tracks = response["response"]["songs"];
            for (var i = 0; i < tracks.length; i++) {
                getTrack(i, tracks[i].title, artist);
            }
        });
    });
})();
