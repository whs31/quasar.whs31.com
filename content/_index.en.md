+++
[extra]
slides = [
  {src = "/img/quasar-3.jpg",  type = "image"},
  {src = "/img/quasar-6.png",  type = "image"},
  {src = "/img/quasar-1.jpg",  type = "image"},
  {src = "/img/quasar-4.jpg",  type = "image"},
  {src = "/img/quasar-5.jpg",  type = "image"},
]

[[extra.nav_links]]
label = "Overview"
anchor = "about-the-software-and-hardware-system"

[[extra.nav_links]]
label = "Features"
anchor = "features"

[[extra.nav_links]]
label = "Platforms"
anchor = "supported-platforms"

[[extra.nav_links]]
label = "Publications"
href = "/en/publications/"
+++

## About the Software and Hardware System
**QuaSAR** is a software and hardware system consisting of a compact synthetic aperture radar station and a ground control station. The ground station controls radar operating modes, receives and processes radar data, and automatically georeferences generated radar images on a geographic basemap in real time.

The system is designed to generate **high-detail radar images** of terrain areas regardless of illumination and atmospheric conditions, including fog, cloud cover, and precipitation.

<img src="/img/complex_en.png" alt="SAR system diagram" style="width:100%" /><br />

The radar can be carried by crewed and uncrewed fixed-wing aircraft, helicopters, and multicopters with payload capacity above 2 kg.

<div class="installation-grid">
  <img src="/img/installation_1.png" alt="Radar installation on carrier 1" />
  <img src="/img/installation_2.png" alt="Radar installation on carrier 2" />
  <img src="/img/installation_3.png" alt="Radar installation on carrier 3" />
  <img src="/img/installation_4.png" alt="Radar installation on carrier 4" />
  <img src="/img/installation_5.png" alt="Radar installation on carrier 5" />
  <img src="/img/installation_6.png" alt="Radar installation on carrier 6" />
</div>

### Operating Modes

- **Spotlight mode** - the image is formed within the antenna beam. This provides maximum resolution, while the image coverage is limited to the area captured by the radar antenna beam;
- **Stripmap mode** - the image is formed continuously as the carrier moves, by stitching strips together. This mode provides wide terrain coverage throughout the route while maintaining stable detail quality;
- **Video mode** - information is transmitted as a stream assembled from individual spotlight radar image frames with temporal sampling: each frame is synthesized independently from a sliding time window of the hologram.

### The Radar Provides:
- **Radar image generation** with transmission to the ground automated workstation in real time, with latency of no more than 30 s;
- **Coordinate determination for detected objects**;
- **Automatic object detection** using a pretrained convolutional neural network, including detection that accounts for typical object placement on the terrain;
- **Integration with onboard radio-electronic equipment** over various interfaces;
- **Operation on Windows and Linux**.

## Features

### Spotlight Images

In spotlight mode, the image is formed within the antenna beam.
This provides **maximum resolution**, while the image coverage is limited to the area captured by the radar antenna beam.

![QuaSAR spotlight](/img/quasar-telescopic.png)

### Stripmap Images

The image is formed continuously as the carrier moves, by stitching strips together.
This mode provides wide terrain coverage throughout the route while maintaining stable detail quality.

![QuaSAR stripmap](/img/quasar-3.jpg)

### Video Stream
Video mode is implemented as frame-by-frame synthesis of spotlight radar images with temporal sampling: each frame is synthesized independently from a sliding time window of the hologram. The result is encoded in **H.265/HEVC** through FFmpeg with configurable quality parameters (CRF 18-28) and a frame rate of up to 120 fps.

<video src="/video/quasar-video-2.mp4" controls muted playsinline autoplay loop style="width:100%;border-radius:8px"></video>
<video src="/video/quasar-video.mp4" controls muted playsinline autoplay loop style="width:100%;border-radius:8px"></video>

### Object Recognition
The system includes an object recognition module based on the **YOLO11 OBB** neural network. Unlike standard detectors, the OBB model accounts for object rotation angle, which is critical for radar imagery.

The recognition module automatically labels objects in radar images, such as equipment, vehicles, and buildings.

![QuaSAR YOLO](/img/quasar-yolo.png)

## Supported Platforms
The software package is designed as a cross-platform solution with a focus on embedded systems and runs successfully on a wide range of devices.

##### NVIDIA Jetson Orin Family

This is the system's target platform. The project is optimized for NVIDIA modules, providing maximum performance per watt when processing radar data in field conditions. Supported modules:
- **Jetson Orin AGX**
- **Jetson Orin NX**
- **Jetson Orin Nano**

*Features*: full hardware acceleration support through NVIDIA CUDA (`sm_87`/`compute_87` architecture) and use of specialized codecs for video stream multiplexing.

##### Single-Board Computers (SBC)
Although these platforms lack hardware acceleration, efficient parallel CPU computation allows the software package to run on single-board computers such as **Raspberry Pi 4/5**.

##### Personal Computers
- **Linux (x86_64)**: the primary development and analysis environment. PCs with discrete NVIDIA GPUs using Ampere or Blackwell architectures achieve the highest radar image generation speed.

#### Platform Comparison
The comparison uses the time required to generate a stripmap radar image of a 3,000 x 4,529 m terrain area.
| Platform                          |   Mode               |   Runtime              |
| --------------------------------- | -------------------- | ---------------------- |
| **Jetson Orin AGX**               |   GPU (CUDA)         |   <span class="perf-fast">35.2 s</span>   |
| **Jetson Orin NX**                |   GPU (CUDA)         |   <span class="perf-mid">48.1 s</span>    |
| **Jetson Orin Nano**              |   GPU (CUDA)         |   <span class="perf-mid">48.3 s</span>    |
| **PC (RTX 5070, AMD Ryzen 5 7600)** | GPU (CUDA)         |   <span class="perf-fast">14.0 s</span>   |
| **PC (RTX 5070, AMD Ryzen 5 7600)** | CPU (12 threads)   |   <span class="perf-mid">39.8 s</span>    |
| **Raspberry Pi 5**                |   CPU (4 threads)    |   <span class="perf-slow">116.5 s</span>  |
