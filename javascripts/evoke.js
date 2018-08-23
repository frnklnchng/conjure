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
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style('display', 'block');

  volumeSlider = createSlider(0, 1.0, 0.5, 0.05);
  volumeSlider.position(window.innerWidth - 141, 40);
  
  sensitivitySlider = createSlider(0, 1.0, 0.85, 0.05);
  sensitivitySlider.position(window.innerWidth - 141, 70);

  barSlider = createSlider(0, 11, 7, 1);
  barSlider.position(window.innerWidth - 141, 100);

  haloSlider = createSlider(3, 8, 7, 1);
  haloSlider.position(window.innerWidth - 141, 130);

  // playPause = createButton('Play');
  // playPause.position(10, 110);
  // playPause.mousePressed(togglePlayback());
}

function draw() {
  const volume = volumeSlider.value();
  const smooth = sensitivitySlider.value(); // Sensitivity toggle
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
  
      // const bins = Math.min();
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

    const lowMid = fft.getEnergy("lowMid");
    const mapLowMid = map(lowMid, 0, 255, -125, 125);
    const radius = mapLowMid * 2.5;
    
    // let radius = mapBass * 2;
    
    translate(window.innerWidth / 2, window.innerHeight / 2);
    stroke(0, 255, 204);


    for (i = 0; i < halos; i++) {
      rotate(4 * PI / halos);

      strokeWeight(1);

      stroke(0, 255, 204);
      line(mapBass, radius * 0.75 / 2, 0, radius * 0.75);

      stroke(255, 255, 255);
      line(mapMid, radius / 2, 0, radius);

      stroke(0, 255, 204);
      line(mapTreble, radius * 1.2 / 2, 0, radius * 1.2);

      strokeWeight(2);
      stroke(255, 255, 255);
      point(mapTreble, radius * 1.3);
      point(mapMid, radius * 1.4);
      point(mapBass, radius * 1.5);
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