# Game Configuration (游戏配置文档)

本文档旨在统一管理游戏内的核心数值配置，方便后续调整平衡性。

## 1. 技术实现方案 (Technical Implementation)

> **核心原理**: 我们采用 **Config-as-Code** 方案。Vite 插件 (`vite-plugin-game-config`) 会拦截本文档的加载请求，将 Markdown 表格自动转换为 JSON 对象。

### 1.1 数据结构映射 (Data Mapping)
前端代码中导入本文档 (`import GameConfig from './gameconfig.md'`) 后，将获得以下数据结构：

*   `GameConfig.levels`: **[Array]** 对应 [Section 2 - Level Difficulty](#2-关卡难度配置-level-difficulty)
*   `GameConfig.workers`: **[Array]** 对应 [Section 3 - Social Worker Config](#3-社工相关配置-social-worker-config)
*   `GameConfig.events`: **[Array]** 对应 [Section 4 - Elderly Event Config](#4-老人事件相关配置-elderly-event-config)
*   `GameConfig.global`: **[Object]** 对应 [Section 5 - Global Game Settings](#5-全局游戏设置-global-game-settings)

---

## 2. 关卡难度配置 (Level Difficulty)

**对应变量**: `GameConfig.levels` (Array)

| 关卡 (id) | 时间限制 (timeLimit) | 刷新频率 (spawnRate) | 同屏上限 (maxOnScreen) | 困难事件概率 (hardEventProb) | 可携带社工 (maxWorkers) | 通关目标 (targetCount) | 备注 (note) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Level 1** | 60 | 8.0 | 2 | 100% : 0% | 3 | 3 | 新手引导，节奏缓慢 |
| **Level 2** | 60 | 7.0 | 3 | 100% : 0% | 3 | 4 | 稍微加快节奏 |
| **Level 3** | 60 | 6.0 | 3 | 90% : 10% | 4 | 5 | 首次出现紧急事件 |
| **Level 4** | 60 | 5.5 | 4 | 85% : 15% | 4 | 6 | 压力测试 |
| **Level 5** | 60 | 5.0 | 4 | 80% : 20% | 4 | 7 | 阶段性挑战 |
| **Level 6** | 60 | 4.5 | 5 | 75% : 25% | 5 | 8 | 解锁第5个社工槽位 |
| **Level 7** | 60 | 4.0 | 5 | 70% : 30% | 5 | 10 | 高压环境 |
| **Level 8** | 60 | 3.5 | 6 | 60% : 40% | 5 | 12 | 极速反应考验 |
| **Level 9** | 60 | 3.0 | 6 | 50% : 50% | 6 | 14 | 混乱前夕 |
| **Level 10** | 60 | 2.5 | 8 | 40% : 60% | 6 | 18 | 最终挑战，地狱难度 |

---

## 3. 社工相关配置 (Social Worker Config)

**对应变量**: `GameConfig.workers` (Array)

*   **Mapping**: `cooldown` defaults to **3.0**, `reductionFactor` defaults to **0.5**.

| 社工代号 (id) | 主属性 (mainAttribute) | 对应图标建议 (icon) | 属性描述 (description) | 冷却时间 (cooldown) | 减免系数 (reductionFactor) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Worker-A** | **STR** | 拳头/手臂 | 擅长体力劳动，搬运重物 | 3.0 | 0.5 |
| **Worker-B** | **CHA** | 气泡/笑脸 | 擅长沟通交流，安抚情绪 | 3.0 | 0.5 |
| **Worker-C** | **INT** | 灯泡/眼睛 | 擅长技术维修，急救知识 | 3.0 | 0.5 |

---

## 4. 老人事件相关配置 (Elderly Event Config)

**对应变量**: `GameConfig.events` (Array)

| 事件ID (id) | 事件名称 (name) | 基础耗时 (baseDuration) | 响应时间 (tRequest) | 需要属性 (requiredAttribute) | 描述 (description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **E-01** | 起居出行 | 5.0 | 20.0 | **STR** | 搬重物、下楼梯、扶起跌倒。 |
| **E-02** | 社交互动 | 6.0 | 25.0 | **CHA** | 孤独求聊、读报纸、纠纷调解。 |
| **E-03** | 家具维修 | 8.0 | 30.0 | **INT** | 换灯泡、修水管、电视调试。 |
| **E-04** | 求医陪诊 | 7.0 | 25.0 | **CHA** | 陪同就医、取药、心理疏导。 |
| **E-05** | **紧急健康** | 10.0 | **15.0** | **STR/INT** | 突发疾病、晕倒。**高危事件！** |

---

## 5. 全局游戏设置 (Global Game Settings)

**对应变量**: `GameConfig.global` (Object)

| 配置项Key (key) | 配置值 (value) | 说明 (description) |
| :--- | :--- | :--- |
| **InitialUnlockedLevels** | 1 | 初始解锁的关卡数量。 |
| **MaxWorkersPerElder** | 1 | 同一个老人同时只能被多少个社工服务。 |
| **ScrollSensitivity** | 1.0 | 关卡选择界面的滑动灵敏度。 |
