import * as THREE from 'three';

/**
 * DragSystem.js
 * 处理点击和拖拽交互。
 * 
 * 核心职责:
 * 1. 射线检测 (Raycasting)。
 * 2. 验证社工冷却 (LevelManager.getWorkerStatus)。
 * 3. 触发服务结算 (LevelManager.incrementScore)。
 */
export class DragSystem {
    constructor(camera, scene, levelManager) {
        this.camera = camera;
        this.scene = scene;
        this.levelManager = levelManager;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.isDragging = false;
        this.draggedWorkerId = null; // 当前拖拽的是哪个社工 (MVP先固定为一个 ID 用于测试)
        this.ghostMesh = null; // 拖拽时的幻影

        // MVP: 暂时模拟只有一个 ID 为 'Worker-A' 的社工在被拖拽
        // 后续 UI 对接后，这里应该是从 UI 传过来的 ID
        this.currentSelectedWorkerId = 'Worker-A';

        // 绑定事件
        window.addEventListener('pointerdown', this.onPointerDown.bind(this));
        window.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));
    }

    update(dt) {
        // DragSystem 主要是事件驱动，update 可用于平滑动画等
    }

    onPointerDown(event) {
        // 1. 检查冷却
        const workerStatus = this.levelManager.getWorkerStatus(this.currentSelectedWorkerId);
        if (workerStatus && workerStatus.cooldown > 0) {
            console.log('Worker is in cooldown!', workerStatus.cooldown);
            // TODO: 播放拒绝音效
            return;
        }

        this.isDragging = true;
        this.draggedWorkerId = this.currentSelectedWorkerId;

        // 创建幻影 (绿色半透明方块)
        if (!this.ghostMesh) {
            const geo = new THREE.BoxGeometry(1, 1, 1);
            const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
            this.ghostMesh = new THREE.Mesh(geo, mat);
            this.scene.add(this.ghostMesh);
        }
        this.ghostMesh.visible = true;

        this.updateGhostPosition(event);
    }

    onPointerMove(event) {
        if (!this.isDragging) return;
        this.updateGhostPosition(event);
    }

    onPointerUp(event) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.ghostMesh.visible = false;

        // 2. 检测是否投放到老人身上
        this.updatePointer(event);
        this.raycaster.setFromCamera(this.pointer, this.camera);

        // 获取所有老人实体 (需从 SpawnerSystem 或 Scene 获取，MVP 简单遍历 Scene children)
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        for (const hit of intersects) {
            if (hit.object.userData && hit.object.userData.type === 'elder') {
                console.log('Hit Elder!');
                this.serveElder(hit.object);
                return; // 只服务一个
            }
        }
    }

    updatePointer(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    updateGhostPosition(event) {
        // 将鼠标投射到地平面 (y=0)
        this.updatePointer(event);
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, target);
        if (target) {
            this.ghostMesh.position.copy(target);
        }
    }

    serveElder(elderMesh) {
        // 1. 视觉销毁
        this.scene.remove(elderMesh);

        // 2. 逻辑加分
        this.levelManager.incrementScore();

        // 3. 触发冷却 (Critical Logic)
        this.levelManager.startWorkerCooldown(this.draggedWorkerId);
    }
}
