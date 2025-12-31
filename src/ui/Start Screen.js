/**
 * Start Screen.js
 * 启动界面 (Layer 0)
 */
export class StartScreen {
    constructor(onStart) {
        this.onStart = onStart;
        this.container = null;
    }

    mount() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.backgroundColor = '#87CEEB'; // Sky Blue
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';

        const title = document.createElement('h1');
        title.innerText = 'Old Man Game';
        title.style.color = 'white';

        const btn = document.createElement('button');
        btn.innerText = 'Start Game';
        btn.style.padding = '20px 40px';
        btn.style.fontSize = '24px';
        btn.onclick = () => {
            this.unmount();
            if (this.onStart) this.onStart();
        };

        this.container.appendChild(title);
        this.container.appendChild(btn);
        document.body.appendChild(this.container);
    }

    unmount() {
        if (this.container) {
            document.body.removeChild(this.container);
            this.container = null;
        }
    }
}
