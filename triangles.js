;(function($){
  var settings, self;

  function _getColor() {
    function _colorLuminance(hex, lum) {
      var colorBuffer;
      var newColor = "#";
      hex = hex.substr(1)
      for (var i = 0; i < 3; i++) {
        colorBuffer = parseInt(hex.substr(i * 2, 2), 16);
        colorBuffer = Math.round(Math.min(Math.max(0, colorBuffer + (colorBuffer * lum)), 255)).toString(16);
        newColor += ("00" + colorBuffer).substr(colorBuffer.length);
      }
      return newColor;
    };
    var actualVariance = (Math.random() * (settings.variance.max - settings.variance.min) + settings.variance.min) / 100;
    return (Math.random() * 100) < settings.density ?
      _colorLuminance(settings.color, actualVariance) :
      settings.offColor;
  };

  function _drawTriangles(x, y) {
    // Points for the triangles
    var points = [
      { x: x, y: y },
      { x: x + settings.size, y: y },
      { x: x, y: y + settings.size },
      { x: x + settings.size, y: y + settings.size }
    ];

    // point string buffers
    var topTrianglePoints = "";
    var bottomTrianglePoints = "";

    // loop over the point object creating the point strings
    for (var pointIndex = 0; pointIndex < 3; pointIndex++) {
      var reversePointIndex = 3 - pointIndex;
      topTrianglePoints += points[pointIndex].x + ',' + points[pointIndex].y + ' ';
      bottomTrianglePoints += points[reversePointIndex].x + ',' + points[reversePointIndex].y + ' ';
    }

    // create the triangle objects and add them to the palette
    for (var i = 0; i < 2; i++) {
      var triangle = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      var color = _getColor();

      // TODO check this line
      if (i % 2 === 0) { triangle.setAttributeNS(null, "stroke-width", .05) }
      triangle.setAttributeNS(null, "points", i % 2 === 0 ? topTrianglePoints : bottomTrianglePoints);
      triangle.setAttributeNS(null, "stroke", color);
      triangle.setAttributeNS(null, "stroke-linejoin", "bevel");
      triangle.setAttributeNS(null, "fill", color);
      triangle.setAttributeNS(null, "style", "transition: fill 5s, stroke 5s;");
      self.append(triangle);
    }
  }

  function _animatePalette(){
    self.children().each(function(index, triangle){
      function transitionColor(){
        var newColor = _getColor();
        triangle.setAttributeNS(null, "fill", newColor);
        triangle.setAttributeNS(null, "stroke", newColor);
      }
      setTimeout(transitionColor, (Math.random() * 4000) - 500);
      setInterval(transitionColor, 8000 + (Math.random() * 3000) - 1500);
    });
  }

  $.extend($.fn, {
    triangle: function(options){
      // global storage of this
      self = this;

      // save the settings
      settings = $.extend({
        // Base color of the drawing
        color: '#888888',
        // Off color used with density
        offColor: '#f5f5f5',
        // Size of the triangles
        size: 10,
        // Variance of the colors
        variance: {
          min: 50,
          max: 50,
        },
        // Animation Boolean
        animate: false,
        // Density of the colored triangles
        density: 50,
      }, options);

      // Get size of palette
      var paletteWidth = Math.ceil((self.width() / settings.size) * 10) / 10;
      var paletteHeight = Math.ceil((self.height() / settings.size) * 10) / 10;

      // Remove children for redraws
      self.children().remove();

      // Draw all triangles
      for (var width = 0; width < paletteWidth; width++) {
        for (var height = 0; height < paletteHeight; height++) {
          _drawTriangles(width * settings.size, height * settings.size);
        }
      }

      // Animate
      if (settings.animate) { _animatePalette() }
      return self;
    }
  })
})(window.Zepto || window.jQuery);