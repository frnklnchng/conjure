let file = document.getElementById("input")
let loading = document.getElementById("loading");
let audio;
let fft;

file.onchange = function() {
  if (this.files[0]) {
    if (audio) {
      audio.stop();
      audio.disconnect();
    }

    audio = loadSound(URL.createObjectURL(this.files[0]));
    loading.classList.add("true");
  }
}

function setup() {
  // Will only work on server
  audio = loadSound('https://github.com/frnklnchng/evoke/raw/master/assets/truth.mp3');
  loading.classList.add("true");
  
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style('display', 'block');

  const name = createDiv('evoke');
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

  // playPause = createButton('Play');
  // playPause.position(10, 110);
  // playPause.mousePressed(togglePlayback());
}

function draw() {
  const volume = volumeSlider.value();
  const smooth = -sensitivitySlider.value(); // Sensitivity toggle
  const bars = Math.pow(2, barSlider.value()); // Frequencies toggle
  const halos = Math.pow(2, haloSlider.value()); // Frequencies toggle
  // const bars = 256;
  
  background(33, 33, 36);
  // background(0, 0, 0);

  // if (audio) {
  //   console.log(audio.currentTime());
  // }

  if (audio && audio.isLoaded() && !audio.isPaused() && !audio.isPlaying()) {
    loading.classList.remove("true");

    fft = new p5.FFT(smooth, 2048);

    audio.play();
  }

  if (fft) {
    audio.setVolume(volume);
    fft.smooth(smooth);

    const spectrum = fft.analyze();

    if (bars !== 1) {
      noStroke(); // No outlines
      fill("rgba(0, 255, 204, 0.25)");
  
      for (let i = 0; i < bars; i++) {
        const w = map(i, 0, bars, 0, width);
        const h = map(spectrum[i], 0, 255, height, 0) - height;
        
        rect(w, height, width / bars, h * 0.66);
  
        // let r = 0;
        // let g = 200 * (i / bars);
        // let b = h + (50 * (i / bars));
  
        // fill(r, g, b);
      }
    }

    const bass = fft.getEnergy("bass");
    const mid = fft.getEnergy("mid");
    const treble = fft.getEnergy("treble");

    const mapBass = map(bass, 0, 255, -100, 100);
    const mapMid = map(mid, 0, 255, -150, 150);
    const mapTreble = map(treble, 0, 255, -200, 200);

    // const lowMid = fft.getEnergy("lowMid");
    // const mapLowMid = map(lowMid, 0, 255, -125, 125);
    // const radius = mapLowMid * 2;

    const combo = fft.getEnergy("bass", "lowMid");
    const mapCombo = map(combo, 0, 255, -125, 125);
    // const radius = mapCombo * 2;
    
    // let radius = Math.max(mapBass, mapTreble) * 2;
    // let radius = mapBass * 2;

    let bassRadius = mapCombo * 0.7;
    let midRadius = mapCombo * 0.7;
    let trebleRadius = mapCombo * 0.7;
    
    translate(window.innerWidth / 2, window.innerHeight / 2);
    stroke(0, 255, 204);


    for (i = 0; i < halos; i++) {
      // bassRadius = mapBass * 0.5;
      // midRadius = mapMid * 0.5;
      // trebleRadius = mapTreble * 0.5;

      rotate(4 * PI / halos);

      // Draw lines
      strokeWeight(1);

      stroke(0, 255, 204);
      line(mapBass, bassRadius * 0.75 / 2, 0, bassRadius * 0.75);

      stroke(255, 255, 255);
      line(mapMid, midRadius / 2, 0, midRadius);

      stroke(0, 255, 204);
      line(mapTreble, trebleRadius * 1.2 / 2, 0, trebleRadius * 1.2);

      // Draw points
      strokeWeight(2);
      stroke(255, 255, 255);

      point(mapBass, bassRadius * 1.5);
      point(mapMid, midRadius * 1.4);
      point(mapTreble, trebleRadius * 1.3);
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
    if (audio.isPlaying()) {
      audio.pause();
    }
    else {
      audio.play();
    }
  }
}