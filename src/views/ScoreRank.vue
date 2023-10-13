<template>
  <div>
    <header class="score-rank-class">
      <div>
        <h1>2048 全球排行榜</h1>
      </div>

      <el-radio-group v-model="rankName" size="large" @change="selectRanking">
        <el-radio-button v-model="dayRanking" label="日榜" />
        <el-radio-button v-model="weekRanking" label="周榜" />
        <el-radio-button v-model="monthRanking" label="月榜" />
        <el-radio-button v-model="allRanking" label="总榜" />
        <el-button class="back-to-game-class" @click="backToGame"
          >回到游戏界面</el-button
        >
      </el-radio-group>

      <el-table
        :data="scoreRankData"
        height="800"
        style="width: 90%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="排名" width="50px" />
        <el-table-column prop="createTime" label="记录日期" />
        <el-table-column prop="name" label="玩家昵称" />
        <el-table-column prop="score" label="分数" />
        <el-table-column prop="useTime" label="用时(单位:秒)" />
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

let scoreRankData = ref();
let topStatus = ref(true);
let secondStatus = ref(true);
let thirdStatus = ref(true);
const rankName = ref("日榜");

/**
 * 选择某个排行榜
 */
const selectRanking = (selectRankName) => {
  let data = {
    selectRankName: selectRankName,
  };

  getScoreRankApi(data)
    .then((res) => {
      scoreRankData.value = res.data.data;
      // if (scoreRank.value.length >= 0) {
      //   scoreRankData.value[0].name = "🏆 " + scoreRankData.value[0].name;
      // }

      // if (scoreRank.value.length >= 1) {
      //   scoreRankData.value[1].name = "🥈  " + scoreRankData.value[1].name;
      // }

      // if (scoreRank.value.length >= 2) {
      //   scoreRankData.value[2].name = "🥉  " + scoreRankData.value[2].name;
      // }
    })
    .catch((error) => console.log(error));
};

const tableRowClassName = ({ row, rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 0) {
    return "gold-row";
  } else if (rowIndex === 1) {
    return "silver-row";
  } else if (rowIndex === 2) {
    return "copper-row";
  } else if (rowIndex >= 3 && rowIndex < 10) {
    return "iron-row";
  }
  return "";
};

onMounted(() => {
  let data = {
    selectRankName: "日榜",
  };
  getScoreRankApi(data)
    .then((res) => {
      scoreRankData.value = res.data.data;
      // if (scoreRank.value.length > 0) {
      //   scoreRankData.value[0].name = "🏆 " + scoreRankData.value[0].name;
      // }

      // if (scoreRank.value.length > 1) {
      //   scoreRankData.value[1].name = "🥈  " + scoreRankData.value[1].name;
      // }

      // if (scoreRank.value.length > 2) {
      //   scoreRankData.value[2].name = "🥉  " + scoreRankData.value[2].name;
      // }
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

.el-table .gold-row {
  font-weight: bold;
  --el-table-tr-bg-color: #ffd700;
}

.el-table .silver-row {
  --el-table-tr-bg-color: #c0c0c0;
}

.el-table .copper-row {
  --el-table-tr-bg-color: #b87333;
}
.el-table .iron-row {
  --el-table-tr-bg-color: #d0e7fb;
}

.back-to-game-class {
  margin-left: 80px;
}
</style>
