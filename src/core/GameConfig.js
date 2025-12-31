/**
 * Game Configuration & Core Logic
 * 存储所有游戏核心数值、枚举定义及核心算法
 */

// --- 1. 社工属性定义 (Worker Attributes) ---
export const WorkerAttributes = {
    STRONG: 'Strong',       // 强壮
    TALKATIVE: 'Talkative', // 健谈
    SMART: 'Smart'          // 聪明
};

// --- 2. 事件类型定义 (Event Types) ---
// 对应 Function 1 文档中的 E-01 ~ E-05
export const EventTypes = {
    'E-01': {
        id: 'E-01',
        name: '起居出行',
        desc: '搬重物、扶起跌倒',
        requiredAttr: [WorkerAttributes.STRONG], // 需求: 强壮
        color: '#d97706' // 橙色
    },
    'E-02': {
        id: 'E-02',
        name: '社交互动',
        desc: '聊天解闷、读报',
        requiredAttr: [WorkerAttributes.TALKATIVE], // 需求: 健谈
        color: '#16a34a' // 绿色
    },
    'E-03': {
        id: 'E-03',
        name: '家具维修',
        desc: '换灯泡、修水管',
        requiredAttr: [WorkerAttributes.SMART], // 需求: 聪明
        color: '#2563eb' // 蓝色
    },
    'E-04': {
        id: 'E-04',
        name: '求医治病',
        desc: '陪诊、心理疏导',
        requiredAttr: [WorkerAttributes.TALKATIVE], // 需求: 健谈
        color: '#16a34a'
    },
    'E-05': {
        id: 'E-05',
        name: '紧急健康',
        desc: '突发疾病、晕倒',
        requiredAttr: [WorkerAttributes.STRONG, WorkerAttributes.SMART], // 需求: 强壮 或 聪明
        color: '#dc2626' // 红色 (高危)
    }
};

// --- 3. 游戏规则数值 (Game Rules) ---
export const GameRules = {
    BASE_SERVICE_TIME: 5000, // 基础服务时间 (毫秒)
    PERFECT_MATCH_FACTOR: 0.5, // 完美匹配减免系数 (50% off)
    SCORE_PER_EVENT: 100,      // 单次得分
    SCORE_COMBO_MULTIPLIER: 0.1, // Combo 加成
    SPAWN_INTERVAL_MIN: 3,     // 最小刷怪间隔 (秒)
    SPAWN_INTERVAL_MAX: 7,     // 最大刷怪间隔 (秒)
    MAX_ACTIVE_NPCS: 10        // 最大同屏人数
};

// --- 4. 核心算法 (Core Algorithms) ---

/**
 * 计算服务所需时间
 * @param {string} workerAttr - 社工属性 (WorkerAttributes.STRONG etc.)
 * @param {string} eventId - 事件ID (E-01 etc.)
 * @returns {number} 所需时间 (毫秒)
 */
export function calculateServiceTime(workerAttr, eventId) {
    const event = EventTypes[eventId];
    if (!event) {
        console.error(`Unknown event type: ${eventId}`);
        return GameRules.BASE_SERVICE_TIME;
    }

    // 判定是否匹配
    // 事件的 requiredAttr 是一个数组，只要包含社工属性即视为匹配
    const isMatch = event.requiredAttr.includes(workerAttr);

    if (isMatch) {
        // 完美匹配: 基础时间 * (1 - 减免系数)
        return GameRules.BASE_SERVICE_TIME * (1 - GameRules.PERFECT_MATCH_FACTOR);
    } else {
        // 普通匹配: 基础时间
        return GameRules.BASE_SERVICE_TIME;
    }
}

// --- 简单的自测 (Self Test) ---
// 将在控制台输出测试结果，确保逻辑正确
console.group('GameConfig Self-Test');
console.log('Case 1 (Match): Strong vs E-01', calculateServiceTime(WorkerAttributes.STRONG, 'E-01') === 2500 ? 'PASS' : 'FAIL');
console.log('Case 2 (Mismatch): Talkative vs E-01', calculateServiceTime(WorkerAttributes.TALKATIVE, 'E-01') === 5000 ? 'PASS' : 'FAIL');
console.log('Case 3 (Multi-Req Match): Smart vs E-05', calculateServiceTime(WorkerAttributes.SMART, 'E-05') === 2500 ? 'PASS' : 'FAIL');
console.groupEnd();
