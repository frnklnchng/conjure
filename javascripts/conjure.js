const intensityBorder = 0.215;
const radiusMultiplier = 1;
const barsMultiplier = 0.7;

let file = document.getElementById("input")
let loading = document.getElementById("loading");
let audio;
let fft;

let newInput = false;

file.onchange = function () {
  if (this.files[0]) {
    audio.stop();
    audio.disconnect();

    audio = loadSound(URL.createObjectURL(this.files[0]));
    loading.classList.add("true");
    newInput = true;
  }
}

function setup() {
  audio = loadSound('https://raw.githubusercontent.com/frnklnchng/conjure/master/assets/truth.mp3');
  loading.classList.add("true");
  amplitude = new p5.Amplitude();

  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style('display', 'block');

  const name = createDiv('conjure');
  name.addClass('name');

  const instructions = createDiv('press the spacebar to play/pause');
  instructions.addClass('instructions');

  const volumeLabel = createDiv('volume');
  volumeLabel.addClass('volumeLabel');
  volumeLabel.addClass('label');

  const sensitivityLabel = createDiv('sensitivity');
  sensitivityLabel.addClass('sensitivityLabel');
  sensitivityLabel.addClass('label');

  const barsLabel = createDiv('bars');
  barsLabel.addClass('barsLabel');
  barsLabel.addClass('label');

  const halosLabel = createDiv('halos');
  halosLabel.addClass('halosLabel');
  halosLabel.addClass('label');

  volumeSlider = createSlider(0, 1.0, 0.5, 0.01);
  volumeSlider.addClass('volume');
  volumeSlider.addClass('slider');

  sensitivitySlider = createSlider(-0.99, 0, -0.85, 0.01);
  sensitivitySlider.addClass('sensitivity');
  sensitivitySlider.addClass('slider');

  barSlider = createSlider(0, 11, 9, 1);
  barSlider.addClass('bars');
  barSlider.addClass('slider');

  haloSlider = createSlider(3, 8, 7, 1);
  haloSlider.addClass('halos');
  haloSlider.addClass('slider');
}

function draw() {
  const volume = volumeSlider.value();
  const smooth = -sensitivitySlider.value(); // Sensitivity toggle
  const bars = Math.pow(2, barSlider.value()); // Frequencies toggle
  const halos = Math.pow(2, haloSlider.value()); // Frequencies toggle
  const intensity = amplitude.getLevel();
  // const bars = 256;

  background(33, 33, 36);
  // background(0, 0, 0);

  // if (audio) {
  //   console.log(audio.currentTime());
  // }

  if (audio && audio.isLoaded() && !audio.isPaused() && !audio.isPlaying()) {
    loading.classList.remove("true");

    fft = new p5.FFT(smooth, 2048);

    if (newInput === true) {
      audio.play();
      newInput = false;
    }
  }

  if (fft) {
    audio.setVolume(volume);
    fft.smooth(smooth);

    const spectrum = fft.analyze();

    const bass = fft.getEnergy("bass");
    // const lowMid = fft.getEnergy("lowMid");
    const mid = fft.getEnergy("mid");
    // const highMid = fft.getEnergy("highMid");
    const treble = fft.getEnergy("treble");

    const mapBass = map(bass, 0, 255, -100, 100);
    // const mapLowMid = map(lowMid, 0, 255, -125, 125);
    const mapMid = map(mid, 0, 255, -150, 150);
    // const mapHighMid = map(highMid, 0, 255, -175, 175);
    const mapTreble = map(treble, 0, 255, -200, 200);

    // const combo = fft.getEnergy("bass", "lowMid");
    // const mapCombo = map(combo, 0, 255, -125, 125);

    let bassRadius = mapBass * radiusMultiplier;
    let midRadius = mapMid * radiusMultiplier;
    let trebleRadius = mapTreble * radiusMultiplier;

    let halosColor = "rgb(0, 255, 204)";
    let barsColor = "rgba(0, 255, 204, 0.25)";

    // console.log(intensity);
    
    if (intensity > intensityBorder) {
      background(0, 0, 0);
      halosColor = "rgb(255, 0, 51)";
      barsColor = "rgba(255, 0, 51, 0.25)";
    }
    else if (intensity > intensityBorder - 0.01) {
      background(24, 24, 26);
      halosColor = "rgb(232, 23, 65)";
      barsColor = "rgba(232, 23, 65, 0.25)";
    }
    else if (intensity > intensityBorder - 0.02) {
      background(27, 27, 29);
      halosColor = "rgb(209, 46, 79)";
      barsColor = "rgba(209, 46, 79, 0.25)";
    }
    else if (intensity > intensityBorder - 0.03) {
      background(30, 30, 33);
      halosColor = "rgb(185, 70, 93)";
      barsColor = "rgba(185, 70, 93, 0.25)";
    }
    // else if (intensity > intensityBorder - 0.04) {
    //   halosColor = "rgb(162, 93, 107)";
    //   barsColor = "rgba(162, 93, 107, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.05) {
    //   halosColor = "rgb(139, 116, 121)";
    //   barsColor = "rgba(139, 116, 121, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.06) {
    //   halosColor = "rgb(116, 139, 134)";
    //   barsColor = "rgba(116, 139, 134, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.07) {
    //   halosColor = "rgb(93, 162, 148)";
    //   barsColor = "rgba(93, 162, 148, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.08) {
    //   halosColor = "rgb(70, 185, 162)";
    //   barsColor = "rgba(70, 185, 162, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.09) {
    //   halosColor = "rgb(46, 209, 176)";
    //   barsColor = "rgba(46, 209, 176, 0.25)";
    // }
    // else if (intensity > intensityBorder - 0.1) {
    //   halosColor = "rgb(23, 232, 190)";
    //   barsColor = "rgba(23, 232, 190, 0.25)";
    // }
                  
    if (bars !== 1) {
      noStroke(); // No outlines
      fill(barsColor);

      for (let i = 0; i < bars; i++) {
        const w = map(i, 0, bars, 0, width);
        const h = map(spectrum[i], 0, 255, height, 0) - height;
        const foo = map(i, 0, bars, 0, width);
        const bar = map(spectrum[i], 0, 255, height, 0) - height;
        const a = map(i, 0, bars, width, 0);
        const b = map(spectrum[i], 0, 255, 0, height);
        const x = map(i, 0, bars, width, 0);
        const y = map(spectrum[i], 0, 255, 0, height);

        rect(w, height, width / bars, h * barsMultiplier);
        rect(foo, 0, width / bars, -1 * bar * barsMultiplier);
        rect(a, height, width / bars, -1 * b * barsMultiplier);
        rect(x, 0, width / bars, y * barsMultiplier);


        // let r = 0;
        // let g = 200 * (i / bars);
        // let b = h + (50 * (i / bars));

        // fill(r, g, b);
      }
    }

    translate(window.innerWidth / 2, window.innerHeight / 2);

    for (i = 0; i < halos; i++) {
      rotate(4 * PI / halos);

      // Draw lines
      strokeWeight(1);

      stroke(halosColor);

      line(mapBass, bassRadius * 0.75 / 2, 0, bassRadius * 0.75);

      stroke(255, 255, 255);
      line(mapMid, midRadius / 2, 0, midRadius);

      stroke(halosColor);

      line(mapTreble, trebleRadius * 1.2 / 2, 0, trebleRadius * 1.2);

      // Draw points
      strokeWeight(2);
      stroke(255, 255, 255);

      point(mapBass, bassRadius * 1.5);
      point(mapMid, midRadius * 1.6);
      point(mapMid, midRadius * 1.4);
      point(mapTreble, trebleRadius * 0.9);

      // Experimental
      // point(mapBass, bassRadius * 1.6);
      // point(mapMid, midRadius * 1.7);
      // point(mapTreble, trebleRadius * 1.8);
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      togglePlayback();
      break;
    default:
      break;
  }

  return false;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function togglePlayback() {
  if (audio && audio.isLoaded()) {
    audio.isPlaying() ? audio.pause() : audio.play();
  }
}

function limit(num, min, max) {
  return num > max ? max : num < min ? min : num;
}
