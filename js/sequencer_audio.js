function SequencerPlayer(tempo) {
};

SequencerPlayer.prototype.onTick = function(beatNumber, tileValue) {
    console.log(beatNumber + " " + tileValue);
};

SequencerPlayer.prototype.onTempoChange(function(newTempo) {
});
