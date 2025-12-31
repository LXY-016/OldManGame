/**
 * Level Select.js
 * 关卡选择界面 (Layer 2)
 */
export class LevelSelect {
    constructor(onLevelSelected) {
        this.onLevelSelected = onLevelSelected;
        this.container = null;
    }

    mount() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.backgroundColor = '#EEEEEE';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.overflowX = 'scroll'; // 横向滚动

        // 模拟 5 个关卡
        for (let i = 1; i <= 5; i++) {
            const levelBtn = document.createElement('div');
            levelBtn.style.minWidth = '200px';
            levelBtn.style.height = '300px';
            levelBtn.style.margin = '0 50px';
            levelBtn.style.backgroundColor = 'white';
            levelBtn.style.display = 'flex';
            levelBtn.style.justifyContent = 'center';
            levelBtn.style.alignItems = 'center';
            levelBtn.style.cursor = 'pointer';
            levelBtn.innerText = `Level ${i}`;

            levelBtn.onclick = () => {
                this.unmount();
                if (this.onLevelSelected) this.onLevelSelected(i);
            };

            this.container.appendChild(levelBtn);
        }

        document.body.appendChild(this.container);
    }

    unmount() {
        if (this.container) {
            document.body.removeChild(this.container);
            this.container = null;
        }
    }
}
