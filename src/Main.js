import * as THREE from 'three';

// --- 1. 初始化场景 ---
// 创建场景对象，容纳所有 3D 物体
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // 设置深灰色背景

// --- 2. 初始化相机 (2.5D 等轴侧模式) ---
// 计算屏幕宽高比
const aspect = window.innerWidth / window.innerHeight;
// 视锥体大小 (控制缩放等级，数值越大看到的内容越多)
const d = 10;
// 使用正交相机 (OrthographicCamera) 实现无透视的“伪 3D”效果
const camera = new THREE.OrthographicCamera(
    -d * aspect, d * aspect, // left, right
    d, -d,                   // top, bottom
    1, 1000                  // near, far (近裁剪面, 远裁剪面)
);

// 设置相机位置 (经典的等轴侧角度)
// x:20, y:20, z:20 可以得到一个正 45 度的俯视角
camera.position.set(20, 20, 20);
// 让相机永远盯着场景中心 (0,0,0)
camera.lookAt(scene.position);

// --- 3. 初始化渲染器 ---
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 开启抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染出的画面 (canvas) 添加到 HTML 页面中
document.getElementById('game-container').appendChild(renderer.domElement);

// --- 4. 添加基础物体 (测试用) ---
// 创建一个立方体几何体 (Kubus)
const geometry = new THREE.BoxGeometry(2, 2, 2);
// 创建材质 (Material) - 绿色，受光照影响
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
// 组合几何体和材质成为网格 (Mesh)
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// --- 5. 添加光源 ---
// 环境光 (Ambient Light): 均匀照亮所有物体，无阴影
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// 平行光 (Directional Light): 模拟太阳光，产生明暗关系
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --- 6. 窗口自适应处理 ---
window.addEventListener('resize', () => {
    // 重新计算宽高比
    const aspect = window.innerWidth / window.innerHeight;
    
    // 更新相机视锥体参数
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
    
    // 更新渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 7. 动画循环 ---
function animate() {
    requestAnimationFrame(animate);

    // 让立方体旋转起来
    cube.rotation.y += 0.01;

    // 执行渲染
    renderer.render(scene, camera);
}

// 启动循环
animate();
