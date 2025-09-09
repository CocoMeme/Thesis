# 📱 Gourd Classification Mobile App - System Workflow

This document outlines the suggested workflow for a mobile application that scans/captures images of gourds to identify if it is male/female, determine the type of gourd, estimate the harvest date, and more.

---

## 1. Mobile App (React Native Frontend)
- Built using **React Native** for cross-platform support (iOS + Android).
- Users capture gourd/flower images using the phone camera.
- Basic preprocessing (resize, normalize) can be done **on-device**.
- Images are then:
  - Sent to an **on-device ML model** (TensorFlow Lite / YOLO mobile), or
  - Uploaded to a **backend API** for heavier processing.

---

## 2. Preprocessing (OpenCV)
- **On-device**:
  - Resize, normalize, enhance brightness, denoise.
  - Crop to focus on fruit/flower region.
- **On-server**:
  - More advanced preprocessing such as segmentation and edge detection.
- Preprocessing ensures consistent image inputs for ML models.

---

## 3. Object Detection & Classification (YOLOv8/YOLOv12)
- Input: Preprocessed image.
- Output:
  - **Bounding boxes**: detect fruit/flower location.
  - **Class labels**: “male flower”, “female flower”, “gourd type A”, “gourd type B”, etc.
  - **Confidence score**: probability for each classification.
- Requires a **custom-trained YOLO model** with gourd dataset.

---

## 4. Post-Processing & Prediction (Custom ML Model)
- Additional ML modules or rules run after YOLO classification:
  - **Flower stage**: If female flower → link to potential fruit.
  - **Fruit stage**: Classify growth stage (early, mid, near harvest).
  - **Harvest prediction**: Regression/ML model trained on growth data (days from pollination → harvest).

---

## 5. Backend & Database (Optional/Hybrid)
- **Backend (Node.js/Express + MongoDB)**:
  - Stores user scans (image + classification result).
  - Tracks growth progress.
  - Provides analytics (average harvest times, statistics).
- **Offline mode**:
  - Lightweight model stored **on-device** (TensorFlow Lite integration with React Native).

---

## 6. Output to User (React Native App)
- Display results to the user:
  - Detected **gourd type**.
  - Identified as **male/female flower**.
  - If fruit detected: **growth stage** & **estimated harvest date**.
  - Optional: Save results in a **dashboard/history**.

---

## ⚡ Simplified Flow Diagram
