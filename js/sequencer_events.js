(function() {
    var BPM = 120
    var currentBeat = 4;
    var increment = 1;
    $(document).keyup(function(e) {
        if (e.keyCode == 32) {
            increment = 1-increment;
        }
    });
    $(document).ready(function() {
        var sa = new SequencerPlayer(BPM);
        setInterval(function() {
            var currentRow  = Math.floor(currentBeat / 4) + 1;
            var currentTile = currentBeat % 4 + 1;
            var elem = $(".tile-position-" + currentTile + "-" + currentRow + " .tile-inner")[0];
            $(".tile-highlight").addClass("tile-highlight-out");
            $(".tile-highlight").removeClass("tile-highlight");
            console.log(currentRow + " " + currentTile);

            var value = -1;
            if (elem != null) {
                var elem = $(".tile-position-" + currentTile + "-" + currentRow + " .tile-inner");
                $(elem).addClass("tile-highlight");
                value = parseInt($(elem).text());
            } else {
                var elem = $(".grid-container .grid-row:nth-child(" + currentRow + ") .grid-cell:nth-child(" + currentTile + ")");
                elem.addClass("tile-highlight");
            }

            currentBeat += increment;
            currentBeat = currentBeat % 16;
            sa.onTick(currentBeat, value);

        }, (1000*60.0)/BPM);
    });
})();
