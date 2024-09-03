import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import { group, itemsData } from '../js/items-data';

// 調試模式開關
var isDebug = false;
console.log('galaxy.js loaded');

// 全域配置
const config = {
    mobileDistance: 1.4,
    pcDistance: 0.8,
    pcShift: [-2 / 10, 0],
    mobileShift: [0, 1 / 4],
    respondTime: 0.02,
    breakpoint: 785.9,
    maxSpeed: 2,
    speed: 0.05
};

// 初始化場景、相機和渲染器
const visual = document.getElementById('scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, visual.clientWidth / visual.clientHeight, 0.1, 1000);
let camDistance, camShift; // 相機與星系的距離
const cameraAnchor = new THREE.Group();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI();
const camTarget = new THREE.Vector3(0, 1.2, 6);
controls.enabled = false;

// 創建基本幾何體和材質
const boxGeometry = new THREE.BoxGeometry();
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 旋轉角度參考
const cube = new THREE.Mesh(boxGeometry, greenMaterial);
const point = new THREE.Mesh(boxGeometry, redMaterial);
point.position.set(0, 0, 1);
point.scale.set(0.2, 0.2, 1);
cube.add(point);

// 平滑旋轉參考
const cube2 = new THREE.Mesh(boxGeometry, redMaterial);
cube2.position.set(0, 1, 0);

// 確保投影矩陣與典型透視相機一致
camera.updateProjectionMatrix();

// 設置渲染器和相機
renderer.setSize(visual.clientWidth, visual.clientHeight);
visual.appendChild(renderer.domElement);
cameraAnchor.add(camera);
scene.add(cameraAnchor);
document.getElementsByClassName('dg ac')[0].style.display = 'none';
camInit();

// 創建星系結構
const orbit = group; // 各軌道上的星星數量
const items = Object.keys(itemsData.items);
const starSize = [1, 0.4, 0.2]; // 各軌道上的星星大小
const galaxy = []; // 二維陣列來儲存星星
const params = { radius: 4 };
const starGroup = new THREE.Group();

// 控制狀態
const controlState = {
    leftKey: false,
    rightKey: false,
    leftKeyUp: false,
    rightKeyUp: false,
    upKey: false,
    downKey: false,
    upKeyUp: false,
    downKeyUp: true,
    leftFirst: true,
    rightFirst: true
};

// 全域狀態
const state = {
    cubeAngle: 0,
    rotSpeed: 0,
    camPos: 0,
    currentOrbit: 0,
    currentItem: "sensor",
    targetAngle: 0
};

function initReferences() {

}

// 初始化光源
function initLights() {
    const pointLight = new THREE.PointLight(0xffffff, 50, 200, 1.8);
    camera.add(pointLight);
}

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
    if (window.innerWidth <= config.breakpoint) {
        camDistance = config.mobileDistance;
        camShift = config.mobileShift;
    } else {
        camDistance = config.pcDistance;
        camShift = config.pcShift;
    }
    camera.updateProjectionMatrix();
    applyShift(camera, camShift);
}

// 創建星星並添加到星系中
function createGalaxy() {
    const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let order = 0;
    const loader = new THREE.TextureLoader();
    for (let i = 0; i < orbit.length; i++) {
        galaxy[i] = [];
        for (let j = 0; j < orbit[i]; j++) {
            const starGeometry = new THREE.CircleGeometry(starSize[i], 64);
            const star = new THREE.Mesh(starGeometry, starMaterial.clone());
            loader.load(`./img/${items[order]}.png`, (texture) => {
                star.material.map = texture;
                star.material.needsUpdate = true;
            });
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
}

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
const mouse = new THREE.Vector2();

// 相機控制
function camControl() {
    let targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(mouse.y / -20, mouse.x / -10, 0));

    cameraAnchor.quaternion.slerp(targetQuaternion, config.respondTime);
    camera.position.lerp(camTarget, config.respondTime);

    const orbitPositioner = new THREE.Vector3(0, 0, state.camPos);
    cameraAnchor.position.lerp(orbitPositioner, 0.1);

    cameraAnchor.scale.lerp(new THREE.Vector3(starSize[state.currentOrbit] * camDistance, starSize[state.currentOrbit] * camDistance, starSize[state.currentOrbit] * camDistance), 0.1);

    camera.lookAt(cameraAnchor.position);

    if (state.camPos < 0) state.camPos = 0;
}

function locateChecker() {
    let threshold = 0.004 / ((state.currentOrbit + 0.2) * 5);
    if (Math.abs(cameraAnchor.position.z - state.camPos) < threshold) {
        if (state.currentOrbit == 0) {
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
        view.style.backgroundImage = `url("/img/${state.currentItem}.png")`;
    }
    if (!window.itemReady && !view.classList.contains('active') && view.classList.contains('ready')) {
        view.classList.remove('ready');
        console.log('remove ready');
    }
}

// 鍵盤控制
function keyControl() {
    if (controlState.leftKey || controlState.rightKey) {
        console.log('side');
        controlState.leftKey ? state.cubeAngle += state.rotSpeed : state.cubeAngle -= state.rotSpeed;
        if (state.rotSpeed < config.maxSpeed) state.rotSpeed += config.speed;
        if (controlState.leftFirst || controlState.rightFirst) {
            state.rotSpeed = 0;
            controlState.leftFirst = controlState.rightFirst = false;
        }
    }
    if (controlState.leftKeyUp || controlState.rightKeyUp) {
        if (state.currentOrbit != 0)
            state.cubeAngle = Math[controlState.leftKeyUp ? 'ceil' : 'floor'](state.cubeAngle / state.targetAngle) * state.targetAngle;
        controlState.leftKeyUp ? controlState.leftFirst = true : controlState.rightFirst = true;
        state.rotSpeed = 0;
    }
    if (controlState.upKey || controlState.downKey) {
        if (controlState.upKey && state.camPos > 0) {
            console.log(1);
            state.camPos -= config.speed * 3;
            console.log(2);
        }
        if (controlState.downKey && state.camPos < params.radius * (galaxy.length - 1)) {
            console.log(3);
            state.camPos += config.speed;
            console.log(4);
        }
    }
    if (controlState.upKeyUp || controlState.downKeyUp) {
        if (state.camPos >= 0 && state.camPos < params.radius * (galaxy.length - 1)) {
            state.camPos = Math[controlState.upKeyUp ? 'floor' : 'ceil'](state.camPos / params.radius) * params.radius;
            state.currentOrbit = state.camPos / params.radius;
        }
        if (state.camPos > params.radius * (galaxy.length - 1)) {
            state.camPos = params.radius * (galaxy.length - 1);
            state.currentOrbit = galaxy.length - 1;
        }
        state.targetAngle = 360 / orbit[state.currentOrbit];
    }
    state.cubeAngle = state.cubeAngle % 360;

    cube.rotation.y = THREE.MathUtils.degToRad(state.cubeAngle);
    cube2.quaternion.slerp(cube.quaternion, config.maxSpeed / 20);
    starGroup.quaternion.slerp(cube.quaternion, config.maxSpeed / 20);
}

// 鍵盤事件監聽器設置
function setupEventListeners() {
    // 監聽滑鼠移動
    document.addEventListener('mousemove', event => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

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

    document.addEventListener('keydown', (event) => {
        if (event.key === '`' || event.key === '~' || event.code === 'Backquote') {
            isDebug = !isDebug;
            debug();
        }
    });

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onWindowResize);
}

window.handleInput = function (direction, action) {
    console.log(direction, action);
    if (action == 'down') {
        switch (direction) {
            case 'left':
                controlState.leftKey = true;
                controlState.rightKey = controlState.leftKeyUp = controlState.rightKeyUp = false;
                break;
            case 'up':
                controlState.upKey = true;
                controlState.downKey = controlState.upKeyUp = controlState.downKeyUp = false;
                break;
            case 'right':
                controlState.rightKey = true;
                controlState.leftKey = controlState.leftKeyUp = controlState.rightKeyUp = false;
                break;
            case 'down':
                controlState.downKey = true;
                controlState.upKey = controlState.upKeyUp = controlState.downKeyUp = false;
                break;
        }
    }
    if (action == 'up') {
        switch (direction) {
            case 'left':
                controlState.leftKey = false;
                controlState.leftKeyUp = true;
                controlState.rightKeyUp = false;
                break;
            case 'up':
                controlState.upKey = false;
                controlState.upKeyUp = true;
                controlState.downKeyUp = false;
                break;
            case 'right':
                controlState.rightKey = false;
                controlState.leftKeyUp = false;
                controlState.rightKeyUp = true;
                break;
            case 'down':
                controlState.downKey = false;
                controlState.upKeyUp = false;
                controlState.downKeyUp = true;
                break;
        }
        listItemActive();
        console.log(state.currentOrbit, state.currentItem);
    }
}

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
        controls.enabled = true;
    } else {
        scene.remove(cube, cube2);
        controls.enabled = false;
    }
}

function listItemActive() {
    setTimeout(() => {
        if (state.currentOrbit != 0) {
            const foundItem = galaxy[state.currentOrbit].find(starPivot => starPivot.children[0].userData.index == Math.abs(state.cubeAngle / state.targetAngle));
            if (!foundItem) {
                console.error('undefined');
                listItemActive();
                return;
            }
            state.currentItem = foundItem.children[0].userData.name;
        } else {
            state.currentItem = items[0];
        }

        document.querySelectorAll('.mx-list-item').forEach(item => {
            item.classList.remove('hover');
        });

        console.log(state.currentItem);
        const currentListItem = document.getElementById(`${state.currentItem}`);
        currentListItem.classList.add('hover');
        scrollTo(0, currentListItem.offsetTop - 100);
    }, 10); // 延遲等方塊旋轉完成，獲取的度數才準確
}

// DOM 列表按鈕
window.selector = function (item) {
    console.log(item);
    if (item != null) {
        galaxy.flat().forEach(starPivot => {
            if (starPivot.children[0].userData.name === item) {
                state.currentItem = item;
                state.currentOrbit = starPivot.children[0].userData.orbit;
                state.camPos = state.currentOrbit * params.radius;
                state.targetAngle = 360 / -orbit[state.currentOrbit];
                state.cubeAngle = starPivot.children[0].userData.index * state.targetAngle;
            }
        });
    }
}

// 初始化函數
function init() {
    createGalaxy();
    initLights();
    setupEventListeners();
    window.sceneLoaded = true;
}

// 動畫循環
function animate() {
    starLookAt();
    keyControl();
    camControl();
    locateChecker();
    renderer.render(scene, camera);
}

init();
renderer.setAnimationLoop(animate);