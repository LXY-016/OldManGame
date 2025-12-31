import * as THREE from 'three';
import { calculateServiceTime, WorkerAttributes } from '../core/GameConfig.js';
import { gameManager } from '../core/GameManager.js';

/**
 * Drag System
 * 处理从 2D UI 拖拽社工到 3D 场景的核心交互逻辑
 */
export class DragSystem {
    // ... (constructor and listeners unchanged)

    // ... (getEventPos, onMouseDown, onMouseMove, onMouseUp, createGhost, removeGhost unchanged)

    // We only need to update checkDrop and imports. 
    // Since replace_file_content works on chunks, I will target the checkDrop method specifically.

    constructor(scene, camera, workerContainer) {
        this.scene = scene;
        this.camera = camera;
        this.workerContainer = workerContainer; // DOM element containing worker cards

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.draggedData = null; // { id, attr, color }
        this.ghostEl = null;     // 跟随鼠标的幻影元素

        this.initListeners();
    }

    initListeners() {
        // 绑定整个文档的鼠标/触摸事件，确保拖拽流畅
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // 触摸屏支持
        document.addEventListener('touchstart', this.onMouseDown.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onMouseMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onMouseUp.bind(this));
    }

    /**
     * 获取事件坐标（兼容鼠标和触摸）
     */
    getEventPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    onMouseDown(e) {
        // 1. 检查点击目标是否是 worker-card
        const card = e.target.closest('.worker-card');
        if (!card) return;

        e.preventDefault(); // 防止默认选取文本

        // 2. 提取数据
        const workersMock = [ // 临时 Mock 数据源，后续应从 GameLevelUI 获取
            { id: 101, attr: WorkerAttributes.STRONG, color: "#d97706" },
            { id: 102, attr: WorkerAttributes.TALKATIVE, color: "#16a34a" },
            { id: 103, attr: WorkerAttributes.SMART, color: "#2563eb" }
        ];
        const id = parseInt(card.dataset.id);
        const data = workersMock.find(w => w.id === id);

        if (data) {
            this.draggedData = data;
            this.createGhost(this.getEventPos(e), data.color);
        }
    }

    onMouseMove(e) {
        if (!this.draggedData || !this.ghostEl) return;

        e.preventDefault();
        const pos = this.getEventPos(e);

        // 更新幻影位置
        this.ghostEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }

    onMouseUp(e) {
        if (!this.draggedData) return;

        const pos = e.changedTouches ?
            { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } :
            { x: e.clientX, y: e.clientY };

        // 1. 执行射线检测
        this.checkDrop(pos);

        // 2. 清理
        this.removeGhost();
        this.draggedData = null;
    }

    createGhost(pos, color) {
        this.ghostEl = document.createElement('div');
        this.ghostEl.style.position = 'absolute';
        this.ghostEl.style.top = '0';
        this.ghostEl.style.left = '0';
        this.ghostEl.style.width = '60px';
        this.ghostEl.style.height = '60px';
        this.ghostEl.style.backgroundColor = color;
        this.ghostEl.style.borderRadius = '50%';
        this.ghostEl.style.opacity = '0.8';
        this.ghostEl.style.pointerEvents = 'none'; // 穿透
        this.ghostEl.style.zIndex = '9999';
        this.ghostEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        // 中心对齐
        this.ghostEl.style.marginLeft = '-30px';
        this.ghostEl.style.marginTop = '-30px';

        document.body.appendChild(this.ghostEl);
    }

    removeGhost() {
        if (this.ghostEl) {
            this.ghostEl.remove();
            this.ghostEl = null;
        }
    }

    /**
     * 核心逻辑：检测投放结果
     */
    checkDrop(screenPos) {
        // 1. 归一化设备坐标 (NDC) -1 到 +1
        this.mouse.x = (screenPos.x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(screenPos.y / window.innerHeight) * 2 + 1;

        // 2. 发射射线
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 3. 检测与“老人”组的碰撞
        // 获取场景中所有名为 'OldMan' 的物体 (且必须可见)
        const oldMen = this.scene.children.filter(obj =>
            obj.userData &&
            obj.userData.type === 'OldMan' &&
            obj.visible
        );
        const intersects = this.raycaster.intersectObjects(oldMen);

        if (intersects.length > 0) {
            const target = intersects[0].object;
            console.log(`[DragSystem] 🎯 Hit OldMan! (ID: ${target.id})`);

            // 调用游戏管理器处理服务逻辑
            gameManager.handleService(target, this.draggedData.attr);

        } else {
            console.log('[DragSystem] ❌ Missed.');
        }
    }
}
