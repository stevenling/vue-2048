<template>
  <div>
    <header class="score-rank-class">
      <h1>2048 全球排行榜</h1>
      <el-button @click="backToGame">回到游戏界面</el-button>
      <el-table :data="scoreRankData" stripe style="width: 50%">
        <el-table-column type="index" label="排名" />
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

<style scoped>
.score-rank-class {
  display: flex;
  flex-direction: column;
  align-items: center; /* 交叉轴对齐方式 */
}
</style>
