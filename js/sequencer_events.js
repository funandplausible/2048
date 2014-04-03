(function() {
    var increment = 1;
    window.currentBeat = 0;
    console.log("defining ping");
    window.ping = function() {
        var currentRow  = Math.floor(window.currentBeat / 4) + 1;
        var currentTile = window.currentBeat % 4 + 1;
        var elem = $(".tile-position-" + currentTile + "-" + currentRow + " .tile-inner")[0];
        $(".tile-highlight").addClass("tile-highlight-out");
        $(".tile-highlight").removeClass("tile-highlight");
        console.log(currentRow + " " + currentTile);

        if (elem != null) {
            var elem = $(".tile-position-" + currentTile + "-" + currentRow + " .tile-inner");
            var tileValue = parseInt(elem.text());
            var beat = track.analysis.beats[((window.currentBeat+1) + (tileValue*4)) % track.analysis.beats.length];
            $(elem).addClass("tile-highlight");
            player.queue(beat);
            window.gain.gain.value = 1.0;
        } else {
            var elem = $(".grid-container .grid-row:nth-child(" + currentRow + ") .grid-cell:nth-child(" + currentTile + ")");
            elem.addClass("tile-highlight");
            player.queue(track.analysis.beats[window.currentBeat+1]);
            window.gain.gain.value = 0.5;
        }

        window.currentBeat = window.currentBeat % 16;
    }
})();
