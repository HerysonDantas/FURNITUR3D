# 3D Wardrobe Configurator

This project is a web-based application that allows users to interactively visualize and customize a 3D model of a wardrobe directly in their browser. Built using the Three.js library, it provides a dynamic view where users can adjust key dimensions like length, height, and width, seeing the changes reflected in real-time. It's a fun way to explore how different dimensions affect the look and structure of a simple piece of furniture.

## Features

* **Interactive 3D Visualization:** Explore the wardrobe model from any angle with smooth orbit controls.
* **Real-time Customization:** Adjust Length, Height, and Width using intuitive controls (assuming they are present in the HTML) and watch the model update instantly.
* **Dynamic Structure:** The internal layout and the number of doors automatically adapt based on the specified length.
* **Detailed Models:** Includes loaded external 3D models for elements like door handles for added realism.
* **Toggle Visibility:** Easily hide or show the doors and handles to see the internal structure.
* **Realistic Lighting & Shadows:** The scene includes basic lighting and shadows to give the model a sense of depth and presence.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* [Three.js](https://threejs.org/) (r149)
* Three.js Modules: OrbitControls, OBJLoader, MTLLoader

## How to Run

1.  Clone this repository to your local machine.
2.  Navigate to the project directory.
3.  Open the `index.html` file in your preferred web browser.

**Note:** Depending on your browser and security settings, you might need to run a simple local web server (like Python's `http.server`, Live Server VS Code extension, etc.) to correctly load the 3D model files (`.obj`, `.mtl`) and textures due to CORS restrictions.

Once open, you should see the 3D wardrobe. Use the sliders (if available in your HTML) to change its dimensions and drag your mouse/touchpad to move the camera around the model. Look for a visibility icon (likely implemented in your HTML/CSS) to hide/show the doors.