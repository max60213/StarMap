import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GridHelper } from 'three';
import { GUI } from 'dat.gui';
import { InfiniteGridHelper } from './InfiniteGridHelper'; // 請確認路徑是否正確
import { group, itemsData } from '../js/items-data';

class Galaxy {
  constructor(containerId, setItemReady, setCurrentItem) {
    this.containerId = containerId;
    this.setItemReady = setItemReady;  // 保存傳遞的 setItemReady 函數
    this.setCurrentItem = setCurrentItem;
    this.isDebug = false;
    this.isRendering = true;  // Track whether rendering is active
    this.animationId = null;  // Store requestAnimationFrame ID for pausing/resuming

    this.config = {
      mobileDistance: 0.95,
      pcDistance: 0.8,
      pcShift: [-2.3 / 10, 0],
      mobileShift: [0, 1 / 4],
      respondTime: 0.04,
      breakpoint: 1023.5,
      maxSpeed: 4,
      speed: 0.1,
    };

    this.state = {
      cubeAngle: 0,
      rotSpeed: 0,
      camPosZ: 0,
      camPosY: 0,
      currentOrbit: 0,
      currentItem: "principles",
      targetAngle: 0
    };

    this.controlState = {
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

    this.params = { radius: 5 };
    this.orbit = group;
    this.items = Object.keys(itemsData.items);
    this.starSize = [1, 0.4, 0.2];
    this.galaxy = [];
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init = () => {
    console.log('galaxy.js loaded');
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLights();
    this.createGalaxy();
    this.setupEventListeners();
    this.initGUI();
    this.animate();
    this.setCurrentItem("principles");
    this.selector("principles");
    window.sceneLoaded = true;
  }

  initScene = () => {
    this.visual = document.getElementById(this.containerId);
    this.scene = new THREE.Scene();
    this.cameraAnchor = new THREE.Group();
    this.scene.add(this.cameraAnchor);

    this.starGroup = new THREE.Group();
    this.scene.add(this.starGroup);

    // Create cube and cube2
    const boxGeometry = new THREE.BoxGeometry();
    const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.cube = new THREE.Mesh(boxGeometry, greenMaterial);
    const point = new THREE.Mesh(boxGeometry, redMaterial);
    point.position.set(0, 0, 1);
    point.scale.set(0.2, 0.2, 1);
    this.cube.add(point);

    this.cube2 = new THREE.Mesh(boxGeometry, redMaterial);
    this.cube2.position.set(0, 1, 0);

    // Add Grid

    // 加入 InfiniteGridHelper
    // 初始化 InfiniteGridHelper
    const grid = new InfiniteGridHelper(1, 0, new THREE.Color('white'), 50, 'xzy');
    grid.position.y = -1.5;

    const grid2 = new InfiniteGridHelper(1, 0, new THREE.Color('white'), 50, 'xzy');
    grid2.position.y = 1.5;
    this.scene.add(grid);
    this.scene.add(grid2);
  }

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(50, this.visual.clientWidth / this.visual.clientHeight, 0.1, 1000);
    this.camTarget = new THREE.Vector3(0, 1.2, 6);
    this.cameraAnchor.add(this.camera);
    this.camInit();
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.visual.clientWidth, this.visual.clientHeight);
    this.visual.appendChild(this.renderer.domElement);
  }

  initControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
  }

  initLights = () => {
    const pointLight = new THREE.PointLight(0xffffff, 50, 200, 1.8);
    this.camera.add(pointLight);
  }

  createGalaxy = () => {
    const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let order = 0;
    const loader = new THREE.TextureLoader();
    for (let i = 0; i < this.orbit.length; i++) {
      this.galaxy[i] = [];
      for (let j = 0; j < this.orbit[i]; j++) {
        const starGeometry = new THREE.CircleGeometry(this.starSize[i], 64);
        const star = new THREE.Mesh(starGeometry, starMaterial.clone());
        loader.load(`/img/icons/${this.items[order]}.png`, (texture) => {
          star.material.map = texture;
          star.material.needsUpdate = true;
        });
        star.userData = { orbit: i, index: j, order: order, name: this.items[order] };
        const starPivot = new THREE.Object3D();
        starPivot.add(star);
        if (order == 0) {
          star.position.set(0, 3, this.params.radius * i);
        }
        else if (order == 1) {
          star.position.set(0, -3, this.params.radius * i);
        }
        else {
          star.position.set(0, 0, this.params.radius * i);
        }
        starPivot.rotation.y = (Math.PI * 2 / this.orbit[i]) * j;
        this.galaxy[i].push(starPivot);
        this.starGroup.add(starPivot);
        order++;
      }
    }
  }

  getCurrentItem = () => {
    return this.state.currentItem;
  }

  setupEventListeners = () => {
    const handlers = {
        mousemove: this.onMouseMove,
        keydown: this.onKeyDown,
        keyup: this.onKeyUp,
        orientationchange: this.onResize
    };

    // 添加事件監聽器
    Object.entries(handlers).forEach(([event, handler]) => {
        document.addEventListener(event, handler);
    });

    // 設置 ResizeObserver
    this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            this.onResize(entry);
        }
    });
    this.resizeObserver.observe(this.visual);

    // 提供清理方法
    this.cleanupEventListeners = () => {
        Object.entries(handlers).forEach(([event, handler]) => {
            document.removeEventListener(event, handler);
        });
        this.resizeObserver.disconnect();
    };
  }

  initGUI = () => {
    this.gui = new GUI();
    this.gui.add(this.params, 'radius', 0, 10).onChange(this.adjustRadius);
    document.getElementsByClassName('dg ac')[0].style.display = 'none';
  }

  animate = () => {
    if (!this.isRendering) return;  // Stop rendering if paused

    this.keyControl();
    this.camControl();
    this.starLookAt();
    this.locateChecker();
    this.applyShift(this.camera, this.camShift);
    this.renderer.render(this.scene, this.camera);
    // Save the requestAnimationFrame ID to control it
    this.animationId = requestAnimationFrame(this.animate);
  }

  starLookAt = () => {
    this.starGroup.children.forEach(starPivot => {
      starPivot.children[0].lookAt(this.camera.getWorldPosition(new THREE.Vector3()));
    });
  }

  keyControl = () => {
    if (this.controlState.leftKey || this.controlState.rightKey) {
      console.log('side');
      this.controlState.leftKey ? this.state.cubeAngle += this.state.rotSpeed : this.state.cubeAngle -= this.state.rotSpeed;
      if (this.state.rotSpeed < this.config.maxSpeed) this.state.rotSpeed += this.config.speed;
      if (this.controlState.leftFirst || this.controlState.rightFirst) {
        this.state.rotSpeed = 0;
        this.controlState.leftFirst = this.controlState.rightFirst = false;
      }
    }
    if (this.controlState.leftKeyUp || this.controlState.rightKeyUp) {
      if (this.state.currentOrbit != 0)
        this.state.cubeAngle = Math[this.controlState.leftKeyUp ? 'ceil' : 'floor'](this.state.cubeAngle / this.state.targetAngle) * this.state.targetAngle;
      this.controlState.leftKeyUp ? this.controlState.leftFirst = true : this.controlState.rightFirst = true;
      this.state.rotSpeed = 0;
    }
    if (this.controlState.upKey || this.controlState.downKey) {
      if (this.controlState.upKey && this.state.camPosZ > 0) {
        this.state.camPosZ -= this.config.speed * 3;
      }
      if (this.controlState.downKey && this.state.camPosZ < this.params.radius * (this.galaxy.length - 1)) {
        this.state.camPosZ += this.config.speed;
      }
    }
    if (this.controlState.upKeyUp || this.controlState.downKeyUp) {
      if (this.state.camPosZ >= 0 && this.state.camPosZ < this.params.radius * (this.galaxy.length - 1)) {
        this.state.camPosZ = Math[this.controlState.upKeyUp ? 'floor' : 'ceil'](this.state.camPosZ / this.params.radius) * this.params.radius;
        this.state.currentOrbit = this.state.camPosZ / this.params.radius;
      }
      if (this.state.camPosZ > this.params.radius * (this.galaxy.length - 1)) {
        this.state.camPosZ = this.params.radius * (this.galaxy.length - 1);
        this.state.currentOrbit = this.galaxy.length - 1;
      }
      this.state.targetAngle = 360 / this.orbit[this.state.currentOrbit];
    }
    this.state.cubeAngle = this.state.cubeAngle % 360;

    this.cube.rotation.y = THREE.MathUtils.degToRad(this.state.cubeAngle);
    this.cube2.quaternion.slerp(this.cube.quaternion, this.config.maxSpeed / 20);
    this.starGroup.quaternion.slerp(this.cube.quaternion, this.config.maxSpeed / 20);
  }

  camControl = () => {
    let targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.mouse.y / -20, this.mouse.x / -10, 0));

    this.cameraAnchor.quaternion.slerp(targetQuaternion, this.config.respondTime);
    this.camera.position.lerp(this.camTarget, this.config.respondTime);

    const orbitPositioner = new THREE.Vector3(0, this.state.camPosY, this.state.camPosZ);

    this.cameraAnchor.position.lerp(orbitPositioner, 0.15);

    this.cameraAnchor.scale.lerp(new THREE.Vector3(this.starSize[this.state.currentOrbit] * this.camDistance, this.starSize[this.state.currentOrbit] * this.camDistance, this.starSize[this.state.currentOrbit] * this.camDistance), 0.1);

    this.camera.lookAt(this.cameraAnchor.position);

    if (this.state.camPosZ < 0) this.state.camPosZ = 0;
  }

  locateChecker = () => {
    let threshold = 0.01 / ((this.state.currentOrbit + 0.2) * 5);

    // 計算相機位置與 orbitPositioner 的距離
    const orbitPositioner = new THREE.Vector3(0, this.state.camPosY, this.state.camPosZ);
    const positionDistance = this.cameraAnchor.position.distanceTo(orbitPositioner);

    // 如果相機角度和位置都在 threshold 範圍內
    if (positionDistance < threshold && Math.abs(this.cameraAnchor.position.z - this.state.camPosZ) < threshold) {
        if (this.state.currentOrbit == 0) {
            if (this.camera.position.distanceTo(this.camTarget) < threshold * 10) {
                window.itemReady = true;
                this.setItemReady(true);
            } else {
                window.itemReady = false;
                this.setItemReady(false);
            }
        } else if (this.cube2.quaternion.angleTo(this.cube.quaternion) < threshold) {
            window.itemReady = true;
            this.setItemReady(true);
        } else {
            window.itemReady = false;
            this.setItemReady(false);
        }
    } else {
        window.itemReady = false;
        this.setItemReady(false);
    }

    // 更新 UI 狀態
    let view = document.querySelector('.window-frame');
    if (view && window.itemReady) {
        view.classList.add('ready');
    }
    if (!window.itemReady && !view.classList.contains('active') && view.classList.contains('ready')) {
        view.classList.remove('ready');
        console.log('remove ready');
    }
};

  onMouseMove = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      this.handleInput('left', 'down');
    } else if (event.key === 'ArrowUp') {
      this.handleInput('up', 'down');
    } else if (event.key === 'ArrowRight') {
      this.handleInput('right', 'down');
    } else if (event.key === 'ArrowDown') {
      this.handleInput('down', 'down');
    } else if (event.key === '`' || event.key === '~' || event.code === 'Backquote') {
      this.isDebug = !this.isDebug;
      this.debug();
    }
  }

  onKeyUp = (event) => {
    if (event.key === 'ArrowLeft') {
      this.handleInput('left', 'up');
    } else if (event.key === 'ArrowRight') {
      this.handleInput('right', 'up');
    } else if (event.key === 'ArrowUp') {
      this.handleInput('up', 'up');
    } else if (event.key === 'ArrowDown') {
      this.handleInput('down', 'up');
    }
  }

  onResize = (event) => {
    if (event instanceof ResizeObserverEntry) {
      // 來自 ResizeObserver 的事件
      const { width, height } = event.contentRect;
      this.camera.aspect = width / height;
    } else {
      // 來自 window resize 的事件
      this.camera.aspect = this.visual.clientWidth / this.visual.clientHeight;
    }

    // 呼叫 camInit() 來更新相機設置和投影矩陣
    this.camInit();

    // 更新渲染器大小
    this.renderer.setSize(this.visual.clientWidth, this.visual.clientHeight);

    // 重繪場景
    this.applyShift(this.camera, this.camShift);
    this.renderer.render(this.scene, this.camera);
  }

  handleInput = (direction, action) => {
    console.log(direction, action);
    if (action == 'down') {
      switch (direction) {
        case 'left':
          this.controlState.leftKey = true;
          this.controlState.rightKey = this.controlState.leftKeyUp = this.controlState.rightKeyUp = false;
          break;
        case 'up':
          this.controlState.upKey = true;
          this.controlState.downKey = this.controlState.upKeyUp = this.controlState.downKeyUp = false;
          break;
        case 'right':
          this.controlState.rightKey = true;
          this.controlState.leftKey = this.controlState.leftKeyUp = this.controlState.rightKeyUp = false;
          break;
        case 'down':
          this.controlState.downKey = true;
          this.controlState.upKey = this.controlState.upKeyUp = this.controlState.downKeyUp = false;
          break;
      }
    }
    if (action == 'up') {
      switch (direction) {
        case 'left':
          this.controlState.leftKey = false;
          this.controlState.leftKeyUp = true;
          this.controlState.rightKeyUp = false;
          break;
        case 'up':
          this.controlState.upKey = false;
          this.controlState.upKeyUp = true;
          this.controlState.downKeyUp = false;
          break;
        case 'right':
          this.controlState.rightKey = false;
          this.controlState.leftKeyUp = false;
          this.controlState.rightKeyUp = true;
          break;
        case 'down':
          this.controlState.downKey = false;
          this.controlState.upKeyUp = false;
          this.controlState.downKeyUp = true;
          break;
      }
      this.listItemActive();
      console.log(this.state.currentOrbit, this.state.currentItem);
    }
  }

  listItemActive = () => {
    setTimeout(() => {
      if (this.state.currentOrbit != 0) {
        const foundItem = this.galaxy[this.state.currentOrbit].find(starPivot =>
          starPivot.children[0].userData.index == Math.abs(this.state.cubeAngle / this.state.targetAngle)
        );
        if (!foundItem) {
          console.log('undefined');
          this.listItemActive();
          return;
        }
        this.state.currentItem = foundItem.children[0].userData.name;
        this.setCurrentItem(foundItem.children[0].userData.name);
      } else {
        this.state.currentItem = this.items[0];
        this.setCurrentItem(this.items[0]);

      }

      document.querySelectorAll('.mx-list-item').forEach(item => {
        item.classList.remove('hover');
      });

      console.log(this.state.currentItem);
      const currentListItem = document.getElementById(`${this.state.currentItem}`);
      currentListItem.classList.add('hover');
      scrollTo(currentListItem);
    }, 10);
  }

  selector = (item) => {
    if (item != null) {
      console.log(item);
      this.galaxy.flat().forEach(starPivot => {
        if (starPivot.children[0].userData.name === item) {
          this.state.currentItem = item;
          this.setCurrentItem(item);
          this.state.currentOrbit = starPivot.children[0].userData.orbit;
          if(starPivot.children[0].userData.order == 0) {
            this.state.camPosY = 3;
          }
          else if(starPivot.children[0].userData.order == 1) {
            this.state.camPosY = -3;
          }
          else {
            this.state.camPosY = 0;
          }
          this.state.camPosZ = this.state.currentOrbit * this.params.radius;
          this.state.targetAngle = 360 / -this.orbit[this.state.currentOrbit];
          this.state.cubeAngle = starPivot.children[0].userData.index * this.state.targetAngle;
        }
      });
    }
  }

  debug = () => {
    if (this.isDebug) {
      this.scene.add(this.cube, this.cube2);
      this.controls.enabled = true;
    } else {
      this.scene.remove(this.cube, this.cube2);
      this.controls.enabled = false;
    }
  }

  adjustRadius = () => {
    this.galaxy.forEach((orbitStars, i) => {
      orbitStars.forEach(starPivot => {
        starPivot.children[0].position.set(0, 0, this.params.radius * i);
      });
    });
    this.cameraAnchor.position.z = this.params.radius * 2;
  }

  camInit = () => {
    if (window.innerWidth <= this.config.breakpoint) {
      this.camDistance = this.config.mobileDistance;
      this.camShift = this.config.mobileShift;
    } else {
      this.camDistance = this.config.pcDistance;
      this.camShift = this.config.pcShift;
    }
    this.camera.updateProjectionMatrix();
  }

  applyShift = (camera, camShift) => {
    const projectionMatrix = camera.projectionMatrix.clone();
    let shiftX = camShift[0];
    let shiftY = camShift[1];

    projectionMatrix.elements[8] = -shiftX * 2;
    projectionMatrix.elements[9] = -shiftY * 2;

    camera.projectionMatrix.copy(projectionMatrix);
    camera.projectionMatrixInverse.copy(projectionMatrix).invert();
  }

  // Function to pause rendering
  pauseRendering = () => {
    this.isRendering = false;  // Set rendering flag to false
    if (this.animationId) cancelAnimationFrame(this.animationId);  // Stop the loop
    console.log('Rendering paused');
  }

  // Function to resume rendering
  resumeRendering = () => {
    if (!this.isRendering) {
      this.isRendering = true;  // Set rendering flag to true
      this.animate();  // Restart the animation loop
      console.log('Rendering resumed');
    }
  }
}

export default Galaxy;