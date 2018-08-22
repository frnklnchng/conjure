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

  // frequencySlider = createSlider(0, 1.0, 0.85, 0.05);
  // frequencySlider.position(2, 4096, 256);

  // playPause = createButton('Play');
  // playPause.position(10, 110);
  // playPause.mousePressed(togglePlayback());
}

function draw() {
  const volume = volumeSlider.value();
  const smooth = sensitivitySlider.value(); // Sensitivity toggle
  const waveform = 256; // Frequencies toggle
  
  background(33, 33, 36);
  // background(0, 0, 0);

  // if (audio) {
  //   console.log(audio.currentTime());
  // }

  if (audio && audio.isLoaded() && !audio.isPaused() && !audio.isPlaying()) {
    loading.classList.remove("true");

    fft = new p5.FFT(smooth, waveform);

    audio.play();
  }

  if (fft) {
    audio.setVolume(volume);
    fft.smooth(smooth);

    const spectrum = fft.analyze();
    
    noStroke(); // No outlines
    fill(0, 255, 204);

    for (let i = 0; i < waveform; i++) {
      let x = map(i, 0, waveform, 0, width);
      let y = map(spectrum[i], 0, 255, height, 0) - height;
      
      rect(x, height, width / waveform, y);

      // let r = 0;
      // let g = 200 * (i / waveform);
      // let b = y + (50 * (i / waveform));

      // fill(r, g, b);
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