/**
 * LevelManager.js
 * 负责管理关卡全局状态。
 * 
 * 职责:
 * 1. 记录服务人数 (Score) 和 关卡倒计时 (Timer)。
 * 2. 管理社工 CD 状态 (Cooldown)。
 * 3. 判定游戏输赢。
 */
export class LevelManager {
    constructor() {
        this.score = 0;
        this.timeRemaining = 0;
        this.targetCount = 0;
        this.levelStatus = 'idle'; // 'playing', 'finished'

        // 存储社工状态
        // 结构: { id: string, cooldown: number, maxCooldown: number }
        this.workers = [];
    }

    /**
     * 初始化关卡
     * @param {Object} config - 来自 GameConfig.levels[i]
     * @param {Array} workerConfig - 来自 GameConfig.workers
     */
    init(levelConfig, workerConfigs) {
        this.score = 0;
        // 确保数值类型正确
        this.timeRemaining = Number(levelConfig.timeLimit);
        this.targetCount = Number(levelConfig.targetCount);
        this.levelStatus = 'playing';

        // 初始化社工状态
        this.workers = workerConfigs.map(config => ({
            id: config.id,
            cooldown: 0, // 初始无冷却
            maxCooldown: Number(config.cooldown)
        }));

        console.log('LevelManager initialized:', {
            time: this.timeRemaining,
            target: this.targetCount,
            workers: this.workers
        });
    }

    /**
     * 每帧更新
     * @param {number} dt - delta time in seconds
     */
    update(dt) {
        if (this.levelStatus !== 'playing') return;

        // 1. 倒计时逻辑
        if (this.timeRemaining > 0) {
            this.timeRemaining -= dt;
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.checkWinCondition();
            }
        }

        // 2. 社工冷却自动恢复逻辑 (Critical)
        this.workers.forEach(worker => {
            if (worker.cooldown > 0) {
                worker.cooldown -= dt;
                if (worker.cooldown < 0) {
                    worker.cooldown = 0; // 归零，恢复可用
                    // TODO: 可以触发一个回调通知 UI
                }
            }
        });
    }

    /**
     * 增加服务人数
     */
    incrementScore() {
        if (this.levelStatus !== 'playing') return;
        this.score++;
        console.log('Score updated:', this.score);

        // 实时检查是否提前胜利 (可选，或者等时间结束)
        // MVP: 也要检查是否达到目标
    }

    /**
     * 触发指定社工的冷却
     * @param {string} workerId 
     */
    startWorkerCooldown(workerId) {
        const worker = this.workers.find(w => w.id === workerId);
        if (worker) {
            worker.cooldown = worker.maxCooldown;
            console.log(`Worker ${workerId} cooldown started: ${worker.maxCooldown}s`);
        }
    }

    /**
     * 获取指定社工的状态
     */
    getWorkerStatus(workerId) {
        return this.workers.find(w => w.id === workerId);
    }

    /**
     * 结算判定
     */
    checkWinCondition() {
        this.levelStatus = 'finished';
        if (this.score >= this.targetCount) {
            console.log('Result: VICTORY');
            // TODO: 通知 UI 显示胜利
        } else {
            console.log('Result: DEFEAT');
            // TODO: 通知 UI 显示失败
        }
    }
}
