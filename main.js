// Import Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/MTLLoader.js';

// Select sliders
const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const heightSlider = document.getElementById('heightSlider');

//door visibility control
let isDoorVisible = true;

// Create scene and Background Color
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xEDF2FB)



// Configuring the WebGL renderer
const renderer = new THREE.WebGLRenderer()
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true//Activate shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setPixelRatio(window.devicePixelRatio)

const containerConfigurador = document.getElementById('containerConfigurador')
const canvas = renderer.domElement
canvas.removeAttribute('style')
canvas.classList.add('canva')
containerConfigurador.appendChild(canvas)


renderer.setSize(canvas.clientWidth, canvas.clientWidth);


// Camera configuration with Orbital Control
const camera = new THREE.PerspectiveCamera(
    75, // Field of View
    canvas.clientWidth / canvas.clientHeight, // Aspect ratio inicial
    0.1, //  minimum plane crop distance
    1000 // maximum plane crop distance
)
// Initial camera position and Orbital Control

const controls = new OrbitControls(camera, canvas)
controls.listenToKeyEvents(window)
controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 1
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI


// Responsive canvas
function onWindowResize() {
    //camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientWidth);
}
window.addEventListener('resize', onWindowResize, false);


// Create part panel------------------------------------------------------------------------------------------------------------------------------------
function createPart(width, length, thickness, material, x, y, z, rotX, rotY, rotZ, name) {
    const geometryPart = new THREE.BoxGeometry(width / 1000, length / 1000, thickness / 1000) // create a panel geometry with dimentions converted from millimeters, 1 scene unit as 1000mm

    const part = new THREE.Mesh(geometryPart, material) // Create the part panel mesh and apply the material
    part.position.set(x, y, z)
    part.castShadow = true // turn on cast shadows on other objects
    part.receiveShadow = true // turn on receive shadows from other objects
    part.rotation.set(rotX, rotY, rotZ)
    part.name = name;
    if (part.material.map) { part.material.map.anisotropy = 16 }
    return part
}

// Initial Dimensions for wardrobe

let InitialLength = 1200
let InitialHeight = 1700
let InitialWidth = 450
let InitialMaterialThickness = 16
let InitialDoorThickness = 19
let InitialBackThickness = 8
let InitialFooterHeight = 100
let InitialDoorGap = 8
let InitialFooterGap = 30




/* // Creating wood material
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('assets/Wood_013_COLOR.jpg');
const roughnessMap = textureLoader.load('assets/Wood_013_ROUGH.jpg');
const normalMap = textureLoader.load('assets/Wood_013_NORM.jpg');
//main material
const material = new THREE.MeshPhysicalMaterial({
    map: woodTexture,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    roughness: 1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.8,
})  */




const material = new THREE.MeshPhysicalMaterial({
    color: 0x495057,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.8,
})

// create stardard material with assigned color
const secondaryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.8,
}) // create stardard material with assigned color

// Create wardrobe with length, height, width dimensions ------------------------------------------------------------------------------------------------

//Loading Handler

let handler

const mtlLoader = new MTLLoader();



mtlLoader.load(
    'assets/handler.mtl',
    (materials) => {
        materials.preload();
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials);
        objLoader.load(
            'assets/handler.obj',
            function (object) {
                handler = object; // Assign the loaded object to the variable
                handler.castShadow = true
                handler.receiveShadow = true
                createWardrobe(InitialLength, InitialHeight, InitialWidth, InitialMaterialThickness, InitialDoorThickness, InitialBackThickness, material, InitialFooterHeight, InitialDoorGap, InitialFooterGap)
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('An error happened while loading the OBJ model.', error);
            }
        );
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded');
    },
    (error) => {
        console.error('An error happened while loading the MTL materials.', error);
    }
);



const wardrobeGroup = new THREE.Group();
scene.add(wardrobeGroup);


function createWardrobe(length, height, width, materialThickness, doorThickness, backThickness, material, footerHeight, doorGap, footerGap) {


    const scalePositionCorrection = 0.001 //convert mm in THREE.js units

    const leftPart = createPart(width, height, materialThickness, material, -((length - materialThickness) / 2) * scalePositionCorrection, (height / 2) * scalePositionCorrection, 0, 0, Math.PI / 2, 0, "left Part")
    const rightPart = createPart(width, height, materialThickness, material, ((length - materialThickness) / 2) * scalePositionCorrection, (height / 2) * scalePositionCorrection, 0, 0, Math.PI / 2, 0, "right Part")

    const bottomPart = createPart(length - 2 * materialThickness, width, materialThickness, material, 0, (100 + (materialThickness / 2)) * scalePositionCorrection, 0, Math.PI / 2, 0, 0, "bottom Part")
    const topPart = createPart(length - 2 * materialThickness, width, materialThickness, material, 0, (height - (materialThickness / 2)) * scalePositionCorrection, 0, Math.PI / 2, 0, 0, "top Part")
    if (length <= 600) {

        const doorPart = createPart(length - doorGap, height - doorGap - footerHeight, doorThickness, secondaryMaterial, 0, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        doorPart.visible = isDoorVisible
        if (handler) {
            handler.position.set((0.5 * length - 50) * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            handler.rotation.y = -Math.PI / 2
            handler.name = "door Part"
            handler.visible = isDoorVisible
            
            wardrobeGroup.add(handler)
        }
        wardrobeGroup.add(doorPart)
    }
    else if (length > 600 && length < 900) {

        const doorPartA = createPart(0.5 * length - (1.5) * doorGap, height - doorGap - footerHeight, doorThickness, secondaryMaterial, -(0.25 * length - (1 / 3) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const doorPartB = createPart(0.5 * length - (1.5) * doorGap, height - doorGap - footerHeight, doorThickness, secondaryMaterial, (0.25 * length - (1 / 3) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        doorPartA.visible = isDoorVisible
        doorPartB.visible = isDoorVisible
        if (handler) {
            handler.position.set(-50 * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            handler.rotation.y = -Math.PI / 2
            handler.name = "door Part"
            handler.visible = isDoorVisible
            const handler2 = handler.clone()
            handler2.position.set(50 * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            wardrobeGroup.add(handler, handler2)
        }
        wardrobeGroup.add(doorPartA, doorPartB)
    }
    else if (length >= 900 && length < 1400) {
        const doorPartA = createPart(0.5 * length - (1.5) * doorGap, height - doorGap - footerHeight, doorThickness, secondaryMaterial, -(0.25 * length - (1 / 3) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const doorPartB = createPart(0.5 * length - (1.5) * doorGap, height - doorGap - footerHeight, doorThickness, secondaryMaterial, (0.25 * length - (1 / 3) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const innerSidePart = createPart(width - materialThickness, height - 2 * materialThickness - footerHeight, materialThickness, material, 0, ((height + footerHeight) / 2) * scalePositionCorrection, materialThickness * scalePositionCorrection, 0, Math.PI / 2, 0, "innerSide Part")
        const shelfPart = createPart((length - 3 * materialThickness) / 2, width - materialThickness, materialThickness, material, (((length - 3 * materialThickness) / 4) + 0.5 * materialThickness) * scalePositionCorrection, (400 + footerHeight + (materialThickness / 2)) * scalePositionCorrection, 0.5 * materialThickness * scalePositionCorrection, Math.PI / 2, 0, 0, "shelf Part")
        doorPartA.visible = isDoorVisible
        doorPartB.visible = isDoorVisible
        if (handler) {
            handler.position.set(-50 * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            handler.rotation.y = -Math.PI / 2
            handler.name = "door Part"
            handler.visible = isDoorVisible
            const handler2 = handler.clone()
            handler2.position.set(50 * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            wardrobeGroup.add(handler, handler2)
        }

        wardrobeGroup.add(doorPartA, doorPartB, innerSidePart, shelfPart)
    }

    else {
        const doorPartA = createPart((length - 4 * doorGap) / 3, height - doorGap - footerHeight, doorThickness, secondaryMaterial, -((1 / 3) * length - (1 / 4) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const doorPartB = createPart((length - 4 * doorGap) / 3, height - doorGap - footerHeight, doorThickness, secondaryMaterial, 0, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const doorPartC = createPart((length - 4 * doorGap) / 3, height - doorGap - footerHeight, doorThickness, secondaryMaterial, ((1 / 3) * length - (1 / 4) * doorGap) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, ((width + doorThickness) / 2) * scalePositionCorrection, 0, 0, 0, "door Part")
        const innerSidePart = createPart(width - materialThickness, height - 2 * materialThickness - footerHeight, materialThickness, material, (length / 6) * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, materialThickness * scalePositionCorrection, 0, Math.PI / 2, 0, "innerSide Part")
        const shelfPart = createPart(((length - 2 * materialThickness) / 3) - 0.5 * materialThickness, width - materialThickness, materialThickness, material, ((1 / 3) * length - (1 / 4) * doorGap) * scalePositionCorrection, (400 + footerHeight + (materialThickness / 2)) * scalePositionCorrection, 0.5 * materialThickness * scalePositionCorrection, Math.PI / 2, 0, 0, "shelf Part")
        doorPartA.visible = isDoorVisible
        doorPartB.visible = isDoorVisible
        doorPartC.visible = isDoorVisible


        if (handler) {
            handler.position.set(((-((1 / 3) * length - (1 / 4) * doorGap) + ((length - 4 * doorGap) / 3) * 0.5) - 50) * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)
            handler.rotation.y = -Math.PI / 2
            handler.name = "door Part"
            handler.visible = isDoorVisible

            const handler2 = handler.clone()
            handler2.position.set(-((((length - 4 * doorGap) / 3) * 0.5) - 50) * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)

            const handler3 = handler.clone()
            handler3.position.set(-((-((1 / 3) * length - (1 / 4) * doorGap) + ((length - 4 * doorGap) / 3) * 0.5) - 50) * scalePositionCorrection, (0.5 * height) * scalePositionCorrection, ((width / 2) + materialThickness) * scalePositionCorrection)

            wardrobeGroup.add(handler, handler2, handler3)
        }

        wardrobeGroup.add(doorPartA, doorPartB, doorPartC, innerSidePart, shelfPart)
    }




    const backPart = createPart(length - 2 * materialThickness, height - footerHeight - 2 * materialThickness, backThickness, secondaryMaterial, 0 * scalePositionCorrection, ((height + footerHeight) / 2) * scalePositionCorrection, -((width - backThickness) / 2) * scalePositionCorrection, 0, 0, 0, "back Part")

    const backFooterPart = createPart(length - 2 * materialThickness, footerHeight, materialThickness, material, 0, (footerHeight / 2) * scalePositionCorrection, -((width - materialThickness) / 2) * scalePositionCorrection, 0, 0, 0, "back Footer Part")
    const frontFooterPart = createPart(length - 2 * materialThickness, footerHeight, materialThickness, secondaryMaterial, 0, (footerHeight / 2) * scalePositionCorrection, ((width / 2) - footerGap) * scalePositionCorrection, 0, 0, 0, "front Footer Part")

    wardrobeGroup.add(leftPart, rightPart, bottomPart, topPart, backFooterPart, frontFooterPart, backPart)
    return scene.add(wardrobeGroup)

}




function updateWardrobe() {
    const newWidth = parseInt(widthSlider.value, 10);
    const newLength = parseInt(lengthSlider.value, 10);
    const newHeight = parseInt(heightSlider.value, 10);

    // Remove old wardrobe
    wardrobeGroup.clear()
    //camera.position.set(camera.position.x, (newHeight) / 1000, camera.position.z)
    controls.target.set(0, (newHeight) / (2 * 1000), 0)

    // create the new wardrobe updated
    createWardrobe(newLength, newHeight, newWidth, InitialMaterialThickness, InitialDoorThickness, InitialBackThickness, material, InitialFooterHeight, InitialDoorGap, InitialFooterGap);

}


//Create Floor

const geometryFloor = new THREE.CircleGeometry(8, 32) // Plane geometry dimensions
const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.1,
});
const floor = new THREE.Mesh(geometryFloor, floorMaterial) // Create plane mesh and apply the material
floor.castShadow = true // turn off cast shadows on other objects
floor.receiveShadow = true //  turn on receive shadows from other objects
floor.position.set(0, 0, 0)
floor.rotation.set(-Math.PI / 2, 0, 0)
scene.add(floor)





//Listener to the slide inputs and update of the new wardrobe
widthSlider.addEventListener('input', updateWardrobe);
lengthSlider.addEventListener('input', updateWardrobe);
heightSlider.addEventListener('input', updateWardrobe);

//light setup
const hemisphereLight = new THREE.HemisphereLight(0xcaf0f8, 0xfffae5, 0.5)
scene.add(hemisphereLight)
const spotLight = new THREE.SpotLight(0xffffff, 5)
spotLight.castShadow = true
spotLight.shadow.bias = -0.00001
spotLight.shadow.mapSize.width = 4 * 1024;
spotLight.shadow.mapSize.height = 4 * 1024;
scene.add(spotLight)

camera.up.set(0, 1, 0)
camera.position.set(0, 2, (InitialHeight) / 1000)
controls.target.set(0, InitialHeight / (2 * 1000), 0)

function hiddenPart() {
    if (isDoorVisible) {
        isDoorVisible = false
        document.getElementById("visibilityIcon").src = "/assets/MdVisibilityOff.svg"
        console.log(isDoorVisible)
    }
    else {
        isDoorVisible = true
        document.getElementById("visibilityIcon").src = "/assets/MdVisibility.svg"
        console.log(isDoorVisible)
    }

    wardrobeGroup.children.forEach(child => {
        if (child.name === "door Part") {
            child.visible = isDoorVisible;
        }
    })
}

document.getElementById("visibilityIcon").addEventListener('click', hiddenPart);


function animate() {
    requestAnimationFrame(animate)

    spotLight.position.set(
        camera.position.x + 2,
        camera.position.y + 5,
        camera.position.z + 2
    )
    controls.update()
    renderer.render(scene, camera)



}


animate()
