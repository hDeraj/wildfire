/**
 * Adds song names to back of album tile.
 * @param data
 * @param element
 */
function addMiniTrack(data, element){
  var minigrid = element.children[1];
  var p = document.createElement('p');
  var plus = document.createElement('span');
  plus.innerHTML = '+';

  p.innerHTML = data.song;
  p.appendChild(plus);
  p.setAttribute('onclick', data.onclick);
  p.data = data;
  minigrid.appendChild(p);
}

/**
 * Adds a single search result to fire.grid.
 * @param data
 */
function addSearchResult(data){
  var tile = template.tile(data);
  fire.grid.append(tile);
}

/**
 * Adds a single track to fire.tracklist.
 * @param element
 */
function addTrack(element){
  var data = element.data || element;
  var tile = template.tile(data);
  if(fire.tracks.length == 1){
    clear(fire.tracklist);
  }
  fire.tracklist.append(tile);
}

/**
 * Clears the innerHTML of an element.
 * @param element
 * @return {undefined}
 */
function clear(element){
  element.html('');
}


/**
 * Code to run when item is clicked on mini-grid.
 * @param element
 * @param event
 * @return {undefined}
 */
function onMiniClicked(element, event){
  event.stopPropagation();

  var data = element.data;
  fire.tracks.push('');
  var query = data.artist + "+" + data.trackName;
  var i = fire.tracks.length;
  fire.$getVideo({query : query,
                  callback : loadVideo,
                  callbackParams : {index : i-1},
                });

  var tile = {'artist' : data.artist,
              'song' : data.song,
              'artworkUrl' : data.artworkUrl,
              'onclickfunc' : 'YT.updatePlayer(' + (i-1) + ');'};
  addTrack(tile);

}

/**
 * Loads search results using q hash var, and album by id hash var.
 * @return {undefined}
 */
function loadFromHash(){
  if(fire.getHashVar('q')){
    search(fire.getHashVar('q'));
  }
  if(fire.getHashVar('id')){
    var id = fire.getHashVar('id');
    if(id != fire.currentId){
      search(undefined, 'song', id, loadSongResults, {id : id});
      fire.currentId = id;
    }
  }
}

/**
 * Load video from youtube search results.
 * @param data
 * @param params
 * @return {undefined}
 */
function loadVideo(data, params){
  var query = data.query;
  var index = params.index || 0;
  var videoId = data.items[0].id.videoId;
  fire.tracks[index] = videoId;
  if(index == 0){
    YT.createPlayer();
  }
  if(fire.player.loadPlaylist){
    fire.player.loadPlaylist(fire.tracks);
  }
}

/**
 * Loads search results into the minigrid supplied in params.
 * @param data
 * @param params
 * @return {undefined}
 */
function loadMiniResults(data, params){
  el = params.element;
  var len = data.results.length - 1;
  for(var i=1; i<data.results.length; i++){
    var res = data.results[i];
    trackNumber = res.trackNumber;
    var title = res.trackName;
    title = title.length > 30 ? title.slice(0,27) + '...' : title;
    var info = {
      artist : res.artistName,
      trackName : res.trackName,
      album : res.collectionName,
      albumId : res.collectionId,
      artworkUrl : res.artworkUrl100 || res.artworkUrl60,
      song : title,
      onclick : 'onMiniClicked(this, event);'
    };
    addMiniTrack(info, el);
  }
}

/**
 * Creates track tiles and loads them into tracklist.
 * @param data
 * @param params
 * @return {undefined}
 */
function loadSongResults(data, params){
  clear(fire.tracklist);
  var albumArt = data.results[0].artworkUrl100;
  var len = data.results.length - 1;
  fire.setHashVar('id', params.id);
  fire.tracks = [];
  for(var i=1; i<data.results.length; i++){
    fire.tracks.push('');
    var res = data.results[i];

    var query = res.artistName + '+' + res.trackName;
    fire.$getVideo({query : query,
                    callback : loadVideo,
                    callbackParams : {index : i-1},
                  });
    var title = res.trackNumber + ': ' + res.trackName;
    title = title.length > 30 ? title.slice(0,27) + '...' : title;
    
    var tile = {'artist' : res.artistName,
            'song' : title,
            'artworkUrl' : albumArt,
            'onclickfunc' : 'YT.updatePlayer(' + (i-1) + ');'};
    addTrack(tile);
  }
}

/**
 * Loads album search result tiles into grid.
 * @param data
 * @return {undefined}
 */
function loadAlbumResults(data){
  clear(fire.grid);
  fire.setHashVar('q', data.query);
  for(var i=0; i<data.results.length; i++){
    var res = data.results[i];
    var tile = {'artist' : res.artistName,
            'album' : res.collectionName,
            'artworkUrl' : res.artworkUrl100,
            'onclickfunc' : 'search(\'\', \'song\', ' + res.collectionId + ', loadSongResults, {id : ' + res.collectionId + '});',
            'collectionId' : res.collectionId};
    addSearchResult(tile);
  }
}

/**
 * Toggles the mini-grid panel on a search result tile.
 * Loads album's songs if not already loaded.
 * @param el
 * @param event
 * @return {undefined}
 */
function onInfoBtnClick(el, event){
  event.stopPropagation();

  var minigrid = el.parentNode.children[1];
  var overlay = el.parentNode.children[2];
  
  if(minigrid.innerHTML.trim() == ''){
    var id = el.parentNode.data.collectionId;
    fire.$search({query : '',
                  type : 'song',
                  id : id,
                  callback : loadMiniResults,
                  callbackParams : {element : el.parentNode},
                 });
  }

  if(minigrid.classList.contains('left')){
    minigrid.classList.remove('left');
    overlay.classList.remove('left');
  }else{
    minigrid.classList.add('left');
    overlay.classList.add('left');
  }
}

/**
 * Starts a search for a given term.
 * @param  {String}   term
 * @param  {String}   type
 * @param  {String || Num}   id
 * @param  {Function} callback
 * @param   callbackParams
 * @return {undefined}
 */
function search(term, type, id, callback, callbackParams){
  type = type || 'album';
  callback = callback || loadAlbumResults;
  fire.$search({query : term,
                type : type,
                id : id,
                callback : callback,
                callbackParams : callbackParams || {},
              });
}

/**
 * Toggles te left panel to slide in or out.
 * @return {undefined}
 */
function slide_left_panel(){
  var b = document.getElementById('left-panel');
  if(b.classList.contains('slideout')){
    b.classList.remove('slideout');
  }else{
    b.classList.add('slideout');
  }
}

/**
 * Binds enter key on search input field to submit a search.
 * @param e
 * @return {undefined}
 */
document.getElementById('search').onkeypress = function(e){
  e = e || window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    search(document.getElementById('search').value);
    return false;
  }
}


googleApiClientReady = function() {
  gapi.client.setApiKey('AIzaSyBnzksgj3UcjI5z0RkF8orPpG9Xy6g3J7E');
  gapi.client.load('youtube','v3', function(){
    console.log('youtube loaded');
  });
}



/**
 * Code to be run on document ready.
 * @return {undefined}
 */
$(document).ready(function() {
  window.onhashchange = loadFromHash;
  addTrack({
    album: 'Add songs from the left panel',
    artist: 'Nothing is playing'
  });

  // https://developers.google.com/youtube/iframe_api_reference
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  loadFromHash();
});
