import { uiManager } from './UI Manager.js';

/**
 * Start Screen (Layer 0)
 * 启动界面逻辑控制器
 */
export class StartScreen {
    constructor() {
        this.container = document.getElementById('layer-0');
        this.startBtn = document.getElementById('btn-start');
        this.exitBtn = document.getElementById('btn-exit');

        this.initListeners();
    }

    initListeners() {
        // 开始游戏按钮
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                console.log('Start Game: 跳转至 Layer 2 (关卡选择)');
                // TODO: 真正的跳转逻辑将在 Step 2 实现
                uiManager.showLayer(2);
            });
        }

        // 退出游戏按钮
        if (this.exitBtn) {
            this.exitBtn.addEventListener('click', () => {
                if (window.confirm("确定要退出游戏吗？")) {
                    console.log('Exit Confirmed');
                    // Web 环境下 window.close() 可能被浏览器拦截，仅作演示
                    window.close();
                    alert("已尝试退出 (浏览器可能拦截关闭操作)");
                }
            });
        }
    }
}
