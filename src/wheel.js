(function() {
  'use strict';

  var spinning = false;

  var slices = [];
  var numberOfSlices;
  var sliceArc;
  var currentAngle = 0;

  var drawInterval = 10;
  var spinningSpeed = 90;
  var timestamp;
  var lastTimetamp;

  var wheelCanvas;
  var wheelContext;

  var bufferCanvas;
  var bufferContext;

  var bufferReady = false;

  var drawStepInterval = 1;

  var draw1 = function( ) {
    if( bufferReady ) {
      setTimeout(draw1, drawStepInterval);
    } else { // Calculate rotation
      timestamp = Date.now();
      if (spinning) {
        if (lastTimetamp !== undefined) {
          var diff = timestamp - lastTimetamp;
          var inc = spinningSpeed * diff / 1000;
          currentAngle += (inc * Math.PI) / 180;
          if (currentAngle > (2 * Math.PI)) {
            currentAngle -= 2 * Math.PI;
          }
        }
      }
      lastTimetamp = timestamp;

      setTimeout(draw2, drawStepInterval);
    }

  };

  var draw2 = function() {
    var ctx = bufferContext;
    // Draw rotation
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    ctx.lineWidth = 2;
    ctx.font = 'bold 42px Helvetica, Arial';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'middle';

    var arrowHeight = 30;
    var size = wheelCanvas.width;

    var outsideRadius = (size-arrowHeight)/2 - 5;
    var insideRadius = 20;

    var cX = size/2;
    var cY = outsideRadius + arrowHeight + 2;

    var i;
    var angle;

    // numberOfSlices = 1;

    // Slice fill and text
    for (i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;

      // Fill
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);

      ctx.fillStyle = slices[i].color;
      ctx.fill();

      // Text
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'white';
      ctx.fillStyle = 'white';
      var textAngle = angle + sliceArc/2;

      ctx.translate(cX, cY);
      ctx.rotate(textAngle);
      var text = slices[i].text;
      var textWidth = ctx.measureText(text).width;
      ctx.fillText(text, outsideRadius - 25 - textWidth, 0);
      ctx.restore();
    }


    setTimeout(draw3, drawStepInterval);
  };

  var draw3 = function() {
    var ctx = bufferContext;
    var arrowHeight = 30;
    var size = wheelCanvas.width;

    var outsideRadius = (size-arrowHeight)/2 - 5;
    var insideRadius = 20;

    var cX = size/2;
    var cY = outsideRadius + arrowHeight + 2;

    var i;
    var angle;
    // Slice outlines
    for (i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);
      ctx.stroke();
    }

    // Arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(cX - 5, 0);
    ctx.lineTo(cX + 5, 0);
    ctx.lineTo(cX + 5, 20);
    ctx.lineTo(cX + 10, 20);
    ctx.lineTo(cX, 30);
    ctx.lineTo(cX - 10, 20);
    ctx.lineTo(cX - 5, 20);
    ctx.lineTo(cX - 5, 0);
    ctx.fill();

    setTimeout(draw, drawStepInterval);
    bufferReady = true;
  };

  var draw = function() {
    draw1( bufferCanvas.getContext('2d') );

    // setTimeout(draw, drawInterval);
  };

  var nonreadyBuffers = 0;

  var render = function() {
    if( bufferReady ) {
      wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
      wheelContext.drawImage(bufferCanvas, 0, 0);
      bufferReady = false;
      setTimeout(render, 7);
    } else {
      nonreadyBuffers++;
      if( nonreadyBuffers < 5 || nonreadyBuffers % 20 == 0 ) {
        console.log('nonreadyBuffers' + nonreadyBuffers );
      }
      window.requestAnimationFrame(render);
    }
  };

  var startWheel = function() {
    spinning = true;
    console.log('Starting wheel');
  };

  var rotateWheel = function() {
    if (!spinning) {
      return;
    }

    var inc = 2;
    currentAngle += (inc * Math.PI) / 180;
    if (currentAngle > (2 * Math.PI)) {
      currentAngle -= 2 * Math.PI;
    }

    setTimeout(rotateWheel, 10);
  };

  var stopWheel = function() {
    console.log('Stopping wheel');
    spinning = false;
  };

  $(document).ready(function() {
    var i;

    /* jshint -W117 */
    if (typeof data === 'undefined') {
      console.error('No data found :<');
      //TODO: Write 'no data' to screen
      return;
    }

    console.log('Got data: %o', data);

    for (i = 0; i < data.length; i++) {
      slices.push({
        text: data[i]
      });
    }
    /* jshint +W117 */

    numberOfSlices = slices.length;
    sliceArc = Math.PI * 2 / numberOfSlices;

    var colorSeparation = 360 / numberOfSlices;
    for (i = 0; i < numberOfSlices; i++) {
      slices[i].color = 'hsl(' + i * ( colorSeparation ) + ', 100%, 50%)';
    }

    console.log('Data is now: %o', slices);

    // Prepare Draw
    wheelCanvas = document.getElementById('wheel');
    wheelContext = wheelCanvas.getContext('2d');

    bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = wheelCanvas.width;
    bufferCanvas.height = wheelCanvas.height;
    bufferContext = bufferCanvas.getContext('2d');

    if (typeof wheelCanvas.getContext === 'undefined') {
      console.error('Canvas not supported by this browser');
    } else {
      // Queue draw
      draw();
      setTimeout(draw, drawInterval);
      window.requestAnimationFrame(render);

      $('body').keyup(function(e){
        if(e.keyCode === 32){
          if (!spinning) {
            startWheel();
          } else {
            stopWheel();
          }
        }
      });
    }

  });

})();