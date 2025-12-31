# 游戏启动/主界面需求文档 (PRD)
文档版本: V1.0 | 对应模块: 游戏启动/主菜单 (Start Screen)


## 1. 界面整体概述 (Overview)
此界面为游戏应用启动后的首屏界面（默认进入）。作为玩家的第一印象，该界面主要承担导航作用，结构简洁，聚焦于“开始”与“退出”两个核心操作。

## 1.1. 技术实现方案 (Technical Implementation)
*   **混合架构 (Hybrid)**:
    *   **渲染层 (Canvas Layer)**: Three.js Canvas。渲染 3D 社区背景、角色动画及 Post-Processing (Bloom)。
    *   **UI层 (DOM Layer)**: HTML/CSS Overlay。渲染标题 Logo、操作按钮及弹窗。确保 UI 事件不穿透影响 3D 场景。

## 2. 详细功能需求 (Functional Specifications)

### 2.1. 界面初始化逻辑 (Initialization)
- **触发条件**: 
    - 用户点击游戏图标启动应用后。
    - 从游戏关卡中“返回主菜单”操作后。
- **默认行为**: 
    - 启动后直接加载显示，无需额外操作。
    - 界面常驻，直到玩家触发跳转。

### 2.2. 背景场景 (Background Scene)
- **内容**: 展示社区全景的温馨画面，包含向玩家打招呼的社工角色。
- **动态**: 柔和的光照/泛光效果 (Bloom)，角色带有轻微呼吸动作。详见 `Art Assets.md` [Section 2.1]。

### 2.3. 交互按钮区域 (Interaction Area)

#### A. 开始游戏按钮 (Start Game Button)
- **功能**: 进入游戏核心玩法的入口。
- **交互逻辑**:
    - **点击**: 系统加载“关卡选择界面 (Layer 2)”。
    - **反馈**: 按钮反馈详见 `Art Assets.md` [Section 5.0]。

#### B. 退出游戏按钮 (Exit Game Button)
- **功能**: 关闭应用程序 (Web端通常为关闭标签页或显示提示)。
- **交互逻辑**:
    - **点击**: 执行关闭操作。
    - **防误触**: 弹出二次确认弹窗（Tips: “确定要退出游戏吗？”），包含 [确认] 与 [取消]。

## 3. 界面美术与布局建议 (Visual & Layout)
> 详细视觉风格与素材规范请参考: [Art Assets.md](Art%20Assets.md)

    - **游戏标题 (Title)**: 显著位置（中上方）展示 Logo/名称。
    - **按钮排列**: 屏幕下方或中部垂直居中排列。
    - **视觉层级**: “开始游戏”按钮为主操作。详见 `Art Assets.md` [Section 2.1]。
