/**
 * GameLoop.js
 * 负责管理游戏的主循环，提供稳定的 deltaTime。
 * 
 * 职责:
 * 1. 封装 requestAnimationFrame。
 * 2. 计算帧间隔 (dt)。
 * 3. 驱动所有注册系统的 update(dt) 方法。
 */
export class GameLoop {
    constructor() {
        this.systems = [];
        this.lastTime = 0;
        this.isRunning = false;
        this.animationId = null;

        // 绑定上下文
        this.loop = this.loop.bind(this);
    }

    /**
     * 添加需要每帧更新的系统
     * @param {Object} system - 必须包含 update(dt) 方法
     */
    addSystem(system) {
        if (system && typeof system.update === 'function') {
            this.systems.push(system);
        } else {
            console.error('GameLoop: 尝试添加无效的系统', system);
        }
    }

    /**
     * 启动循环
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    /**
     * 停止循环
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 内部循环函数
     */
    loop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        // 计算 delta time (秒)
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 限制最大 dt，防止切换 tab 后切回来 dt 过大导致逻辑崩坏 (如 0.1s)
        const safeDt = Math.min(dt, 0.1);

        // 更新所有系统
        for (const system of this.systems) {
            system.update(safeDt);
        }

        this.animationId = requestAnimationFrame(this.loop);
    }
}
