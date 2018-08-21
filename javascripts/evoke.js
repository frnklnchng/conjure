window.onload = function () {
  const audioCtx = new AudioContext();
  const audio = document.getElementById('audio');
  const source = audioCtx.createMediaElementSource(audio);

  window.onclick = function () {
    const analyser = audioCtx.createAnalyser();

    const canvas = document.getElementById("visuals");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasCtx = canvas.getContext("2d");

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    // console.log(analyser.fftSize);
    analyser.fftSize = 1024;

    const bufferSize = analyser.frequencyBinCount;
    // console.log(bufferSize);

    const audioData = new Uint8Array(bufferSize);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let barHeight;
    const barWidth = (canvasWidth / bufferSize);
    let barSpace = 0;

    const render = () => {
      analyser.getByteFrequencyData(audioData);
      requestAnimationFrame(render);

      canvasCtx.fillStyle = "rgb(33, 33, 36)";
      canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < bufferSize; i++) {
        // console.log(canvasHeight);
        barHeight = audioData[i] * Math.max(3.25, canvasHeight / 400) - 200;

        // !!!Epilepsy warning
        // let random = Math.floor(Math.random() * 511);
        // let random = 0;

        canvasCtx.fillStyle = "rgb(0, 255, 204)";
        canvasCtx.fillRect(barSpace, canvasHeight - barHeight, barWidth, barHeight);

        barSpace += barWidth + 1;
      }

      barSpace = 0;
    }

    audio.play();

    render();
  };
};
