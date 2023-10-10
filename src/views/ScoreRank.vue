<template>
  <!-- <div tabindex="0" @keyup.up="clickKeyUp"> -->
  <div>
    <header>
      <h1>全球排行榜</h1>
      <!-- <el-button id="newgamebutton" @click="startNewGame">开始新游戏</el-button> -->
      <!-- <p id="score">score:{{ score }}</p> -->
    </header>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="记录日期" width="180" />
      <el-table-column prop="name" label="玩家昵称" width="180" />
      <el-table-column prop="address" label="分数" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";
import $ from "jquery";
import { insertScoreApi } from "/src/api/score";


onMounted(() => {
    getScoreRankApi()
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));


});

</script>

<style scoped></style>
