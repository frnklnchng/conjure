# conjure

[Live](https://frnklnchng.github.io/conjure/)

Conjure is a dynamic audio visualizer. Conjure utilizes the JavaScript Processing library, p5.js standard, sound, and dom libraries.

This project was created within the timeframe of a week, and I fully expect to be implementing more features and improvements over time.

## Features
  * Users are able to play their own audio files, or demo the preloaded audio
  * Visual aspects can be modified through various slider inputs
  * A intuitive UI and pleasing experience allow users to start without issue
  * Press 'o' when the application is loaded for a secret song
  
### Playing local audio

<!-- ![Small audio load demo](docs/load.gif) -->

The preloaded audio can be played by pressing the spacebar, or local audio files can be loaded through the file input at the top left corner of the application.

Upon successful loading, the playback and visualization starts immediately. Loading other files while playback and visualization are occuring will stop the current audio, and load the new file.


### Dynamic Visualization

The visualization consists of frequency bars lining the top and bottom of the application and the "eye" in the center. 

<!-- ![Small visualization demo](docs/visualization.gif) -->

This was accomplished by analyzing the audio data in the p5 canvas, interpreting each frequency, and then mapping them each to a drawn component. Color is mapped to the the amplitude of the audio at any given time, and then redrawn at each frame.

```js
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
  }
```

Although numerous other libraries could have been used for this project, p5.js was ultimately chosen for its ease of use and robust processing ability.

## Design

Conjure was designed with the user experience in mind. This means a clean, clutter-free interface that anyone would enjoy using. Considering the timeframe in which the project was created, I focused primarily on the core features and the styling of these visual components and features sequentially.

## Technologies

Conjure is a project intended as a portfolio piece to be built in a relatively short timeframe. Because of this, technologies that are readily available were chosen in favor.

p5.js was chosen for its robust dom and sound libraries - used to create a consistent codebase. Readily available functions such as `map`, `analyze`, and the crucial `fft` object were paramount in analyzing and mapping audio signals to variables such as color, radius, height, and width.

<!-- ### Additional Resources
  * [Wireframe]() -->

## Possible future features
  * Smoother color intensity transitions and controls
  * More color palettes
  * SoundCloud and Spotify integration