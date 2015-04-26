(function() {
  'use strict';

  var spinning = false;

  var slices = [];
  var numberOfSlices;

  // Static drawing information
  var size;

  var sliceArc;

  var arrowHeight;
  var outsideRadius;
  var insideRadius;

  var cX;
  var cY;

  // Dynamic drawing information
  var currentAngle = 0;
  
  // Physics
  var spinningSpeed = 180;
  var timestamp;
  var lastTimestamp;

  var wheelCanvas;
  var wheelContext;

  var bufferCanvas;
  var bufferContext;

  var bufferReady = false;

  var drawStepInterval = 1;

  var drawDriver = function() {
    if (bufferReady) {
      setTimeout(drawDriver, drawStepInterval);
    } else {
      setTimeout(calcPhysics, drawStepInterval);
    }
  };

  var calcPhysics = function() {
    timestamp = Date.now();
    if (spinning) {
      if (lastTimestamp !== undefined) {
        var diff = timestamp - lastTimestamp;
        var inc = spinningSpeed * diff / 1000;
        currentAngle += (inc * Math.PI) / 180;
        if (currentAngle > (2 * Math.PI)) {
          currentAngle -= 2 * Math.PI;
        }
      }
    }
    lastTimestamp = timestamp;

    setTimeout(drawSliceFill, drawStepInterval);
  };

  var drawSliceFill = function() {
    var ctx = bufferContext;
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    var angle;

    for (var i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;

      // Fill
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);

      ctx.fillStyle = slices[i].color;
      ctx.fill();
    }

    setTimeout(drawSliceText, drawStepInterval);
  };

  var drawSliceText = function() {
    var ctx = bufferContext;

    ctx.save();

    ctx.fillStyle = 'white';
    ctx.translate(cX, cY);

    ctx.rotate(currentAngle + sliceArc/2);

    for (var i = 0; i < numberOfSlices; i++) {
      var text = slices[i].text;
      var textWidth = ctx.measureText(text).width;
      ctx.fillText(text, outsideRadius - 25 - textWidth, 0);

      ctx.rotate(sliceArc);
    }

    ctx.restore();

    setTimeout(drawSliceStroke, drawStepInterval);
  };

  var drawSliceStroke = function() {
    var ctx = bufferContext;

    var angle;
    // Slice outlines
    for (var i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);
      ctx.stroke();
    }

    setTimeout(drawArrow, drawStepInterval);
  };

  var drawArrow = function() {
    var ctx = bufferContext;

    var size = wheelCanvas.width;
    var cX = size/2;

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

    bufferReady = true;
    setTimeout(draw, drawStepInterval);
  };

  var draw = function() {
    drawDriver();
  };

  var nonreadyBuffers = 0;

  var render = function() {
    if (bufferReady) {
      wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height); //TODO: Potential hog
      wheelContext.drawImage(bufferCanvas, 0, 0);
      bufferReady = false;
      setTimeout(render, 5);
    } else {
      nonreadyBuffers++;
      if(nonreadyBuffers < 5 || nonreadyBuffers % 20 === 0) {
        console.log('nonreadyBuffers' + nonreadyBuffers);
      }
      window.requestAnimationFrame(render);
    }
  };

  var startWheel = function() {
    spinning = true;
    console.log('Starting wheel');
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

    var colorSeparation = 360 / numberOfSlices;
    for (i = 0; i < numberOfSlices; i++) {
      slices[i].color = 'hsl(' + i * (colorSeparation) + ', 100%, 50%)';
    }

    console.log('Data is now: %o', slices);

    // Prepare Draw
    wheelCanvas = document.getElementById('wheel');
    wheelContext = wheelCanvas.getContext('2d');

    bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = wheelCanvas.width;
    bufferCanvas.height = wheelCanvas.height;
    bufferContext = bufferCanvas.getContext('2d');
    bufferContext.lineWidth = 2;
    bufferContext.font = 'bold 42px Helvetica, Arial';
    bufferContext.textAlign = 'start';
    bufferContext.textBaseline = 'middle';

    // Calculate drawing information
    size = wheelCanvas.width;

    sliceArc = Math.PI * 2 / numberOfSlices;

    arrowHeight = 30;
    outsideRadius = (size - arrowHeight)/2 - 5;
    insideRadius = 20;

    cX = size/2;
    cY = outsideRadius + arrowHeight + 2;

    if (typeof wheelCanvas.getContext === 'undefined') {
      console.error('Canvas not supported by this browser');
    } else {
      // Queue draw
      draw();
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