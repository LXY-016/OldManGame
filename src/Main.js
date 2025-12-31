import * as THREE from 'three';
import GameConfig from './core/ConfigLoader.js';
import { GameLoop } from './core/GameLoop.js';
import { LevelManager } from './systems/LevelManager.js';
import { SpawnerSystem } from './systems/SpawnerSystem.js';
import { DragSystem } from './systems/DragSystem.js';
import { StartScreen } from './ui/Start Screen.js';
import { LevelSelect } from './ui/Level Select.js';
import { GameLevelUI } from './ui/Game Level.js';

/**
 * Main.js
 * 游戏入口与组合根 (Composition Root)。
 * 负责组装各个 System 和 UI，不包含具体逻辑。
 */

// Global State
let loop, scene, camera, renderer;
let currentUI = null;

// Systems
let levelManager, spawnerSystem, dragSystem, gameLevelUI;

function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    const aspect = window.innerWidth / window.innerHeight;
    const d = 10;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Resize Handler
    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Render Loop (separate from Logic Loop)
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        if (gameLevelUI) gameLevelUI.update(); // Tick UI
    }
    render();
}

// 状态机: 切换界面
function showStartScreen() {
    if (currentUI) currentUI.unmount();
    console.log('State: Start Screen');

    const startScreen = new StartScreen(() => {
        showLevelSelect();
    });
    startScreen.mount();
    currentUI = startScreen;
}

function showLevelSelect() {
    if (currentUI) currentUI.unmount();
    console.log('State: Level Select');

    const levelSelect = new LevelSelect((levelIndex) => {
        showGameLevel(levelIndex);
    });
    levelSelect.mount();
    currentUI = levelSelect;
}

function showGameLevel(levelIndex) {
    if (currentUI) currentUI.unmount();
    console.log('State: Game Level', levelIndex);

    // 1. 准备配置 (MVP: Config from Markdown)
    const levelConfig = GameConfig.levels[levelIndex - 1] || GameConfig.levels[0];
    const workerConfig = GameConfig.workers;

    // 2. 初始化核心系统
    if (loop) loop.stop();
    loop = new GameLoop();

    levelManager = new LevelManager();
    levelManager.init(levelConfig, workerConfig);

    spawnerSystem = new SpawnerSystem(scene, levelConfig);
    dragSystem = new DragSystem(camera, scene, levelManager);

    // 3. 注册到循环
    loop.addSystem(levelManager); // 状态更新
    loop.addSystem(spawnerSystem); // 生成更新
    loop.addSystem(dragSystem); // 交互更新

    // 4. 初始化 UI
    gameLevelUI = new GameLevelUI(levelManager);
    gameLevelUI.mount();
    currentUI = gameLevelUI; // 虽然 UI 自己管理生命周期，但也记录一下

    // 5. 启动游戏逻辑
    loop.start();
}

// Boot
console.log('Game Booting...', GameConfig);
initThree();
showStartScreen();
