import * as THREE from 'three';

/**
 * Bubble System
 * 管理所有跟随 3D 物体的 2D 气泡 UI
 */
export class BubbleSystem {
    constructor(camera) {
        this.camera = camera;
        this.container = null;
        this.bubbles = []; // { dom, targetObj, offset }
    }

    /**
     * 初始化系统 (必须调用)
     */
    init(camera) {
        this.camera = camera;
        this.container = document.createElement('div');
        this.container.id = 'bubble-layer';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none'; // 穿透
        this.container.style.overflow = 'hidden';

        document.body.appendChild(this.container);
    }

    /**
     * 创建一个跟随气泡
     * @param {THREE.Object3D} targetObj - 追踪的 3D 物体
     * @param {string} text - 气泡内容
     * @param {string} color - 气泡颜色
     */
    createBubble(targetObj, text, color = '#fff') {
        if (!this.container) return; // 尚未初始化

        const dom = document.createElement('div');
        dom.className = 'bubble';
        dom.innerText = text;
        dom.style.backgroundColor = color;

        this.container.appendChild(dom);

        this.bubbles.push({
            dom: dom,
            targetObj: targetObj,
            offset: new THREE.Vector3(0, 2.5, 0) // 头顶偏移量
        });
    }

    /**
     * 更新气泡文本
     */
    updateBubbleContent(targetObj, text) {
        const b = this.bubbles.find(item => item.targetObj === targetObj);
        if (b) {
            b.dom.innerText = text;
        }
    }

    /**
     * 移除气泡
     */
    removeBubble(targetObj) {
        const index = this.bubbles.findIndex(item => item.targetObj === targetObj);
        if (index !== -1) {
            this.bubbles[index].dom.remove();
            this.bubbles.splice(index, 1);
        }
    }

    /**
     * 每帧更新：将 3D 坐标转换为屏幕坐标
     */
    update() {
        if (!this.camera) return;

        const tempVec = new THREE.Vector3();

        this.bubbles.forEach(bubble => {
            // 简单的可见性检查
            if (bubble.targetObj.visible === false) {
                bubble.dom.style.display = 'none';
                return;
            } else {
                bubble.dom.style.display = 'flex';
            }

            // 1. 获取物体世界坐标 + 偏移
            tempVec.copy(bubble.targetObj.position).add(bubble.offset);

            // 2. 投影到 NDC (-1 to 1)
            tempVec.project(this.camera);

            // 3. 转换为屏幕 CSS 坐标
            const x = (tempVec.x * .5 + .5) * window.innerWidth;
            const y = (-(tempVec.y * .5) + .5) * window.innerHeight;

            // 4. 应用位置
            bubble.dom.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        });
    }
}

// 简单的单例模式
export const bubbleSystem = new BubbleSystem(null); 
