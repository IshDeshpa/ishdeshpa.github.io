---
title: Plants Vs. Zombies on the Tiva Launchpad
date: 2022-05-18
---

A few weeks ago, my lab partner [Luke Mason](https://www.linkedin.com/feed/#) and I finished our final project for Dr. Valvano's Embedded Systems class, and subsequently won the design competition for our class session. Our challenge was to implement a game on the Tiva Launchpad microcontroller, writing our own drivers and wiring up custom hardware. Take a look at our [GitHub repository](https://github.com/IshDeshpa/EE319H-Lab10-PvZ) to see our code. Here is our video showcasing the game's features:

https://www.youtube.com/watch?v=L5PAtDdpwP4

### Project notes:

The TM4C has 256kB of flash memory (read only for our purposes), and 32kB of SRAM. Additionally, the display, the ST7735R TFT LCD display, was 160x128p, and could support a microSD card of 4GB formatted in FAT16.

The sprites and sound effects took up almost all 256kB flash, and the in game objects took up almost all of our 32kB SRAM. In total, there were almost 100 sprites, and 7 sound effects. Each plant and zombie had animations with up to 7 sprites. For sound, we used an 8-bit DAC, and the MC34119P amplifier chip, which was paired with a 1MOhm feedback potentiometer, and a high pass filter for sound smoothing.

We implemented the eight starter plants in the game: Sunflower, Peashooter, Potato Mine, Snow Pea, Repeater, Cherry Bomb, Chomper, and Wall-nut. We also implemented eight zombies: regular zombie, conehead, buckethead, polevault, newspaper, jack-in-the-box, football, and flag zombie.

Some of the biggest challenges we ran into involved unrendering the sprites so as to not cause sprite clipping or leftover sprite data upon death. We also had to rewrite the drivers for displaying sprites to be oriented in landscape form.

Our game ran rather well with high sprite counts. This can be seen in this additional video, for anyone interested: [https://youtu.be/gowIHrNNptc](https://youtu.be/gowIHrNNptc)

Scrapped Features:

\- We were intending to implement a VS mode, which was scrapped due to lack of time.

\- We were intending to have music play during the game. However, after extensive debugging of the provided sound drivers, as well as an attempted switch to DMA, we decided that it was not worth our time to combine the display with reading music off of the microSD (Long WAV files are too big to contain in our flash memory, so you have to read it from the display microSD, which detracts from our ability to write SPI to the display's screen)

\- We were also intending to seat our diplay and controls on a PCB. Unfortunately, those were lost in delivery, so we threw together a cardboard game controller.
