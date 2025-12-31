/**
 * Game Level.js
 * 负责渲染每一个关卡的 HUD 和 UI。
 * 
 * 核心功能:
 * 1. HUD: 显示分数和倒计时。
 * 2. 社工栏: 渲染社工头像和 **冷却遮罩**。
 * 3. 结算弹窗: 胜利/失败。
 */
export class GameLevelUI {
    constructor(levelManager) {
        this.levelManager = levelManager;
        this.container = null;
        this.workerElements = {}; // 存储社工 DOM 引用 { id: element }
    }

    mount() {
        console.log('Mounting Game Level UI...');
        // 创建 UI 容器
        this.container = document.createElement('div');
        this.container.id = 'game-level-ui';
        this.container.style.position = 'absolute';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.pointerEvents = 'none'; // 让点击穿透到 canvas (除了按钮)
        document.body.appendChild(this.container);

        // 1. HUD (Top Left)
        this.createHUD();

        // 2. 社工栏 (Bottom)
        this.createWorkerBar();
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.style.position = 'absolute';
        hud.style.top = '20px';
        hud.style.left = '20px';
        hud.style.color = 'white';
        hud.style.fontFamily = 'monospace';
        hud.style.fontSize = '20px';
        hud.innerHTML = `
            Score: <span id="ui-score">0</span><br>
            Time: <span id="ui-time">60</span>
        `;
        this.container.appendChild(hud);

        this.scoreEl = document.getElementById('ui-score');
        this.timeEl = document.getElementById('ui-time');
    }

    createWorkerBar() {
        const bar = document.createElement('div');
        bar.style.position = 'absolute';
        bar.style.bottom = '20px';
        bar.style.left = '50%';
        bar.style.transform = 'translateX(-50%)';
        bar.style.display = 'flex';
        bar.style.gap = '20px';
        bar.style.pointerEvents = 'auto'; // 允许点击

        this.levelManager.workers.forEach(worker => {
            const btn = document.createElement('div');
            btn.style.width = '60px';
            btn.style.height = '60px';
            btn.style.backgroundColor = '#ddd';
            btn.style.border = '2px solid #fff';
            btn.style.borderRadius = '50%';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.position = 'relative';
            btn.style.cursor = 'grab';
            btn.innerText = worker.id; // MVP: 直接显示 ID 名字

            // 冷却遮罩
            const mask = document.createElement('div');
            mask.style.position = 'absolute';
            mask.style.width = '100%';
            mask.style.height = '100%';
            mask.style.borderRadius = '50%';
            mask.style.backgroundColor = 'rgba(0,0,0,0.7)';
            mask.style.display = 'none'; // 初始隐藏
            // 简单的文本倒计时 (MVP)
            mask.style.color = 'white';
            mask.style.display = 'flex';
            mask.style.justifyContent = 'center';
            mask.style.alignItems = 'center';
            mask.innerText = '';

            btn.appendChild(mask);
            bar.appendChild(btn);

            this.workerElements[worker.id] = { btn, mask };

            // 稍微加一点点击反馈
            btn.addEventListener('mousedown', () => {
                if (worker.cooldown > 0) {
                    console.log('UI: Worker is cooling down!');
                }
            });
        });

        this.container.appendChild(bar);
    }

    update() {
        if (!this.container) return;

        // 更新 HUD
        this.scoreEl.innerText = this.levelManager.score;
        this.timeEl.innerText = Math.ceil(this.levelManager.timeRemaining);

        // 更新社工冷却状态
        this.levelManager.workers.forEach(worker => {
            const el = this.workerElements[worker.id];
            if (!el) return;

            if (worker.cooldown > 0) {
                // 显示遮罩
                el.mask.style.display = 'flex';
                el.mask.innerText = worker.cooldown.toFixed(1);
                el.btn.style.cursor = 'not-allowed';
                el.btn.style.filter = 'grayscale(100%)';
            } else {
                // 隐藏遮罩
                el.mask.style.display = 'none';
                el.btn.style.cursor = 'grab';
                el.btn.style.filter = 'none';
            }
        });

        // 检查胜利条件 (MVP简单弹窗)
        if (this.levelManager.levelStatus === 'finished' && !this.showedResult) {
            this.showedResult = true;
            alert(`Game Over! Score: ${this.levelManager.score}`);
        }
    }
}
