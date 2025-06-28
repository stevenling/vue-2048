# 开发指南

本文档为 Vue 2048 游戏项目的开发指南，包含环境搭建、代码规范、开发流程等详细信息。

## 🛠️ 开发环境搭建

### 必需软件

1. **Node.js** (>= 16.0.0)
   - 下载地址：https://nodejs.org/
   - 推荐使用 LTS 版本

2. **包管理器**
   - npm (>= 8.0.0) - Node.js 自带
   - 或 pnpm (>= 7.0.0) - 推荐使用
   ```bash
   npm install -g pnpm
   ```

3. **代码编辑器**
   - VS Code (推荐)
   - 或其他支持 TypeScript 的编辑器

### 项目初始化

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd vue-2048
   ```

2. **安装依赖**
   ```bash
   # 使用 npm
   npm install
   
   # 或使用 pnpm (推荐)
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```

4. **访问项目**
   - 本地地址：http://localhost:5172
   - 局域网地址：http://192.168.31.164:5172

## 📁 项目结构说明

```
vue-2048/
├── public/                 # 静态资源目录
│   └── vite.svg           # Vite 图标
├── src/                   # 源代码目录
│   ├── api/              # API 接口层
│   │   └── score.js      # 分数相关接口
│   ├── assets/           # 资源文件
│   │   ├── vue.svg       # Vue 图标
│   │   └── 卡农.mp3      # 背景音乐文件
│   ├── http/             # HTTP 请求配置
│   │   ├── networkConfig.js  # 网络配置
│   │   └── request.js    # 请求封装
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── store/            # 状态管理
│   │   └── user.ts       # 用户状态管理
│   ├── type/             # TypeScript 类型定义
│   │   └── user.d.ts     # 用户相关类型
│   ├── views/            # 页面组件
│   │   ├── index.vue     # 主游戏页面
│   │   └── ScoreRank.vue # 排行榜页面
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── style.css         # 全局样式
├── docs/                 # 文档目录
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 构建配置
└── README.md             # 项目说明
```

## 🎯 核心功能模块

### 1. 游戏逻辑模块

**文件位置**: `src/views/index.vue`

**主要功能**:
- 棋盘初始化和管理
- 移动和合并逻辑
- 分数计算
- 游戏状态管理

**关键函数**:
```typescript
// 初始化游戏
function initGame()

// 处理键盘事件
function handleKeydown(event: KeyboardEvent)

// 移动和合并逻辑
function moveAndMerge(direction: string)

// 检查游戏结束
function checkGameOver()

// 生成新数字
function generateNewNumber()
```

### 2. 主题系统

**实现方式**: CSS 变量 + JavaScript 控制

**主题配置**:
```css
:root {
  --primary-color: #776e65;
  --background-color: #faf8ef;
  --grid-color: #bbada0;
  --cell-color: #cdc1b4;
}

[data-theme="青灰"] {
  --primary-color: #2c3e50;
  --background-color: #ecf0f1;
  --grid-color: #95a5a6;
  --cell-color: #bdc3c7;
}
```

**主题切换**:
```typescript
function selectTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}
```

### 3. 音乐系统

**功能特性**:
- 多音乐源支持
- 播放/暂停控制
- 随机切换
- 自动循环播放

**音乐列表**:
```typescript
const musicUrlList = [
  'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/Here%20We%20Are%20Again.mp3',
  'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/MELANCHOLY.mp3',
  // ... 更多音乐
];
```

### 4. 排行榜系统

**文件位置**: `src/views/ScoreRank.vue`

**功能特性**:
- 多维度排行（日榜、周榜、月榜、总榜）
- 实时数据更新
- 排名特殊标识

## 📝 代码规范

### TypeScript 规范

1. **类型定义**
   ```typescript
   // 使用 interface 定义对象类型
   interface GameState {
     score: number;
     useTime: number;
     isPlaying: boolean;
   }
   
   // 使用 type 定义联合类型
   type Direction = 'up' | 'down' | 'left' | 'right';
   ```

2. **函数类型**
   ```typescript
   // 明确函数参数和返回值类型
   function calculateScore(mergedCells: number[]): number {
     return mergedCells.reduce((sum, cell) => sum + cell, 0);
   }
   ```

### Vue 3 规范

1. **组件命名**
   ```vue
   <!-- 使用 PascalCase 命名组件 -->
   <template>
     <GameBoard />
     <ScoreDisplay />
   </template>
   ```

2. **Props 定义**
   ```typescript
   interface Props {
     score: number;
     theme?: string;
   }
   
   const props = withDefaults(defineProps<Props>(), {
     theme: '默认'
   });
   ```

3. **事件定义**
   ```typescript
   const emit = defineEmits<{
     gameOver: [score: number];
     scoreUpdate: [newScore: number];
   }>();
   ```

### CSS 规范

1. **命名规范**
   ```css
   /* 使用 kebab-case 命名 */
   .game-board { }
   .score-display { }
   .theme-selector { }
   ```

2. **响应式设计**
   ```css
   /* 移动端优先 */
   .container {
     width: 100%;
     max-width: 400px;
     margin: 0 auto;
   }
   
   /* 桌面端适配 */
   @media (min-width: 768px) {
     .container {
       max-width: 600px;
     }
   }
   ```

## 🔧 开发工具配置

### VS Code 推荐插件

1. **Vue 相关**
   - Vue Language Features (Volar)
   - TypeScript Vue Plugin (Volar)

2. **代码质量**
   - ESLint
   - Prettier
   - Auto Rename Tag

3. **开发效率**
   - Auto Import
   - Path Intellisense
   - GitLens

### VS Code 设置

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true
}
```

## 🚀 开发流程

### 1. 功能开发流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **开发功能**
   - 编写组件代码
   - 添加类型定义
   - 编写样式

3. **测试功能**
   - 本地测试
   - 移动端测试
   - 不同主题测试

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin feature/new-feature
   ```

5. **创建 Pull Request**
   - 描述功能变更
   - 添加测试说明
   - 等待代码审查

### 2. 代码审查要点

- **功能完整性**: 功能是否按需求实现
- **代码质量**: 代码是否清晰、可维护
- **类型安全**: TypeScript 类型是否正确
- **性能考虑**: 是否有性能问题
- **用户体验**: 交互是否流畅

### 3. 测试策略

1. **单元测试**
   ```typescript
   // 游戏逻辑测试
   describe('Game Logic', () => {
     test('should merge same numbers', () => {
       const board = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
       const result = mergeLeft(board);
       expect(result).toEqual([[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
     });
   });
   ```

2. **集成测试**
   - API 接口测试
   - 组件交互测试
   - 路由跳转测试

3. **端到端测试**
   - 完整游戏流程测试
   - 移动端操作测试
   - 主题切换测试

## 📦 构建和部署

### 开发环境构建

```bash
# 启动开发服务器
pnpm dev

# 构建开发版本
pnpm build:dev
```

### 生产环境构建

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

### 部署配置

1. **静态文件部署**
   - 将 `dist` 目录上传到 Web 服务器
   - 配置服务器支持 SPA 路由

2. **CDN 配置**
   - 静态资源使用 CDN 加速
   - 配置缓存策略

3. **环境变量**
   ```bash
   # 生产环境 API 地址
   VITE_API_BASE_URL=https://api.yunhu.wiki
   
   # 开发环境 API 地址
   VITE_API_BASE_URL=http://localhost:3000
   ```

## 🐛 常见问题

### 1. 依赖安装问题

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用 pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. TypeScript 类型错误

```bash
# 检查类型错误
npx vue-tsc --noEmit

# 自动修复类型问题
npx vue-tsc --noEmit --skipLibCheck
```

### 3. 移动端适配问题

- 检查 `lib-flexible` 配置
- 确认 `postcss-pxtorem` 设置
- 测试不同设备尺寸

### 4. API 请求问题

- 检查网络配置
- 确认 CORS 设置
- 验证 API 地址正确性

## 📚 学习资源

### Vue 3 相关
- [Vue 3 官方文档](https://vuejs.org/)
- [Vue Router 4 文档](https://router.vuejs.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

### TypeScript 相关
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vue 3 + TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)

### 构建工具
- [Vite 官方文档](https://vitejs.dev/)
- [Element Plus 组件库](https://element-plus.org/)

### 游戏开发
- [2048 游戏算法](https://github.com/gabrielecirulli/2048)
- [Canvas 游戏开发](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

如有问题，请查看 [Issues](../../issues) 或联系项目维护者。 