import * as THREE from 'three';

/**
 * SpawnerSystem.js
 * 负责在场景中生成老人实体。
 */
export class SpawnerSystem {
    constructor(scene, levelConfig) {
        this.scene = scene;
        // 刷新频率 (秒/个)
        this.spawnRate = levelConfig.spawnRate || 5.0;
        this.timer = 0;
        this.elders = []; // 存储所有老人实体
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.spawnRate) {
            this.timer = 0;
            this.spawnElder();
        }
    }

    spawnElder() {
        // MVP: 创建红色方块代表老人
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const elder = new THREE.Mesh(geometry, material);

        // 随机位置 (例如在 x: -10 到 10, z: -10 到 10 的平面上)
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        elder.position.set(x, 0.5, z); // y=0.5 保证方块在地面上

        // 标记为 Elder，方便 Raycast 识别
        elder.userData = { type: 'elder', id: Math.random().toString(36).substr(2, 9) };

        this.scene.add(elder);
        this.elders.push(elder);

        console.log('Spawned Elder at', x, z);
    }
}
