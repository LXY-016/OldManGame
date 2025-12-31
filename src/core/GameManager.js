import { GameRules, EventTypes, calculateServiceTime } from './GameConfig.js';
import { gameLevelUI } from '../ui/Game Level.js';
// ... imports

/**
 * Game Manager
 * 游戏全局状态与逻辑控制器 (单例)
 */
class GameManager {
    constructor() {
        this.score = 0;
        this.totalTime = 120; // 120秒
        this.currentTime = 0;
        this.isPlaying = false;

        this.activeServices = new Map(); // Key: NPC_UUID, Value: { remainingTime, totalTime }

        // 刷怪相关
        this.spawnTimer = 0;
        this.onSpawnRequest = null; // 回调函数: (eventType) => void
    }

    /**
     * 设置刷怪回调
     */
    setSpawnCallback(callback) {
        this.onSpawnRequest = callback;
    }

    /**
     * 开始关卡
     */
    startLevel(levelId) {
        console.log(`GameManager: Level ${levelId} Started!`);
        this.score = 0;
        this.currentTime = this.totalTime;
        this.isPlaying = true;
        this.activeServices.clear();

        // 重置刷怪计时
        this.resetSpawnTimer();

        gameLevelUI.updateScore(this.score);
        this.updateHUDTimer();
    }

    resetSpawnTimer() {
        // 随机生成下一个刷怪时间
        const min = GameRules.SPAWN_INTERVAL_MIN;
        const max = GameRules.SPAWN_INTERVAL_MAX;
        this.spawnTimer = Math.random() * (max - min) + min;
    }

    /**
     * 游戏主循环 (每帧调用)
     * @param {number} dt - Delta Time (秒)
     */
    update(dt) {
        if (!this.isPlaying) return;

        // 1. 更新倒计时
        this.currentTime -= dt;
        if (this.currentTime <= 0) {
            this.endLevel(false);
            return;
        }
        this.updateHUDTimer();

        // 2. 刷怪逻辑
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.triggerSpawn();
            this.resetSpawnTimer();
        }

        // 3. 更新服务进度

        // 2. 更新服务进度
        this.activeServices.forEach((service, npcUuid) => {
            service.remainingTime -= dt;

            // 更新进度 UI (如果有的话，比如气泡倒计时)
            // bubbleSystem.updateProgress(npcUuid, service.remainingTime / service.totalTime);

            if (service.remainingTime <= 0) {
                this.completeService(npcUuid, service.npc);
            }
        });
    }

    triggerSpawn() {
        if (this.onSpawnRequest) {
            // 随机挑选一个事件类型
            const keys = Object.keys(EventTypes);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            console.log(`GameManager: Spawning ${randomKey}`);
            this.onSpawnRequest(randomKey);
        }
    }

    updateHUDTimer() {
        const minutes = Math.floor(this.currentTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
        gameLevelUI.updateTimer(`${minutes}:${seconds}`);
    }

    /**
     * 处理玩家服务请求 (拖拽投放)
     */
    handleService(npc, workerAttr) {
        if (!this.isPlaying) return;
        if (this.activeServices.has(npc.uuid)) {
            console.log("该目标正在服务中...");
            return;
        }

        const eventType = npc.userData.event;
        const duration = calculateServiceTime(workerAttr, eventType) / 1000; // 毫秒转秒

        console.log(`开始服务: ${workerAttr} -> ${eventType}, 耗时: ${duration}s`);

        // 记录服务状态
        this.activeServices.set(npc.uuid, {
            remainingTime: duration,
            totalTime: duration,
            npc: npc
        });

        // UI 反馈: 气泡变更为“服务中”状态
        if (bubbleSystem) {
            bubbleSystem.updateBubbleContent(npc, '⏳');
        }
    }

    completeService(npcUuid, npc) {
        this.activeServices.delete(npcUuid);

        // 加分
        this.score += GameRules.SCORE_PER_EVENT;
        gameLevelUI.updateScore(this.score);

        // 移除气泡和 NPC (或让 NPC 离开)
        console.log("服务完成！");
        if (bubbleSystem) {
            bubbleSystem.updateBubbleContent(npc, '✅');
            // 延迟移除
            setTimeout(() => {
                bubbleSystem.removeBubble(npc);
                // 简单的移除 NPC 逻辑 (直接看不见)
                npc.visible = false;
                // 真正的销毁应该在 Main.js 或 SceneManager 中处理，这里简化
            }, 1000);
        }
    }

    endLevel(isWin) {
        this.isPlaying = false;
        console.log(`Game Over! Win: ${isWin}`);
        alert(isWin ? "关卡胜利！" : "时间到！");
        // TODO: 跳回结算界面或主菜单
    }
}

export const gameManager = new GameManager();
