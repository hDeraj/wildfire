//get raw template strings
var infoBtnTemplate = $("#infoBtnTemplate").html();
var tileTemplate = $("#tileTemplate").html();
//compile the templates for mustache
Mustache.parse(infoBtnTemplate);
Mustache.parse(tileTemplate);

template = {

  /**
   * Converts an html string into a dom node.
   * @param  {String} s
   * @return {Element}
   */
  stringToElement : function(s){
    var b = $('<div></div>');
    b.html(s);
    return b.children()[0];
  },

  /**
   * The info button on a tile.
   */
  infoBtn: function(toString){
    return Mustache.render(infoBtnTemplate);
  },

  /**
   * A media tile.
   */
  tile: function(data, toString){
    console.log(data);
    s = Mustache.render(tileTemplate,
      data,
      {
        infoBtn : infoBtnTemplate
      });
    var el = template.stringToElement(s);
    el.data = data;
    return el;
  }
};
