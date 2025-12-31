import { uiManager } from './UI Manager.js';

/**
 * Game Level UI (Layer 1)
 * 游戏主界面逻辑：管理 HUD、社工栏、暂停等
 */
export class GameLevelUI {
    constructor() {
        this.container = document.getElementById('layer-1');
        this.scoreEl = document.getElementById('hud-score');
        this.timerEl = document.getElementById('hud-timer');
        this.workerContainer = document.querySelector('.worker-bar');
        this.exitBtn = document.getElementById('btn-level-exit');

        // 模拟数据 (社工小队)
        this.workers = [
            { id: 101, name: "王大力", attr: "Strong", color: "#d97706", desc: "强壮" },
            { id: 102, name: "李秀兰", attr: "Talkative", color: "#16a34a", desc: "健谈" },
            { id: 103, name: "张智", attr: "Smart", color: "#2563eb", desc: "聪明" }
        ];

        this.init();
    }

    init() {
        this.renderWorkers();
        this.initListeners();
        // 初始化数据
        this.updateScore(0);
        this.updateTimer("02:00");
    }

    renderWorkers() {
        if (!this.workerContainer) return;

        this.workerContainer.innerHTML = '';
        this.workers.forEach(w => {
            const card = document.createElement('div');
            card.className = `worker-card attr-${w.attr.toLowerCase()}`;
            card.dataset.id = w.id;
            card.style.borderColor = w.color;

            // 简单的头像占位 + 属性文字
            card.innerHTML = `
                <div class="worker-avatar" style="background-color: ${w.color}">
                    <span>${w.name[0]}</span>
                </div>
                <div class="worker-name">${w.name}</div>
                <div class="worker-attr" style="color: ${w.color}">${w.desc}</div>
            `;

            this.workerContainer.appendChild(card);
        });
    }

    initListeners() {
        // 退出按钮 -> 返回启动页 (Layer 0)
        if (this.exitBtn) {
            this.exitBtn.addEventListener('click', () => {
                if (window.confirm("确定要中止挑战并退出吗？")) {
                    uiManager.showLayer(0);
                }
            });
        }
    }

    // --- API ---

    updateScore(score) {
        if (this.scoreEl) this.scoreEl.textContent = score;
    }

    updateTimer(timeStr) {
        if (this.timerEl) this.timerEl.textContent = timeStr;
    }
}

export const gameLevelUI = new GameLevelUI();
