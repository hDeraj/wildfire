template = {

  /**
	 * Converts an html string into a dom node.
	 * @param  {String} s
	 * @return {Element}
	 */
	stringToElement : function(s){
	  var b = document.createElement('div');
	  b.innerHTML = s;
	  return b.firstChild;
	},

  /**
	 * The info button on a tile.
 	 */
	infoBtn: function(toString){
		var s = '<div class="infobtn" onclick="onInfoBtnClick(this, event)">' + 
						'	 <div></div>' +
						'	 <div></div>' +
						'	 <div></div>' +
						'</div>';
		return toString ? s : this.stringToElement(s);
	},

	/**
	 * A media tile.
	 */
	tile: function(data, toString){
		artist = data.artist || 'Unknown Artist';
		song = data.song || '';
		album = data.album || data.song || '';
		artwork = data.artwork || 'null';
		onclickfunc = data.onclickfunc || "";

		var s = '<div class="tile" onclick="{{onclickfunc}}">' +
						'	 <div class="image" style="background-image: url(\'{{url}}\');">' +
						'	 </div>' +
						'	 <div class="mini-grid">' +
						'	 </div>' +
						'  <div class="overlay">' +
						'	   <h1>{{album}}</h1>' +
						'    <h2>{{artist}}</h2>' +
						'  </div>' +
						'  ' + template.infoBtn(true) +
						'</div>';
		s = s.replace('{{onclickfunc}}', onclickfunc.split('"').join('\''));
		s = s.replace('{{url}}', artwork);
		s = s.replace('{{album}}', album);
		s = s.replace('{{artist}}', artist);

		var el = this.stringToElement(s);
		el.data = data;
		return el;
	},
};