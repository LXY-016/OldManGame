/**
 * UI Manager
 * 核心 UI 管理器，负责管理所有界面层级 (Layer 0, 1, 2) 的显示与隐藏。
 */
export class UIManager {
    constructor() {
        this.layers = {
            0: document.getElementById('layer-0'), // 启动界面
            1: document.getElementById('layer-1'), // 游戏界面
            2: document.getElementById('layer-2')  // 关卡选择
        };
    }

    /**
     * 初始化 UI 系统
     */
    init() {
        this.hideAll();
        this.showLayer(0); // 默认显示启动界面
    }

    /**
     * 显示指定层级
     * @param {number} layerId - 层级 ID (0, 1, 2)
     */
    showLayer(layerId) {
        this.hideAll();
        if (this.layers[layerId]) {
            this.layers[layerId].style.display = 'flex';
        } else {
            console.warn(`UI Manager: Layer ${layerId} 未找到`);
        }
    }

    /**
     * 隐藏所有层级
     */
    hideAll() {
        for (const key in this.layers) {
            if (this.layers[key]) {
                this.layers[key].style.display = 'none';
            }
        }
    }
}

export const uiManager = new UIManager();
