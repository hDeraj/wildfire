/**
 * Global object to hold youtube functions.
 */
var YT = {
  /**
   * Initializes the youtube video player or resets fire.player if already created.
   * Loads the first video in fire.tracks.
   */
  createPlayer : function() {
    w = $("#vid-holder").width();
    h = $("#vid-holder").height();
    var first = fire.tracks[0];
    var playlist = fire.tracks.slice(1).join(",");
    if(fire.player){
      fire.player.loadVideoById(first);
    }else{
      fire.player = new YT.Player('player', {
        height: h,
        width: w,
        videoId: first,
        playerVars: {
          autoplay: 1,
          disablekb: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0},
        events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
        }
      });
    }
  },

  /**
   * Code to run when youtube player is done loading.
   */
  onPlayerReady : function(event) {
    event.target.playVideo();
    fire.player.loadPlaylist(fire.tracks);
  },

  /**
   * Code to run when youtube player changes state.
   */
  onPlayerStateChange : function(event) {
    var currentIndex = event.target.getPlaylistIndex();
    if (event.data == YT.PlayerState.PLAYING) {
      fire.updateCurrentIndex(currentIndex);
    }
  },

  /**
   * Stops the currently loaded video.
   */
  stopVideo : function() {
    fire.player.stopVideo();
  },

  /**
   * Starts playing the video at the given index.
   */
  updatePlayer : function(index) {
    fire.player.playVideoAt(index);
  },
};
