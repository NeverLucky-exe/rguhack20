let hh, clap, bass;
let hPat, cPat, bPat;
let hPhrase, cPhrase, bPhrase;
let drums;
let bpmC;
let beatLength;
let cellWidth;
let cnv;
let sPat;
let cursor;
let bpFilter;

let sketch4 = function(z) {
  let fft;
  z.setup = function() {
    z.createCanvas(600, 240).position(900, 750);
    z.colorMode(RGB, 255);
    z.angleMode(DEGREES)
    fft = new p5.FFT(0.9, 64);
    w = z.width / 64;
  };

  z.draw = function() {
    z.background(40);
    let spectrum = fft.analyze();
    z.noStroke();
    z.translate(z.width / 2, z.height / 2)
    for (let i = 0; i < spectrum.length; i++) {
      var angle = z.map(i, 0, spectrum.length, 0, 360);
      var amp = z.map(z.log(i), 0, z.log(spectrum.length), 0, z.width);
      var r = z.map(spectrum[i], 0, 255, 20, 100);
      var x = r * z.cos(angle);
      var y = r * z.sin(angle);
      z.stroke(i, 255, 255);
      z.line(0, 0, x, y);
    }
  }
}

let myp8 = new p5(sketch4);

let sketch3 = function(r) {
  let fft;
  r.setup = function() {
    r.createCanvas(600, 240).position(900, 450);
    r.colorMode(HSB, 255);
    r.noStroke()
    // r.stroke(255);
    r.fill('white');
    fft = new p5.FFT(0.9, 64);
    w = r.width / 64;
  };

  r.draw = function() {
    r.background(40);
    let spectrum = fft.analyze();
    for (let i = 0; i < spectrum.length; i++) {
      var amp = r.map(r.log(i), 0, r.log(spectrum.length), 0, r.width);
      // var y = r.map(amp, 0, 255, r.height,0);
      var y = r.map(spectrum[i], 0, 255, r.height, 0);
      r.fill(i, 255, 255);
      r.rect(i*w, y, w - 2, r.height - y);
    }
  }
}

let myp7 = new p5(sketch3);

let sketch2 = function(q) {
  let fft;
  q.setup = function() {
    q.createCanvas(600, 240).position(200, 750);;
    q.noStroke();
    q.fill('white');
    fft = new p5.FFT();
  };

  q.draw = function() {
    q.background(40);
    let waveform = fft.waveform();
    q.noFill();
    q.beginShape();
    q.stroke(255, 0, 0); // waveform is red
    q.strokeWeight(1);
    for (var i = 0; i < waveform.length; i++) {
      let x = q.map(i, 0, waveform.length, 0, q.width);
      let y = q.map(waveform[i], -1, 1, 0, q.height);
      q.vertex(x, y);
    }
    q.endShape();
  }
}

let myp6 = new p5(sketch2);

let sketch = function(p) {
  let mrNoisy;
  let chooseNoise, setVolume;
  let fft;

  p.setup = function() {
    p.createCanvas(600, 240).position(200, 450);
    p.noStroke();
    p.fill('white');
    fft = new p5.FFT();
  };

  p.draw = function() {
    p.background(40);
    p.beginShape();
    let spectrum = fft.analyze();
    p.stroke(50, 50, 255);
    p.noFill();
    for (let i = 0; i < spectrum.length; i++) {
      let x2 = p.map(p.log(i), 0, p.log(spectrum.length), 0, p.width)
      let y2 = p.map(spectrum[i], 0, 255, p.height, 0)
      p.vertex(x2, y2);
    }
    p.endShape();
  }

  function touchStarted() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }
}

let myp5 = new p5(sketch);

function preload() {
  hh = loadSound('assets/hh_sample.mp3', () => {});
  clap = loadSound('assets/clap_sample.mp3', () => {});
  bass = loadSound('assets/bass_sample.mp3', () => {});
  kick = loadSound('assets/DF-500 Misc1.WAV', () => {});
  vocal = loadSound('assets/DF-500 Misc3.WAV', () => {});
  future = loadSound('assets/DF-500 Misc4.WAV', () => {});
  B1 = loadSound('assets/Brassloops_1_StayOnBeat.com.wav', () => {});
  B2 = loadSound('assets/Brassloops_2_StayOnBeat.com.wav', () => {});
  B3 = loadSound('assets/Brassloops_3_StayOnBeat.com.wav', () => {});
  B4 = loadSound('assets/Brassloops_4_StayOnBeat.com.wav', () => {});
}

function setup() {
  cnv = createCanvas(1300, 240);
  cnv.mousePressed(canvasPress);
  cnv.position(200, 100)

  beatLength = 32;
  cellWidth = width / beatLength;
  cursor = 0;

  hPat = [0,0,0,0,1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1];
  cPat = [0,0,0,0,1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1];
  bPat = [1,0,1,0,1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1];
  kPat = [0,1,0,1,1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1];
  vPat = [0,0,0,0,1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1];
  fPat = [0,0,0,0,1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1];
  sPat = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  resetSketch();

  let txt = createP('SouAnalyze');
  txt.position(200, 5);
  txt.style("font-family", "monospace");
  txt.style("background-color", "#FF0000");
  txt.style("color", "#FFFFFF");
  txt.style("font-size", "18pt");
  txt.style("padding", "10px");
}

function canvasPress() {
  let rowClicked = floor(6 * mouseY / height);
  let indexClicked = floor(32 * mouseX / width);
  if (rowClicked == 0) {
    hPat[indexClicked] = +!hPat[indexClicked];
  } else if (rowClicked == 1) {
    cPat[indexClicked] = +!cPat[indexClicked];
  } else if (rowClicked == 2) {
    bPat[indexClicked] = +!bPat[indexClicked];
  } else if (rowClicked == 3) {
    kPat[indexClicked] = +!kPat[indexClicked];
  } else if (rowClicked == 4) {
    vPat[indexClicked] = +!vPat[indexClicked];
  } else if (rowClicked == 5) {
    fPat[indexClicked] = +!fPat[indexClicked];
  }
  drawMatrix();
}

function drawMatrix() {
  background(30);
  stroke('gray');
  strokeWeight(2);
  fill('whiite');
  for (let i = 0; i < beatLength + 1; i++) {
    line(i * cellWidth, 0, i * cellWidth, height);
  }
  for (let i = 0; i < 7; i++) {
    line(0, i * height / 6, width, i * height / 6);
  }
  for (let i = 0; i < beatLength; i++) {
    if (hPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height / 12, 10);
    }
    if (cPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height / 4, 10);
    }
    if (bPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height * 5 / 12, 10);
    }
    if (kPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height * 7 / 12, 10);
    }
    if (vPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height * 9 / 12, 10);
    }
    if (fPat[i] == 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height * 11 / 12, 10);
    }
  }
}

function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
    stroke('red');
    fill(255, 0, 0, 30);
    rect((beatIndex - 1) * cellWidth, 0, cellWidth, height);
    if (beatIndex == 1) {
      // console.log("Im here");
    }
  }, time * 1000);
}

function resetSketch() {
  hPhrase = new p5.Phrase('hh', (time) => {
    hh.play(time);
  }, hPat);
  cPhrase = new p5.Phrase('clap', (time) => {
    clap.play(time);
  }, cPat);
  bPhrase = new p5.Phrase('bass', (time) => {
    bass.play(time);
  }, bPat);
  kPhrase = new p5.Phrase('kick', (time) => {
    kick.play(time, 1, 0.5, 0, 1);
  }, kPat);
  vPhrase = new p5.Phrase('vocal', (time) => {
    vocal.play(time, 1, 0.5, 0, 0.5);
  }, vPat);
  fPhrase = new p5.Phrase('future', (time) => {
    future.play(time, 1, 0.5, 0, 0.5);
  }, fPat);

  drums = new p5.Part();
  drums.addPhrase(hPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase(kPhrase);
  drums.addPhrase(vPhrase);
  drums.addPhrase(fPhrase);
  drums.addPhrase('seq', sequence, sPat);

  bpmC = createSlider(30, 240, 80, 1);
  bpmC.position(670, 380);
  bpmC.input(() => {
    drums.setBPM(bpmC.value())
  });
  drums.setBPM('80');

  drawMatrix();


  toggleOnOff = createButton('play').position(200, 380).style('font-family', 'courier');
  toggleOnOff.mousePressed(function() {
    if (!drums.isPlaying) {
      // drums.metro.metroTicks = 0;
      drums.loop();
      toggleOnOff.html('stop');
    } else {
      drums.stop();
      toggleOnOff.html('play');
    }
  });
  toggleOnOff1 = createButton('B1 - play').position(200, 410).style('font-family', 'courier');
  toggleOnOff1.mousePressed(function() {
    if (!B1.isLooping()) {
      B1.loop(0, 1, 0.6, 0);
      toggleOnOff1.html('B1 - stop');
    } else {
      B1.stop();
      toggleOnOff1.html('B1 - play');
    }
  });
  toggleOnOff2 = createButton('B2 - play').position(300, 410).style('font-family', 'courier');
  toggleOnOff2.mousePressed(function() {
    if (!B2.isLooping()) {
      B2.loop(0, 1, 0.6, 0);
      toggleOnOff2.html('B2 - stop');
    } else {
      B2.stop();
      toggleOnOff2.html('B2 - play');
    }
  });
  toggleOnOff3 = createButton('B3  - play').position(400, 410).style('font-family', 'courier');
  toggleOnOff3.mousePressed(function() {
    if (!B3.isLooping()) {
      B3.loop(0, 1, 0.6, 0);
      toggleOnOff3.html('B3 - stop');
    } else {
      B3.stop();
      toggleOnOff3.html('B3 - play');
    }
  });
  toggleOnOff4 = createButton('B4  - play').position(500, 410).style('font-family', 'courier');
  toggleOnOff4.mousePressed(function() {
    if (!B4.isLooping()) {
      B4.loop(0, 1, 0.6, 0);
      toggleOnOff4.html('B4 - stop');
    } else {
      B4.stop();
      toggleOnOff4.html('B4 - play');
    }
  });
}
