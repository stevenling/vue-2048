<template>
  <!-- <div tabindex="0" @keyup.up="clickKeyUp"> -->
  <div>
    <header>
      <h1>2048</h1>
      <el-button id="newgamebutton" @click="startNewGame">开始新游戏</el-button>
      <p id="score">score:{{ score }}</p>
    </header>

    <el-dialog
      v-model="centerDialogVisible"
      title="游戏结束"
      width="30%"
      align-center
    >
      <span>你的分数：{{ score }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-input
            class="el-input-class"
            v-model="playerName"
            placeholder="请输入你的昵称"
            style="margin-bottom: 20px"
            clearable
          />
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitScore">
            提交到全球排行榜
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div id="grid-container" ref="gridContainerRef">
      <div>
        <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
          <div
            v-for="(cell, columnIndex) in row"
            :key="columnIndex"
            class="grid-cell"
            :id="'grid-cell-' + rowIndex + '-' + columnIndex"
          ></div>
        </div>

        <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex" v-cloak>
          <div v-for="(cell, columnIndex) in row" :key="columnIndex" v-cloak>
            <span
              class="number-cell"
              :id="'number-cell-' + rowIndex + '-' + columnIndex"
              v-show="shouldShowCell(rowIndex, columnIndex)"
              >{{ cell }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div @keyup.up="clickKeyUp" /> -->
  <!-- <input v-on:keypress.q="quit"> -->
  <!-- <input @keyup.page-down="onPageDown" /> -->

  <div>
    <table>
      <tr v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
        <td v-for="(cell, columnIndex) in row" :key="columnIndex">
          <div>
            {{ cell }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";
import $ from "jquery";
import { insertScoreApi } from "/src/api/score";

let chessBoard: number[][] = reactive([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

let gridContainerRef = ref(null);

let score = ref(0);

let centerDialogVisible = ref(false);

let playerName = ref();

onMounted(() => {
  document.addEventListener("keyup", clickKeyUp);

  // 初始化棋盘格;
  initChessboard();
  // 在棋盘中产生数字
  generateOneNumber();
  generateOneNumber();
});

async function submitScore() {
  let scoreData = {
    score: 0,
    playerName: "",
  };
  scoreData.score = score.value;
  scoreData.playerName = playerName.value;
  let res = await insertScoreApi(scoreData);
  if (res.data !== null) {
    ElMessage.success("提交分数成功, 希望你玩的开心");
  } else {
    ElMessage.error("失败");
  }
}

const startNewGame = () => {
  // 初始化棋盘格;
  initChessboard();
  // 在棋盘中产生数字
  generateOneNumber();
  generateOneNumber();
  score.value = 0;
};

/**
 * 大于 0 才显示棋盘上的数字
 */
const shouldShowCell = (rowIndex, columnIndex) => {
  return chessBoard[rowIndex][columnIndex] > 0;
};

function getPosTop(i, j) {
  return 20 + i * 120;
}

function getPosLeft(i, j) {
  return 20 + j * 120;
}

/**
 * 判断是否能向上移动
 *
 * @return 可以返回 true, 不能返回 false
 */
function canMoveTop() {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] != 0) {
        if (
          chessBoard[i - 1][j] == 0 ||
          chessBoard[i - 1][j] == chessBoard[i][j]
        ) {
          // 可以向上移动
          return true;
        }
      }
    }
  }
  // 不能向上移动
  return false;
}

/**
 * 判断垂直障碍物是否存在
 *
 * @return 存在 false, 不存在 true
 */
function noBlockVer(col, row1, row2) {
  for (let i = row1 + 1; i < row2; i++) {
    // 存在障碍物
    if (chessBoard[i][col] !== 0) {
      return false;
    }
  }
  return true;
}

/**
 * 判断水平障碍物是否存在
 *
 * @return 存在 false, 不存在 true
 */
function noBlockHor(row, col1, col2) {
  for (var i = col1 + 1; i < col2; i++) {
    // 存在障碍物
    if (chessBoard[row][i] !== 0) {
      return false;
    }
  }
  return true;
}

/**
 * 显示移动动画
 */
function showMoveAnimation(fromX, fromY, toX, toY) {
  let numberCell = document.getElementById(
    "number-cell-" + fromX + "-" + fromY
  );

  // numberCell.style.top = getPosTop(toX, toY) + "px";
  // numberCell.style.left = getPosLeft(toX, toY) + "px";

  // let timer = setTimeout(() => {
  //   //设置延迟执行
  //   numberCell.style.top = getPosTop(toX, toY) + "px";
  //   numberCell.style.left = getPosLeft(toX, toY) + "px";
  // }, 160);

  numberCell.animate(
    {
      top: getPosTop(toX, toY) + "px",
      left: getPosLeft(toX, toY) + "px",
    },
    50
  );
}

async function moveRight() {
  if (!canMoveRight())
    //如果不能移动
    return false;

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      if (chessBoard[i][j] != 0) {
        for (var k = j + 1; k < 4; k++) {
          if (chessBoard[i][k] == 0 && noBlockHor(i, j, k)) {
            //上侧为空
            //move
            showMoveAnimation(i, j, i, k);
            chessBoard[i][k] = chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            continue;
          } else if (
            chessBoard[i][k] == chessBoard[i][j] &&
            noBlockHor(i, j, k)
          ) {
            //move
            //add
            showMoveAnimation(i, j, i, k);
            chessBoard[i][k] = 2 * chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            score.value = score.value + chessBoard[i][k];

            continue;
          }
        }
      }
    }
  }
}

async function moveDown() {
  if (!canMoveDown())
    //如果不能移动
    return false;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 4; j++) {
      if (chessBoard[i][j] != 0) {
        for (var k = i + 1; k < 4; k++) {
          if (chessBoard[k][j] == 0 && noBlockVer(j, i, k)) {
            //下侧为空
            //move
            showMoveAnimation(i, j, k, j);
            chessBoard[k][j] = chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            continue;
          } else if (
            chessBoard[k][j] == chessBoard[i][j] &&
            noBlockVer(j, i, k)
          ) {
            //move
            //add
            showMoveAnimation(i, j, k, j);
            chessBoard[k][j] = 2 * chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            score.value = score.value + chessBoard[k][j];
            continue;
          }
        }
      }
    }
  }
}

/**
 * 往上移动
 */
async function moveTop() {
  if (!canMoveTop()) {
    // 如果不能移动
    console.log("无法移动");
    return false;
  }

  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] !== 0) {
        for (let k = 0; k < i; k++) {
          if (chessBoard[k][j] === 0 && noBlockVer(j, k, i)) {
            //上侧为空，不存在障碍物
            // move
            showMoveAnimation(i, j, k, j);
            // 移动过去
            chessBoard[k][j] = chessBoard[i][j];
            // 之前的消失
            chessBoard[i][j] = 0;
            continue;
          } else if (
            chessBoard[k][j] === chessBoard[i][j] &&
            noBlockVer(j, k, i)
          ) {
            //move
            //add
            showMoveAnimation(i, j, k, j);
            chessBoard[k][j] = 2 * chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; // 之前的消失
            score.value = score.value + chessBoard[k][j];
            continue;
          }
        }
      }
    }
  }
}

/**
 * 往左移动
 */
async function moveLeft() {
  // 如果不能移动
  if (!canMoveLeft()) {
    return false;
  }
  // debugger;
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (chessBoard[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (chessBoard[i][k] == 0 && noBlockHor(i, k, j)) {
            //左侧为空
            // move
            showMoveAnimation(i, j, i, k);
            chessBoard[i][k] = chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            continue;
          } else if (
            chessBoard[i][k] == chessBoard[i][j] &&
            noBlockHor(i, k, j)
          ) {
            //move
            //add
            showMoveAnimation(i, j, i, k);
            chessBoard[i][k] = 2 * chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            score.value = score.value + chessBoard[i][k];
            continue;
          }
        }
      }
    }
  }
}

function afterMove() {
  // 延时会有残影
  // setTimeout(() => {
  //   //设置延迟执行
  //   updateBoardView();
  // }, 150);
  updateBoardView();

  // generateOneNumber();

  // isGameOver();

  setTimeout(() => {
    //设置延迟执行
    generateOneNumber();
  }, 160);

  setTimeout(() => {
    //设置延迟执行
    isGameOver();
  }, 300);
}

/**
 * 点击上下左右按键
 */
async function clickKeyUp(e) {
  await nextTick(() => {
    var keyCode = window.event ? e.keyCode : e.which;
    // 点击上键
    if (keyCode === 38) {
      // 这里执行相应的行为动作
      if (moveTop()) {
        afterMove();
      }
      return;
    }

    // 点击左键
    if (keyCode === 37) {
      if (moveLeft()) {
        afterMove();
      }
      return;
    }

    if (keyCode === 39) {
      if (moveRight()) {
        afterMove();
      }
      return;
    }

    if (keyCode === 40) {
      if (moveDown()) {
        afterMove();
      }
      return;
    }
  });
}

/**
 * 根据格子数值获取背景颜色
 */
function getNumberBackgroundColor(number) {
  switch (number) {
    case 2:
      return "#eee4da";
      break;
    case 4:
      return "#ede0c8";
      break;
    case 8:
      return "#f2b179";
      break;
    case 16:
      return "#f59563";
      break;
    case 32:
      return "#f67c5f";
      break;
    case 64:
      return "#f65e3b";
      break;
    case 128:
      return "#edcf72";
      break;
    case 256:
      return "#edcc61";
      break;
    case 512:
      return "#9c0";
      break;
    case 1024:
      return "#33b5e5";
      break;
    case 2048:
      return "#09c";
      break;
    case 4096:
      return "#a6c";
      break;
    case 8092:
      return "#93c";
      break;
  }
  return "black";
}

/**
 * 判断棋盘中还有空间吗
 */
function isChessBoardExistSpace() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 还有空间
      if (chessBoard[i][j] == 0) {
        return false;
      }
    }
  }
  // ElMessage.error("没有空间了");
  return true;
}

/**
 * 获取数字颜色
 */
function getNumberColor(number) {
  if (number <= 4 && number >= 2) {
    return "#776e65";
  }
  return "white";
}

/**
 * 重绘界面
 */
function updateBoardView() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let theNumberCell = document.getElementById("number-cell-" + i + "-" + j);

      if (chessBoard[i][j] !== 0) {
        theNumberCell.style.width = "100px";
        theNumberCell.style.height = "100px";
        theNumberCell.style.top = getPosTop(i, j) + "px";
        theNumberCell.style.left = getPosLeft(i, j) + "px";
        theNumberCell.style.backgroundColor = getNumberBackgroundColor(
          chessBoard[i][j]
        );
        theNumberCell.style.color = getNumberColor(chessBoard[i][j]);
      }
    }
  }
}

/**
 * 初始化棋盘
 */
function initChessboard() {
  // 设置位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let gridCell = document.getElementById("grid-cell-" + i + "-" + j);
      gridCell.style.top = getPosTop(i, j) + "px";
      gridCell.style.left = getPosLeft(i, j) + "px";
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      chessBoard[i][j] = 0;
    }
  }
  updateBoardView();
  score.value = 0;
}

/**
 * 判断是否可以移动
 *
 * @returns
 */
function noMove() {
  // 只要有一个方向可以移动，就能移动
  if (canMoveDown() || canMoveLeft() || canMoveRight() || canMoveTop()) {
    return false;
  }

  // 无法移动
  return true;
}

/**
 * 判断是否能向左移动
 *
 * @returns 可以返回 true 不能返回 false
 */
function canMoveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (chessBoard[i][j] != 0) {
        if (
          chessBoard[i][j - 1] == 0 ||
          chessBoard[i][j - 1] == chessBoard[i][j]
        )
          return true; //可以向左移动
      }
    }
  }
  // 不能向左移动
  return false;
}

/**
 * 判断是否能向右移动
 *
 * @return 可以返回 true 不能返回 false
 */
function canMoveRight() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (chessBoard[i][j] != 0) {
        if (
          chessBoard[i][j + 1] == 0 ||
          chessBoard[i][j] == chessBoard[i][j + 1]
        )
          // 可以向右移动
          return true;
      }
    }
  }
  return false; //不能向右移动
}

/**
 * 判断是否能向下移动 可以返回true 不能 返回false
 */
function canMoveDown() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] != 0) {
        if (
          chessBoard[i + 1][j] == 0 ||
          chessBoard[i + 1][j] == chessBoard[i][j]
        )
          return true; //可以向下移动
      }
    }
  }
  return false; //不能向下移动
}

/**
 * 判断棋盘中还有空间吗
 */
function noSpace() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 还有空间
      if (chessBoard[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 判断游戏是否结束
 */
async function isGameOver() {
  if (noSpace() && noMove()) {
    ElMessage.error("游戏结束");

    centerDialogVisible.value = true;
  }
}

/**
 * 用动画显示生成数字的过程
 */
function showNumberWithAnimation(i, j, randNumber) {
  let numberCell = document.getElementById("number-cell-" + i + "-" + j);
  if (numberCell !== null) {
    // 获取随机数值的背景颜色
    numberCell.style.top = getPosTop(i, j) + "px";
    numberCell.style.left = getPosLeft(i, j) + "px";
    numberCell.style.width = "100px";
    numberCell.style.height = "100px";

    // numberCell.style.width = "100px";
    // numberCell.style.height = "100px";
    // numberCell.animate(
    //   {
    //     // width: "100px",
    //     // height: "100px",
    //     top: getPosTop(i, j) + "px",
    //     left: getPosLeft(i, j) + "px",
    //   },
    //   200
    // );

    let backgroundColor = getNumberBackgroundColor(randNumber);
    numberCell.style.backgroundColor = backgroundColor;

    let color = getNumberColor(randNumber);

    numberCell.style.color = color;

    numberCell.textContent = randNumber;
  }
}

/**
 * 随机生成数字
 * @returns
 */
function generateOneNumber() {
  //棋盘中还有空间就生成数字
  if (isChessBoardExistSpace()) {
    // 没有空间返回 true
    // ElMessage.error("没有空间可以生成格子了");
    return false;
  }

  // 随机位置
  // 随机生成 0-4 的位置不包括 4
  let randx = parseInt(Math.floor(Math.random() * 4));
  let randy = parseInt(Math.floor(Math.random() * 4));

  //判断位置是否可用
  while (true) {
    if (chessBoard[randx][randy] === 0) {
      // 位置可用跳出死循环，不可用继续找
      break;
    }
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }

  // window.alert(board[randx][randy]);
  // 随机生成 2 或 4，他们的概率相同
  var randNumber = Math.random() > 0.5 ? 2 : 4;

  // 在随机位置显示随机数字
  chessBoard[randx][randy] = randNumber;
  // console.log("randNumber = ", randNumber);

  // ElMessage.success(randNumber);
  // 显示动画效果
  showNumberWithAnimation(randx, randy, randNumber);
  // return true;
}
</script>

<style scoped>
header {
  display: block;
  margin: 0 auto;
  width: 300px;
  text-align: center;
}

[v-cloak] {
  display: none;
}

header h1 {
  font-family: "Arial Rounded MT Bold";
  font-size: 30px;
  font-weight: bold;
}

header #newgamebutton {
  display: block;
  margin: 20px auto;
  width: 100px;
  padding: 10px 10px;
  background-color: green;

  font-family: Arial;
  color: white;
  border-radius: 10px;
  text-decoration: none;
}

header #newgamebutton:hover {
  background-color: cornflowerblue;
}

header p {
  font-family: Arial;
  font-size: 25px;
  margin: 5px auto;
}

#grid-container {
  width: 460px;
  height: 460px;
  padding: 20px;
  margin: 30px auto;
  background-color: #bbada0;
  border-radius: 10px;
  position: relative;
}

.grid-cell {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background-color: #ccc0b3;
  position: absolute;
}

.number-cell {
  font-weight: bold;
  font-family: Arial;
  border-radius: 6px;
  font-size: 60px;
  line-height: 100px;
  text-align: center;
  position: absolute;
}
</style>
