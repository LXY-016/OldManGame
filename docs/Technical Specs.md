# 技术架构与规范文档 (Technical Architecture & Specifications)

## 1. 技术栈选型 (Technology Stack)

### 1.1 前端核心 (Frontend Core)
- **开发语言**: JavaScript (ES6+ Modules)
- **构建工具**: Vite 5.x
- **包管理器**: NPM (随 Node.js LTS)

### 1.2 图形渲染 (Graphics & Rendering)
- **3D 引擎**: Three.js (r160+)
- **渲染管线**: WebGL 2.0
- **相机模式**: OrthographicCamera (实现 2.5D 等轴侧视角)

### 1.3 游戏逻辑与状态 (Game Logic)
- **状态管理**: Vanilla JS Class-based State Management (无第三方状态库，保持轻量)
- **物理/碰撞**: Three.js 内置 Raycaster (用于点击/拖拽检测)
- **动画系统**: GSAP (可选，用于 UI 动效) 或 Three.js 自身动画循环

### 1.4 后端与网络 (Backend & Networking)
- **排行榜 API**: (待定) 建议使用 Serverless 方案 (如 Lambda/Cloud Functions 或 Firebase)
- **数据交互**: Fetch API

### 1.5 UI 架构 (UI Architecture)
- **多层级管理**: 采用 DOM 覆盖层 (Overlay) 方式管理界面。
    - **Layer 0**: `StartScreen` (启动页)
    - **Layer 1**: `HUD` (游戏内数值与按钮)
    - **Layer 2**: `LevelSelect` (关卡选择)
- **管理类**: `UIManager` 负责监听全局状态，控制各 DOM 节点的 `display` 显示/隐藏。

## 2. 工程规范 (Engineering Standards)

### 2.1 目录结构 (Directory Structure)
```
f:/OldManGame/
├── src/                # 源代码目录
│   ├── assets/         # 静态资源 (图片, 模型, 音效)
│   ├── core/           # 游戏核心类 (GameLoop, SceneManager)
│   ├── components/     # 游戏实体组 (Player, NPC, Bubbles)
│   ├── systems/        # 系统逻辑 (InputSystem, DragSystem)
│   ├── ui/             # 2D 界面逻辑 (DOM 操作)
│   ├── utils/          # 工具函数
│   └── main.js         # 入口文件
├── public/             # 公共资源 (favicon, manifest)
├── docs/               # 项目文档 (设计文档, 开发日志)
├── index.html          # 页面入口
└── style.css           # 全局样式
```

### 2.2 命名规范 (Naming Conventions)
- **文件与文件夹 (Files & Directories)**: 
    - 使用 **Title Case with Spaces** (单词首字母大写，使用空格分隔)。
    - 例如: `Game Manager.js`, `Player Controller.js`, `Game Design Overview.md`
- **类名 (Classes)**:
    - 使用 `PascalCase` (大驼峰), 例如: `SocialWorker`, `OldMan`
- **变量与函数**:
    - 使用 `camelCase` (小驼峰), 例如: `initScene()`, `currentScore`
- **常量**:
    - 使用 `UPPER_SNAKE_CASE` (大写下划线), 例如: `MAX_GAME_TIME`, `COLOR_GREEN`

### 2.3 代码风格 (Code Style)
- **注释**: 所有函数和关键逻辑块必须包含**中文注释**。
- **模块化**: 尽量使用 ES Modules (`import`/`export`) 拆分功能模块，避免 `main.js` 过于臃肿。
