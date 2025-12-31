import { defineConfig } from 'vite';

// Custom plugin to transform markdown tables in gameconfig.md to JSON
const gameConfigPlugin = () => {
    return {
        name: 'vite-plugin-game-config',
        enforce: 'pre',
        transform(code, id) {
            // Normalize path
            const normalizedId = id.replace(/\\/g, '/').toLowerCase();

            // LOOSE MATCHING: Check if it contains the filename. 
            // This handles '.../docs/gameconfig.md' AND '.../docs/gameconfig.md?import'
            if (!normalizedId.includes('docs/gameconfig.md')) return;

            console.log('[Vite Plugin] Transforming:', id);

            const lines = code.split('\n');
            const config = {
                levels: [],
                workers: [],
                events: [],
                global: {}
            };

            let currentSection = null;
            let headers = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line.includes('2. 关卡难度配置')) {
                    currentSection = 'levels';
                    continue;
                } else if (line.includes('3. 社工相关配置')) {
                    currentSection = 'workers';
                    continue;
                } else if (line.includes('4. 老人事件相关配置')) {
                    currentSection = 'events';
                    continue;
                } else if (line.includes('5. 全局游戏设置')) {
                    currentSection = 'global';
                    continue;
                }

                if (currentSection && line.startsWith('|')) {
                    if (line.includes('---')) continue;

                    const parts = line.split('|').map(s => s.trim()).filter(s => s !== '');

                    if (line.includes('(') && line.includes(')')) {
                        headers = parts.map(header => {
                            const match = header.match(/\((.*?)\)/);
                            return match ? match[1] : header;
                        });
                        continue;
                    }

                    if (headers.length > 0) {
                        const rowData = {};
                        parts.forEach((part, index) => {
                            if (headers[index]) {
                                const num = parseFloat(part);
                                rowData[headers[index]] = !isNaN(num) && isFinite(part) ? num : part;
                            }
                        });

                        if (currentSection === 'global') {
                            if (rowData.key && rowData.value !== undefined) {
                                config.global[rowData.key] = rowData.value;
                            }
                        } else {
                            config[currentSection].push(rowData);
                        }
                    }
                }
            }

            return `export default ${JSON.stringify(config)};`;
        }
    };
};

export default defineConfig({
    plugins: [gameConfigPlugin()],
    server: {
        host: '0.0.0.0'
    }
});
