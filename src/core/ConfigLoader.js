import rawConfig from '../../docs/gameconfig.md?raw';

/**
 * ConfigLoader.js
 * 负责在运行时解析 Markdwon 配置文件。
 * 替代不稳定的 Vite 插件方案。
 */

function parseConfig(markdown) {
    const lines = markdown.split('\n');
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

        // 1. Detect Sections (Loose match)
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

        // 2. Parse Tables
        if (currentSection && line.startsWith('|')) {
            if (line.includes('---')) continue;

            const parts = line.split('|').map(s => s.trim()).filter(s => s !== '');

            // Header detection
            if (line.includes('(') && line.includes(')')) {
                headers = parts.map(header => {
                    const match = header.match(/\((.*?)\)/);
                    return match ? match[1] : header;
                });
                continue;
            }

            // Data parsing
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

    console.log('Runtime Config Parsed:', config);
    return config;
}

const GameConfig = parseConfig(rawConfig);
export default GameConfig;
