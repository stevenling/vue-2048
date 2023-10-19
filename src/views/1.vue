
<template>
<div id="grid-container">
    <div>
      <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
        <div
          v-for="(cell, columnIndex) in row"
          :key="rowIndex + columnIndex"
          class="grid-cell"
          :id="'grid-cell-' + rowIndex + '-' + columnIndex"
          <span
            v-if = "false"
            v-text="cell"
          ></span>
        ></div>
      </div>

      <!-- <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
        <div v-for="(cell, columnIndex) in row" :key="columnIndex">
          <span
            class="number-cell"
            :id="'number-cell-' + rowIndex + '-' + columnIndex"
            v-show="shouldShowCell(rowIndex, columnIndex)"
            v-text="cell"
          ></span>
        </div>
      </div> -->
    </div>
</div>



<div id="grid-container"
      @touchstart="touchstart()"
      @touchend="touchend()">
</template>

<script setup lang="ts">
  // 初始化格子内容
let chessBoard: number[][] = reactive([
  [2, 256, 512, 65536],
  [4, 128, 1024, 32768],
  [8, 64, 2048, 16384],
  [16, 32, 4096, 8192],
]);
</scrpt>

