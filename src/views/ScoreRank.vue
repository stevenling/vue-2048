<template>
  <div>
    <header class="score-rank-class">
      <h1>2048 全球排行榜</h1>
      <el-button @click="backToGame">回到游戏界面</el-button>
      <el-table
        :data="scoreRankData"
        stripe
        height="800"
        style="width: 80%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="排名" width="80px" />
        <el-table-column prop="createTime" label="记录日期" />
        <el-table-column prop="name" label="玩家昵称" />
        <el-table-column prop="score" label="分数" />
      </el-table>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";
import $ from "jquery";
import { getScoreRankApi } from "/src/api/score";
import { useRoute, useRouter } from "vue-router";

name: "ScoreRank";

const scoreRankData = ref();

const tableRowClassName = ({ row, rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};

onMounted(() => {
  getScoreRankApi()
    .then((res) => {
      scoreRankData.value = res.data.data;
    })
    .catch((error) => console.log(error));
});

const router = useRouter();
const backToGame = () => {
  router.push({
    path: "/",
  });
};
</script>

<style>
.score-rank-class {
  display: flex;
  flex-direction: column;
  align-items: center; /* 交叉轴对齐方式 */
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
