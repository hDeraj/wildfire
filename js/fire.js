/**
 * Container for global app variables and functions.
 */
var fire = {
  grid : $('#grid'),
  tracklist : $('#tracklist'),
  player : '',
	tracks : [],
	history : [],
	currentIndex : 0,
	currentId : 0,

	/**
	 * Async search to itunes.
	 * @param bundle {
	 * 	 query : string to search for,
	 * 	 type : album or song,
	 *   id : itunes album id if type == song,
	 *   callback : callback function to call,
	 *   callbackParams : extra parameters to pass to callback,
	 * }
	 */
	$search : function(bundle){
		var url = 'https://itunes.apple.com/' +
							(bundle.type == 'album' ? 'search?' : 'lookup?') +
							(bundle.type ? '&entity=' +  bundle.type : '') +
							(bundle.query ? '&term=' + bundle.query : '') +
							(bundle.id ? '&id=' + bundle.id : '') +
							'&callback=?';
		fire.showLoading();
		$.getJSON(url, function(data) {
			data.query = bundle.query;
			bundle.callback(data, bundle.callbackParams);
			fire.stopLoading();
	  });
	},

	/**
   * Async search to youtube.
   * @param bundle {
	 * 	 query : string to search for,
	 * 	 index : position in tracklist,
	 * 	 callback : callback function to call,
	 *   callbackParams : extra parameters to pass to callback,
	 * }
	 */
	$getVideo : function(bundle){
		bundle.query = encodeURIComponent(bundle.query);
  	var url = 'http://gdata.youtube.com/feeds/api/videos/?' +
  						'q=' + bundle.query +
  						'&category=music' +
  						'&restriction=US' +
  						'&v=2' +
  						'&alt=json';
  	fire.showLoading();
  	$.getJSON(url, function(data) {
			data.query = bundle.query;
			bundle.callback(data, bundle.callbackParams);
			fire.stopLoading();
	  });
	},

	/**
	 * Updates the highlighted track when player changes.
	 * @param  {int} index
	 * @return {undefined}
	 */
	updateCurrentIndex : function(index){
		this.tracklist.children()[this.currentIndex].classList.remove('current');
		this.tracklist.children()[index].classList.add('current');
		this.currentIndex = index;
	},

	/**
	 * Shows a loading cursor (when async request is running).
	 * @return {undefined}
	 */
	showLoading : function(){
		document.body.classList.add('wait');
	},

	/**
	 * Removes loading cursor (when async request completes).
	 * @return {undefined}
	 */
	stopLoading : function(){
		document.body.classList.remove('wait');
	},

	/**
	 * Gets the value of the key in the url hash.
	 * @param  {String} key
	 * @return {String}
	 */
	getHashVar : function(key) {
		var vars = window.location.hash.split('#');
		if (vars.length == 1){
			return '';
		}
	  var b = window.location.hash.split('#')[1].split('&');
	  for(var i=0; i< b.length; i++){
	    if(b[i].split('=')[0] == key){
	      return b[i].split('=')[1];
	    }
	  }
	},

	/**
	 * Sets the value of the key in the url hash.
	 * @param {String} key
	 * @param {String} value
	 */
	setHashVar : function(key, value){
		if (fire.getHashVar(key)){
			var str = key + '=' + fire.getHashVar(key);
			var str2 = key + '=' + value;
			window.location.hash = window.location.hash.replace(str, str2);
		}else{
			window.location.hash += '&' + key + '=' + value;
		}
	},
};