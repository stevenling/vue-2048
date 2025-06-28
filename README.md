# Vue 3 版本的 2048 游戏

一个基于 Vue 3 + TypeScript + Element Plus 开发的现代化 2048 游戏，支持移动端和桌面端。

## 🌟 在线体验

体验地址：[2048.yunhu.wiki](https://2048.yunhu.wiki)

## ✨ 功能特性

### 🎮 游戏功能
- **经典 2048 玩法**：通过方向键或触摸滑动合并相同数字
- **多种主题**：支持默认、青灰、风信紫、琥珀黄、梦幻粉等多种主题
- **音乐播放**：内置多首背景音乐，支持播放/暂停/随机切换
- **计时功能**：记录游戏用时
- **分数统计**：实时显示当前分数

### 🏆 排行榜系统
- **多维度排行**：支持日榜、周榜、月榜、总榜
- **数据持久化**：分数记录保存到服务器
- **排名展示**：前三名特殊标识（金、银、铜）

### 📱 移动端适配
- **响应式设计**：完美适配手机、平板、桌面
- **触摸操作**：支持触摸滑动操作
- **移动端优化**：针对移动设备进行性能优化

### 🎨 界面设计
- **现代化 UI**：基于 Element Plus 组件库
- **主题切换**：多种配色方案可选
- **动画效果**：流畅的合并动画和过渡效果

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vue Router 4** - 官方路由管理器

### UI 组件库
- **Element Plus** - 基于 Vue 3 的组件库
- **Vue3 Draggable Resizable** - 可拖拽调整组件

### 构建工具
- **Vite** - 下一代前端构建工具
- **PostCSS** - CSS 后处理器
- **lib-flexible** - 移动端适配方案

### 状态管理
- **Pinia** - Vue 3 官方推荐的状态管理库
- **Vuex** - 传统状态管理库

### 网络请求
- **Axios** - HTTP 客户端
- **jQuery** - DOM 操作库

### 开发工具
- **unplugin-auto-import** - 自动导入 API
- **unplugin-vue-components** - 自动导入组件
- **vite-plugin-qrcode** - 二维码生成插件

## 📦 安装和运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发环境运行
```bash
# 启动开发服务器
npm run dev

# 或使用 pnpm
pnpm dev
```

开发服务器将在 `http://localhost:5172` 启动

### 生产环境构建
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
vue-2048/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   └── score.js       # 分数相关接口
│   ├── assets/            # 资源文件
│   │   ├── vue.svg        # Vue 图标
│   │   └── 卡农.mp3       # 背景音乐
│   ├── http/              # HTTP 配置
│   │   ├── networkConfig.js  # 网络配置
│   │   └── request.js     # 请求封装
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── store/             # 状态管理
│   │   └── user.ts        # 用户状态
│   ├── type/              # 类型定义
│   │   └── user.d.ts      # 用户类型
│   ├── views/             # 页面组件
│   │   ├── index.vue      # 主游戏页面
│   │   └── ScoreRank.vue  # 排行榜页面
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── docs/                  # 文档
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 🎯 核心功能实现

### 游戏逻辑
- **棋盘初始化**：4x4 网格，随机生成初始数字
- **移动合并**：支持上下左右四个方向的移动和合并
- **分数计算**：每次合并获得相应分数
- **游戏结束判断**：无法移动时游戏结束

### 主题系统
- **CSS 变量**：使用 CSS 自定义属性实现主题切换
- **预设主题**：5 种预设主题配色
- **动态切换**：实时切换主题无需刷新

### 音乐系统
- **多音乐源**：内置 10 首背景音乐
- **随机播放**：支持随机切换音乐
- **循环播放**：音乐结束后自动播放下一首

### 排行榜系统
- **数据接口**：与后端 API 交互
- **多维度排行**：支持不同时间维度的排行榜
- **实时更新**：游戏结束后自动提交分数

## 🚀 部署说明

### 开发环境
1. 克隆项目到本地
2. 安装依赖：`pnpm install`
3. 启动开发服务器：`pnpm dev`
4. 访问 `http://localhost:5172`

### 生产环境
1. 构建项目：`pnpm build`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置服务器支持 SPA 路由

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发流程
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 开发者

- **项目地址**：[GitHub](https://github.com/your-username/vue-2048)
- **在线体验**：[2048.yunhu.wiki](https://2048.yunhu.wiki)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
