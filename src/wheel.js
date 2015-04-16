(function() {
  'use strict';

  $(document).ready(function() {

    /* jshint -W117 */
    var sliceData = data;
    /* jshint +W117 */

    console.log(sliceData);

    var numberOfBars = 360;
    var numberOfSlices = sliceData.length;

    var wheel = $('#wheel');
    var colors = [];
    var colorSeparation = numberOfBars / numberOfSlices;

    for (var i = 0; i < numberOfSlices; i++) {
      colors.push( 'hsl(' + i * ( colorSeparation ) + ', 100%, 50%)' );
    }

    var currentColor = -1;
    var bars = [];
    for (i = 0; i < numberOfBars; i++) {
      if ( i % colorSeparation === 0) {
        // New slice
        currentColor++;
      }

      var bar = $('<div></div>');
      bar.css('background-color', colors[ currentColor ] );
      bar.addClass('bar');
      bar.css('-webkit-transform', 'rotate(' + i + 'deg)');
      wheel.append(bar);
      bars.push( bar );
    }

    var angle = 0;

    var rotate = function() {
      angle += 2;
      for (var i = 0; i < numberOfBars; i++) {
        bars[i].css('-webkit-transform', 'rotate(' + ( angle + i ) + 'deg)');
      }
    };

    setInterval( rotate, 1000 / 60 );

  });

})();