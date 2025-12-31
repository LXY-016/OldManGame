import { uiManager } from './UI Manager.js';

/**
 * Level Select (Layer 2)
 * 关卡选择界面逻辑
 */
export class LevelSelect {
    constructor() {
        this.container = document.getElementById('layer-2');
        this.levelMap = document.querySelector('.level-map');
        this.backBtn = document.querySelector('.btn-back');

        // 模拟存档数据
        this.levels = [
            { id: 1, name: "小区门口", unlocked: true, stars: 0 },
            { id: 2, name: "公园长椅", unlocked: false, stars: 0 },
            { id: 3, name: "王大爷家", unlocked: false, stars: 0 }
        ];

        this.init();
    }

    init() {
        this.renderLevels();
        this.initListeners();
    }

    renderLevels() {
        if (!this.levelMap) return;

        this.levelMap.innerHTML = ''; // 清空现有内容

        this.levels.forEach(level => {
            const node = document.createElement('div');
            node.className = `level-node ${level.unlocked ? 'unlocked' : 'locked'}`;
            node.dataset.id = level.id;

            // 节点内容
            let content = `<div class="level-id">${level.id}</div>`;
            content += `<div class="level-name">${level.name}</div>`;
            if (!level.unlocked) {
                content += `<div class="lock-icon">🔒</div>`;
            }

            node.innerHTML = content;
            this.levelMap.appendChild(node);
        });
    }

    initListeners() {
        // 关卡节点点击事件
        this.levelMap.addEventListener('click', (e) => {
            const node = e.target.closest('.level-node');
            if (node) {
                const id = parseInt(node.dataset.id);
                const levelData = this.levels.find(l => l.id === id);

                if (levelData && levelData.unlocked) {
                    this.enterLevel(id);
                } else {
                    this.playLockedFeedback(id);
                }
            }
        });

        // 返回按钮
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                uiManager.showLayer(0); // 返回主界面
            });
        }
    }

    enterLevel(levelId) {
        console.log(`Entering Level ${levelId}...`);
        uiManager.showLayer(1); // 跳转游戏界面
    }

    playLockedFeedback(levelId) {
        console.log(`Level ${levelId} is locked!`);
        // 这里后续可以加震动动画
        alert("该关卡尚未解锁！请先通关前置关卡。");
    }
}
