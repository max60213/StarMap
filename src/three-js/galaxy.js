import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import { group, itemsData } from '../js/items-data';


// 調試模式開關
var isDebug = false;
console.log('galaxy.js loaded');

// 初始化場景、相機和渲染器
const visual = document.getElementById('scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, visual.clientWidth / visual.clientHeight, 0.1, 1000);
const mobileDistance = 1.4, pcDistance = 0.8, pcShift = [-2 / 10, 0], mobileShift = [0, 1 / 4];
const respondTime = 0.02;
var camDistance, camShift; // 相機與星系的距離
const breakpoint = 785; // 斷點寬度
const cameraAnchor = new THREE.Group();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI();
const camTarget = new THREE.Vector3(0, 1.2, 6);
const guiDOM = document.getElementsByClassName('dg ac');
controls.enabled = false;

// Ensure everything else in the projection matrix remains consistent with a typical perspective camera
camera.updateProjectionMatrix();

// 設置渲染器和相機
renderer.setSize(visual.clientWidth, visual.clientHeight);
visual.appendChild(renderer.domElement);
cameraAnchor.add(camera);
scene.add(cameraAnchor);
guiDOM[0].style.display = 'none';
camInit();

// 創建基本幾何體和材質
const boxGeometry = new THREE.BoxGeometry();
const ballGeometry = new THREE.SphereGeometry(0.8);
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 旋轉角度參考
const cube = new THREE.Mesh(boxGeometry, greenMaterial);
const point = new THREE.Mesh(boxGeometry, redMaterial);
point.position.set(0, 0, 1);
point.scale.set(0.2, 0.2, 1);
cube.add(point);

// 平滑旋轉參考
const cube2 = new THREE.Mesh(boxGeometry, redMaterial);
cube2.position.set(0, 1, 0);

// 相機位置參考
const orbitPositioner = new THREE.Mesh(ballGeometry, yellowMaterial);

// Add Grid
const gridGeometry = new THREE.PlaneGeometry(150, 150, 150, 150);
const gridMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });
const grid = new THREE.Mesh(gridGeometry, gridMaterial);
scene.add(grid);

grid.position.y = -1.5;
grid.rotation.x = -Math.PI / 2;

// 創建星系結構
const orbit = group; // 各軌道上的星星數量
const items = [];
for (const key in itemsData.items) {
    items.push(key);  // 將 key 推入陣列
}
const starSize = [1, 0.4, 0.2]; // 各軌道上的星星大小
const galaxy = []; // 二維陣列來儲存星星
const params = { radius: 5 };
const starGroup = new THREE.Group();
const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const pointLight = new THREE.PointLight(0xffffff, 50, 200, 1.8);
camera.add(pointLight);

// Function to apply shift effect
function applyShift(camera, camShift) {
    const projectionMatrix = camera.projectionMatrix.clone();
    let shiftX = camShift[0];
    let shiftY = camShift[1];

    // Apply shift
    projectionMatrix.elements[8] = -shiftX * 2;
    projectionMatrix.elements[9] = -shiftY * 2;

    // Update camera's projection matrix
    camera.projectionMatrix.copy(projectionMatrix);
    camera.projectionMatrixInverse.copy(projectionMatrix).invert();
}

function camInit() {
    // 將相機偏移，讓世界中心在螢幕偏左，手機版偏上
    // 0為中心，0.5為最右或最下，-0.5為最左或最上
    if (window.innerWidth <= breakpoint) {
        camDistance = mobileDistance;
        camShift = mobileShift
    } else {
        camDistance = pcDistance;
        camShift = pcShift;
    }
    camera.updateProjectionMatrix();
    applyShift(camera, camShift);
}


// 創建星星並添加到星系中
let order = 0;
for (let i = 0; i < orbit.length; i++) {
    galaxy[i] = [];
    for (let j = 0; j < orbit[i]; j++) {
        let texture = new THREE.TextureLoader().load(`../src/img/sensor.png`);
        const starGeometry = new THREE.CircleGeometry(starSize[i], 64);
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.material.map = texture;
        star.userData = { orbit: i, index: j, order: order, name: items[order] };
        const starPivot = new THREE.Object3D();
        starPivot.add(star);
        star.position.set(0, 0, params.radius * i);
        starPivot.rotation.y = (Math.PI * 2 / orbit[i]) * j;
        galaxy[i].push(starPivot);
        starGroup.add(starPivot);
        order++;
    }
}
scene.add(starGroup);

// 控制變量
let leftKey = false, rightKey = false, leftKeyUp = false, rightKeyUp = false;
let upKey = false, downKey = false, upKeyUp = false, downKeyUp = true; // downKeyUp = true to fix initial camera movement
let leftFirst = true, rightFirst = true;
let cubeAngle = 0, rotSpeed = 0, camPos = 0, maxSpeed = 2, speed = 0.05;
let currentOrbit = 0;
let targetAngle = 0;

// GUI控制
gui.add(params, 'radius', 0, 10).onChange(adjustRadius);

// 調整星系半徑
function adjustRadius() {
    galaxy.forEach((orbitStars, i) => {
        orbitStars.forEach(starPivot => {
            starPivot.children[0].position.set(0, 0, params.radius * i);
        });
    });
    cameraAnchor.position.z = params.radius * 2;
}

// 讓星星始終面向相機
function starLookAt() {
    starGroup.children.forEach(starPivot => {
        starPivot.children[0].lookAt(camera.getWorldPosition(new THREE.Vector3()));
    });
}

// 初始化滑鼠向量
let mouse = new THREE.Vector2();

// 監聽滑鼠移動
document.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 相機控制
function camControl() {
    let targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(mouse.y / -20, mouse.x / -10, 0));

    // 使用四元數的球面線性插值（slerp）方法，讓 cameraAnchor 平滑地從當前旋轉過渡到目標旋轉
    cameraAnchor.quaternion.slerp(targetQuaternion, respondTime);

    // 平滑地將相機位置插值到目標位置
    camera.position.lerp(camTarget, respondTime);

    orbitPositioner.position.z = camPos;

    // 平滑地將 cameraAnchor 的位置插值到 orbitPositioner 的位置
    cameraAnchor.position.lerp(orbitPositioner.position, 0.1);

    // 平滑地插值縮放比例
    cameraAnchor.scale.lerp(new THREE.Vector3(starSize[currentOrbit] * camDistance, starSize[currentOrbit] * camDistance, starSize[currentOrbit] * camDistance), 0.1);

    camera.lookAt(cameraAnchor.position);

    // 確保 camPos 不會小於 0
    if (camPos < 0) camPos = 0;
}


function locateChecker() {
    let threshold = 0.004 / ((currentOrbit + 0.2) * 5);
    if (Math.abs(cameraAnchor.position.z - camPos) < threshold) {
        if (currentOrbit == 0) {
            if (camera.position.distanceTo(camTarget) < threshold * 10) {
                window.itemReady = true;
            } else {
                window.itemReady = false;
            }
        } else if (cube2.quaternion.angleTo(cube.quaternion) < threshold) {
            window.itemReady = true;
        } else {
            window.itemReady = false;
        }
    } else {
        window.itemReady = false;
    }
    let view = document.querySelector('.window-view');
    if (view && window.itemReady) {
        view.classList.add('ready');
    }
    if (!window.itemReady && !view.classList.contains('active') && view.classList.contains('ready')) {
        view.classList.remove('ready');
        console.log('remove ready');
    }
}


// 鍵盤控制
function keyControl() {
    if (leftKey || rightKey) {
        leftKey ? cubeAngle += rotSpeed : cubeAngle -= rotSpeed;
        if (rotSpeed < maxSpeed) rotSpeed += speed;
        if (leftFirst || rightFirst) {
            rotSpeed = 0;
            leftFirst = rightFirst = false;
        }
    }
    if (leftKeyUp || rightKeyUp) {
        if (currentOrbit != 0)
            cubeAngle = Math[leftKeyUp ? 'ceil' : 'floor'](cubeAngle / targetAngle) * targetAngle;
        leftKeyUp ? leftFirst = true : rightFirst = true;
        rotSpeed = 0;
    }
    if (upKey || downKey) {
        if (upKey && camPos > 0) {
            camPos -= speed * 3;
        }
        if (downKey && camPos < params.radius * (galaxy.length - 1)) {
            camPos += speed * 3;
        }
    }
    if (upKeyUp || downKeyUp) {
        if (camPos >= 0 && camPos < params.radius * (galaxy.length - 1)) {
            camPos = Math[upKeyUp ? 'floor' : 'ceil'](camPos / params.radius) * params.radius;
            currentOrbit = camPos / params.radius;
        }
        if (camPos > params.radius * (galaxy.length - 1)) {
            camPos = params.radius * (galaxy.length - 1);
            currentOrbit = galaxy.length - 1;
        }
        targetAngle = 360 / orbit[currentOrbit];
    }
    cubeAngle = cubeAngle % 360;

    cube.rotation.y = THREE.MathUtils.degToRad(cubeAngle);
    cube2.quaternion.slerp(cube.quaternion, maxSpeed / 20);
    starGroup.quaternion.slerp(cube.quaternion, maxSpeed / 20);
}

// 鍵盤事件監聽器
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        handleInput('left', 'down')
    } else if (event.key === 'ArrowUp') {
        handleInput('up', 'down')
    } else if (event.key === 'ArrowRight') {
        handleInput('right', 'down')
    } else if (event.key === 'ArrowDown') {
        handleInput('down', 'down')
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
        handleInput('left', 'up')
    } else if (event.key === 'ArrowRight') {
        handleInput('right', 'up')
    } else if (event.key === 'ArrowUp') {
        handleInput('up', 'up')
    } else if (event.key === 'ArrowDown') {
        handleInput('down', 'up')
    }
});

window.handleInput = function (direction, action) {
    console.log(direction, action);
    if (action == 'down') {
        switch (direction) {
            case 'left':
                leftKey = true;
                rightKey = leftKeyUp = rightKeyUp = false;
                break;
            case 'up':
                upKey = true;
                downKey = upKeyUp = downKeyUp = false;
                break;
            case 'right':
                rightKey = true;
                leftKey = leftKeyUp = rightKeyUp = false;
                break;
            case 'down':
                downKey = true;
                upKey = upKeyUp = downKeyUp = false;
                break;
        }
    }
    if (action == 'up') {
        switch (direction) {
            case 'left':
                leftKey = false;
                leftKeyUp = true;
                rightKeyUp = false;
                break;
            case 'up':
                upKey = false;
                upKeyUp = true;
                downKeyUp = false;
                break;
            case 'right':
                rightKey = false;
                leftKeyUp = false;
                rightKeyUp = true;
                break;
            case 'down':
                downKey = false;
                upKeyUp = false;
                downKeyUp = true;
                break;
        }
        listItemActive();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === '`' || event.key === '~' || event.code === 'Backquote') {
        isDebug = !isDebug;
        debug();
    }
});

// 視窗大小調整處理
window.addEventListener('resize', onWindowResize);
window.addEventListener('orientationchange', onWindowResize);

function onWindowResize() {
    camera.aspect = visual.clientWidth / visual.clientHeight;
    camInit();
    renderer.setSize(visual.clientWidth, visual.clientHeight);
    console.log("resize");
}

// 定義一個函數來處理尺寸變化
function onResize(entries) {
    for (let entry of entries) {
        if (entry.target === visual) {
            const { width, height } = entry.contentRect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            applyShift(camera, camShift, 0);
            renderer.setSize(width, height);
            renderer.render(scene, camera); // 如果想直接渲染一次
        }
    }
}

// 創建一個 ResizeObserver 來監聽 'visual' 元素
const resizeObserver = new ResizeObserver(onResize);
resizeObserver.observe(visual);

// 調試模式切換
function debug() {
    if (isDebug) {
        scene.add(cube, cube2);
        guiDOM[0].style.display = 'block';
        controls.enabled = true;
    } else {
        scene.remove(cube, cube2);
        guiDOM[0].style.display = 'none';
        controls.enabled = false;
    }
}

let curremtItem = null;
let curremtListItem = null;

function listItemActive() {
    setTimeout(() => {
        if (currentOrbit != 0) {
            curremtItem = galaxy[currentOrbit].find(starPivot => starPivot.children[0].userData.index == Math.abs(cubeAngle / targetAngle));
            curremtItem = curremtItem.children[0].userData.name;
        } else {
            curremtItem = items[0];
        }
        document.querySelectorAll('.mx-list-item').forEach(item => {
            item.classList.remove('hover');
        });
        console.log(curremtItem);
        curremtListItem = document.getElementById(`${curremtItem}`);
        curremtListItem.classList.add('hover');
        scrollTo(0, curremtListItem.offsetTop - 100);
    }, 10); // 延遲等方塊旋轉完成，獲取的度數才準確
}


// DOM 列表按鈕
window.selector = function (items) {
    if (items != null) {
        galaxy.flat().forEach(starPivot => {
            if (starPivot.children[0].userData.name == items) {
                currentOrbit = starPivot.children[0].userData.orbit;
                camPos = currentOrbit * params.radius;
                targetAngle = 360 / -orbit[starPivot.children[0].userData.orbit];
                cubeAngle = starPivot.children[0].userData.index * targetAngle;
            }
        });
    }
}

window.sceneLoaded = true;

// 動畫循環
function animate() {
    starLookAt();
    keyControl();
    camControl();
    locateChecker();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
