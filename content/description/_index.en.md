+++
title = "Description"
description = "Description of operating modes and capabilities of the QuaSAR software package"
template = "description.html"
+++

## Overview

**QuaSAR** is a software package for Synthetic Aperture Radar (SAR) imaging that combines the strict typing and memory safety of the Rust language with the computing power of NVIDIA CUDA parallel architectures.

The primary goal of the **QuaSAR** software package is to transform raw signals (holograms) into detailed georeferenced images or video streams.

TODO: extended description of the application domain and key tasks addressed by the package.

## Operating Modes

### Telescopic Imaging

In telescopic mode, the image is formed within the antenna beam pattern.
This achieves **maximum resolution**, but the image coverage is limited to the surface area captured by the radar's antenna beam.

![TODO: image — example telescopic frame](/img/quasar-telescopic.png)

TODO: additional description of telescopic mode use cases and operating conditions.

### Strip Imaging

The image is formed continuously as the carrier moves ("stitched" from strips).
This mode provides wide coverage of the ground surface along the entire route while maintaining stable image quality.

![TODO: image — example strip frame](/img/quasar-3.jpg)

TODO: description of strip mode use cases and typical scenarios.

### Autofocus

Due to navigation errors and turbulence, images formed using the nominal platform velocity may appear out of focus. QuaSAR implements **entropy-minimization-based autofocus**.

The algorithm iterates over several reference velocity options within a range of 60–140% of the navigation value. For each velocity value, a SAR image is formed near a pre-selected point reflector, and the sector entropy is calculated. The entropy minimum corresponds to the best focus.

![TODO: comparison of images before and after autofocus](/img/quasar-autofocus-en.png)
![TODO: entropy vs. velocity chart](/img/quasar-autofocus-chart-en.png)

### Video Stream

Video mode is implemented as frame-by-frame synthesis of telescopic SAR images with temporal sampling: each frame is independently synthesized from a sliding time window of the hologram. The result is encoded into **H.265/HEVC** using FFmpeg, with configurable quality parameters (CRF 18–28) and a frame rate of up to 120 fps.

<video src="/video/quasar-video.mp4" controls muted playsinline autoplay loop style="width:100%;border-radius:8px"></video>

TODO: description of video mode parameters and typical use cases.

## Object Detection

The software package includes an object detection module based on the **YOLO11 OBB** neural network. Unlike standard detectors, the OBB model accounts for the rotation angle of objects, which is critically important for radar imagery.

The detection module automatically labels objects (e.g., equipment, vehicles, structures) in the SAR image.

![TODO: image — object detection example](/img/quasar-yolo.png)

TODO: list of object classes and detection accuracy metrics.

## Architecture

The signal processing workflow is a multi-stage pipeline.

TODO: architecture diagram (image).

Key processing stages:
- **Signal Reading**: binary stream parsing, synchronization pulse detection, time window extraction
- **Range Compression**: short-time Fourier transform on CPU or CUDA cores
- **Navigation Parameter Calculation**: drift angle and velocity computation via Levenberg–Marquardt
- **BPA**: per-pixel 2D matched filtering (CUDA)
- **Focusing**: phase error compensation via entropy minimization
- **Visualization and Rendering**: adaptive histogram equalization, H.265 multiplexing

## Supported Platforms

| Platform | Mode | Formation Time |
|---|---|---|
| **Jetson Orin AGX** | GPU (CUDA) | <span class="perf-fast">35.2 s</span> |
| **Jetson Orin NX** | GPU (CUDA) | <span class="perf-mid">48.1 s</span> |
| **Jetson Orin Nano** | GPU (CUDA) | <span class="perf-mid">48.3 s</span> |
| **PC (RTX 5070, Ryzen 5 7600)** | GPU (CUDA) | <span class="perf-fast">14.0 s</span> |
| **PC (RTX 5070, Ryzen 5 7600)** | CPU (12 threads) | <span class="perf-mid">39.8 s</span> |
| **Raspberry Pi 5** | CPU (4 threads) | <span class="perf-slow">116.5 s</span> |

*Test: strip SAR image of a terrain area 3,000 × 4,529 m.*

## Technology Stack

The project is written in **Rust** (Edition 2024). To achieve maximum performance in signal processing, **CUDA 12** is used, integrated via C FFI.

TODO: description of key architectural decisions (multithreading, memory management, CUDA interop).
