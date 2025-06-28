# API 文档

本文档描述了 Vue 2048 游戏中使用的所有 API 接口。

## 基础信息

- **基础URL**: 根据环境配置
- **请求格式**: JSON
- **响应格式**: JSON
- **认证方式**: 无（公开接口）

## 接口列表

### 1. 提交分数

提交游戏分数到排行榜系统。

**接口地址**: `POST /2048/insertScore`

**请求参数**:
```typescript
interface InsertScoreRequest {
  name: string;        // 玩家昵称
  score: number;       // 游戏分数
  useTime: number;     // 游戏用时（秒）
}
```

**请求示例**:
```javascript
{
  "name": "玩家昵称",
  "score": 2048,
  "useTime": 120
}
```

**响应格式**:
```typescript
interface ApiResponse<T> {
  code: number;        // 响应状态码
  message: string;     // 响应消息
  data: T;            // 响应数据
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "id": 123,
    "name": "玩家昵称",
    "score": 2048,
    "useTime": 120,
    "createTime": "2024-01-01 12:00:00"
  }
}
```

### 2. 获取排行榜

获取指定时间维度的排行榜数据。

**接口地址**: `POST /2048/getScoreRank`

**请求参数**:
```typescript
interface GetScoreRankRequest {
  selectRankName: '日榜' | '周榜' | '月榜' | '总榜';  // 排行榜类型
}
```

**请求示例**:
```javascript
{
  "selectRankName": "日榜"
}
```

**响应格式**:
```typescript
interface ScoreRankItem {
  id: number;          // 记录ID
  name: string;        // 玩家昵称
  score: number;       // 游戏分数
  useTime: number;     // 游戏用时（秒）
  createTime: string;  // 创建时间
}

interface GetScoreRankResponse {
  code: number;
  message: string;
  data: ScoreRankItem[];
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "玩家A",
      "score": 8192,
      "useTime": 300,
      "createTime": "2024-01-01 12:00:00"
    },
    {
      "id": 2,
      "name": "玩家B",
      "score": 4096,
      "useTime": 240,
      "createTime": "2024-01-01 11:30:00"
    }
  ]
}
```

### 3. 获取随机句子

获取随机励志句子，用于游戏结束时的鼓励。

**接口地址**: `GET /app/sentence/get`

**请求参数**: 无

**响应格式**:
```typescript
interface GetSentenceResponse {
  code: number;
  message: string;
  data: {
    content: string;   // 句子内容
    author?: string;   // 作者（可选）
  };
}
```

**响应示例**:
```javascript
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "content": "成功不是偶然的，而是必然的。",
    "author": "未知"
  }
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 错误响应格式

当请求失败时，响应格式如下：

```typescript
interface ErrorResponse {
  code: number;        // 错误状态码
  message: string;     // 错误消息
  data: null;         // 数据为空
}
```

**错误响应示例**:
```javascript
{
  "code": 400,
  "message": "参数错误：玩家昵称不能为空",
  "data": null
}
```

## 使用示例

### JavaScript/TypeScript 使用示例

```javascript
import { insertScoreApi, getScoreRankApi, getSentenceApi } from '../api/score';

// 提交分数
const submitScore = async (name, score, useTime) => {
  try {
    const response = await insertScoreApi({
      name,
      score,
      useTime
    });
    console.log('分数提交成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('分数提交失败:', error);
    throw error;
  }
};

// 获取排行榜
const getScoreRank = async (rankType) => {
  try {
    const response = await getScoreRankApi({
      selectRankName: rankType
    });
    console.log('排行榜数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取排行榜失败:', error);
    throw error;
  }
};

// 获取随机句子
const getRandomSentence = async () => {
  try {
    const response = await getSentenceApi();
    console.log('随机句子:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取句子失败:', error);
    throw error;
  }
};
```

### Vue 3 Composition API 使用示例

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { insertScoreApi, getScoreRankApi } from '../api/score';

const scoreRankData = ref([]);
const loading = ref(false);

// 提交分数
const submitScore = async (name, score, useTime) => {
  loading.value = true;
  try {
    const response = await insertScoreApi({ name, score, useTime });
    ElMessage.success('分数提交成功！');
    return response.data;
  } catch (error) {
    ElMessage.error('分数提交失败：' + error.message);
    throw error;
  } finally {
    loading.value = false;
  }
};

// 获取排行榜
const loadScoreRank = async (rankType = '日榜') => {
  loading.value = true;
  try {
    const response = await getScoreRankApi({ selectRankName: rankType });
    scoreRankData.value = response.data;
  } catch (error) {
    ElMessage.error('获取排行榜失败：' + error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadScoreRank();
});
</script>
```

## 注意事项

1. **请求频率限制**: 建议控制请求频率，避免过于频繁的API调用
2. **错误处理**: 所有API调用都应该包含适当的错误处理逻辑
3. **数据验证**: 在发送请求前验证数据的完整性和格式
4. **网络状态**: 考虑网络连接不稳定的情况，添加重试机制
5. **用户体验**: 在API调用期间显示加载状态，提升用户体验

## 更新日志

- **v1.0.0** - 初始版本，包含基础的分数提交和排行榜功能
- **v1.1.0** - 添加随机句子接口，增强游戏体验
- **v1.2.0** - 优化响应格式，统一错误处理 