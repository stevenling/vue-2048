<template>
  <!-- <div tabindex="0" @keyup.up="clickKeyUp"> -->
  <!-- @click="showScoreRank" -->
  <div>
    <header>
      <h1>2048</h1>
      <el-button type="primary" @click="startNewGame">开始新游戏</el-button>
      <el-button type="warning" @click="showScoreRank">查看排行榜</el-button>
      <p class="score-class" id="score">score:{{ score }}</p>
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
            :key="rowIndex + columnIndex"
            class="grid-cell"
            :id="'grid-cell-' + rowIndex + '-' + columnIndex"
          ></div>
        </div>

        <!-- v-cloak -->
        <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
          <div v-for="(cell, columnIndex) in row" :key="columnIndex">
            <span
              class="number-cell"
              :id="'number-cell-' + rowIndex + '-' + columnIndex"
              v-show="shouldShowCell(rowIndex, columnIndex)"
              v-text="cell"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <table>
    <tr v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
      <td v-for="(cell, columnIndex) in row" :key="columnIndex">
        <div>
          {{ cell }}
        </div>
      </td>
    </tr>
  </table> -->
  <!-- <div>

  </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";
import $ from "jquery";
import { insertScoreApi } from "../api/score";
import { useRoute, useRouter } from "vue-router";

// 初始化格子内容
let chessBoard: number[][] = reactive([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

let gridContainerRef = ref(null);
// 分数
let score = ref(0);
let centerDialogVisible = ref(false);
// 玩家昵称
let playerName = ref();
// 路由
const router = useRouter();

onMounted(() => {
  // 添加键盘事件
  document.addEventListener("keyup", clickKeyUp);

  // 初始化棋盘格;
  initChessboard();
  // 在棋盘中产生数字
  generateOneNumber();
  generateOneNumber();
});

/**
 * 点击跳转到查看排行榜页面
 */
function showScoreRank() {
  router.push({
    path: "/scoreRank",
  });
}

/**
 * 提交分数
 */
async function submitScore() {
  let scoreData = {
    score: 0,
    playerName: "",
  };
  if (playerName.value === "" || playerName.value === undefined) {
    playerName.value = "匿名用户";
  }
  scoreData.score = score.value;
  scoreData.playerName = playerName.value;

  insertScoreApi(scoreData)
    .then((res) => {
      ElMessage.success("提交分数成功, 希望你玩的开心^_^");
      centerDialogVisible.value = false;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("提交分数失败");
    });
}

/**
 * 点击开始新游戏
 */
const startNewGame = () => {
  document.addEventListener("keyup", clickKeyUp);

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
 * 1. 上面那个格子的值为 0，表示是空的，因此可以移动过去
 * 2. 上面那个格子的值与当前值相同，表示可以合并，因此也可以移动过去
 *
 * @return 可以返回 true, 不能返回 false
 */
function canMoveTop() {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] !== 0) {
        // debugger
        if (
          chessBoard[i - 1][j] === 0 ||
          chessBoard[i - 1][j] === chessBoard[i][j]
        ) {
          // 可以向上移动
          return true;
        }
      }
    }
  }
  // 不能向上移动
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      console.log(chessBoard[i][j]);
    }
  }
  return false;
}

/**
 * 判断垂直障碍物是否存在
 * 在同一列的 startRow 和 endRow 中间只要有一个值不为 0，说明垂直方向存在障碍物
 *
 * @return 存在 false, 不存在 true
 */
function noBlockVer(col, startRow, endRow) {
  for (let i = startRow + 1; i < endRow; i++) {
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
function noBlockHor(row, startCol, endCol) {
  for (let i = startCol + 1; i < endCol; i++) {
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

  let fromTopValue = getPosTop(fromX, fromY) + "px";
  let fromleftValue = getPosLeft(fromX, fromY) + "px";
  // console.log(fromTopValue + " " + fromleftValue);

  let topValue = getPosTop(toX, toY) + "px";
  let leftValue = getPosLeft(toX, toY) + "px";

  console.log(
    fromTopValue + " " + fromleftValue + "->" + topValue + " " + leftValue
  );

  // 200ms 动画效果不好
  // 50 ms 好
  if (numberCell) {
    numberCell.animate(
      {
        top: getPosTop(toX, toY) + "px",
        left: getPosLeft(toX, toY) + "px",
      },
      50
    );
  }
}

/**
 * 向右移动
 */
function moveRight() {
  if (!canMoveRight()) {
    // 如果不能向右移动
    return false;
  }

  // 对左侧三列进行处理
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      if (chessBoard[i][j] !== 0) {
        for (let k = 3; k >= j + 1; k--) {
          if (chessBoard[i][k] === 0 && noBlockHor(i, j, k)) {
            showMoveAnimation(i, j, i, k);
            chessBoard[i][k] = chessBoard[i][j];
            chessBoard[i][j] = 0;
            continue;
          } else if (
            chessBoard[i][k] === chessBoard[i][j] &&
            noBlockHor(i, j, k)
          ) {
            showMoveAnimation(i, j, i, k);
            // 移动过去，合并
            chessBoard[i][k] = 2 * chessBoard[i][j];
            // 之前的消失
            chessBoard[i][j] = 0;
            score.value = score.value + chessBoard[i][k];
            continue;
          }
        }
      }
    }
  }
  return true;
}

/**
 * 向下移动
 */
function moveDown() {
  if (!canMoveDown()) {
    // 如果不能移动
    return false;
  }

  // 对前三行进行判断
  for (let i = 2; i >= 0; i--) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] !== 0) {
        for (let k = 3; k >= i + 1; k--) {
          //下侧为空
          if (chessBoard[k][j] === 0 && noBlockVer(j, i, k)) {
            showMoveAnimation(i, j, k, j);
            chessBoard[k][j] = chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            continue;
          } else if (
            chessBoard[k][j] === chessBoard[i][j] &&
            noBlockVer(j, i, k)
          ) {
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
  return true;
}

/**
 * 往上移动
 */
function moveTop() {
  if (!canMoveTop()) {
    // 如果不能移动
    debugger;
    console.log("无法向上移动");
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
            break;
          }
        }
      }
    }
  }
  return true;
}

/**
 * 往左移动
 */
function moveLeft() {
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
            chessBoard[i][k] = chessBoard[i][j]; //移动过去
            chessBoard[i][j] = 0; //之前的消失
            showMoveAnimation(i, j, i, k);
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
  return true;
}

/**
 * 移动之后的处理，更新界面，生成一个新的格子，判断游戏是否结束
 */
function afterMove() {
  // 延时会有残影
  // setTimeout(() => {
  //   //设置延迟执行
  //   updateBoardView();
  // }, 150);
  updateBoardView();

  setTimeout(() => {
    generateOneNumber();
  }, 160);

  setTimeout(() => {
    isGameOver();
  }, 300);
}

/**
 * 点击上下左右按键
 */
function clickKeyUp(e) {
  // nextTick(() => {
  var keyCode = e.keyCode;
  // 点击上键
  if (keyCode === 38) {
    // 这里执行相应的行为动作
    let moveTopStatus = moveTop();
    if (moveTopStatus) {
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
  // });
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
    case 8192:
      return "#93c";
      break;
    case 16384:
      return "#aa60a6";
      break;
  }
  return "black";
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
 * 判断棋盘中还有空间吗
 */
function isChessBoardExistSpace() {
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
 * 重绘界面
 */
function updateBoardView() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let theNumberCell = document.getElementById("number-cell-" + i + "-" + j);
      if (chessBoard[i][j] !== 0 && theNumberCell) {
        theNumberCell.style.width = "100px";
        theNumberCell.style.height = "100px";
        theNumberCell.style.top = getPosTop(i, j) + "px";
        theNumberCell.style.left = getPosLeft(i, j) + "px";
        if (chessBoard[i][j] >= 1024 && chessBoard[i][j] <= 10000) {
          theNumberCell.style.fontSize = "38px";
        } else if (chessBoard[i][j] > 10000 && chessBoard[i][j] < 100000) {
          theNumberCell.style.fontSize = "30px";
        } else if (chessBoard[i][j] > 100000) {
          theNumberCell.style.fontSize = "28px";
        } else {
          theNumberCell.style.fontSize = "60px";
        }
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
      if (gridCell) {
        gridCell.style.top = getPosTop(i, j) + "px";
        gridCell.style.left = getPosLeft(i, j) + "px";
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      chessBoard[i][j] = 0;
    }
  }
  // chessBoard[0][0] = 2048;
  updateBoardView();
  score.value = 0;
}

/**
 * 判断是否可以移动
 *
 * @returns false 可以移动, true 无法移动
 */
function noMove() {
  // 只要有一个方向可以移动，就能移动
  if (canMoveDown() || canMoveLeft() || canMoveRight() || canMoveTop()) {
    return false;
  }
  debugger;

  // 无法移动
  console.log("完全无法移动");
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      console.log(chessBoard[i][j]);
    }
  }
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
      if (chessBoard[i][j] !== 0) {
        if (
          chessBoard[i][j - 1] === 0 ||
          chessBoard[i][j - 1] === chessBoard[i][j]
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
      if (chessBoard[i][j] !== 0) {
        if (
          chessBoard[i][j + 1] === 0 ||
          chessBoard[i][j] === chessBoard[i][j + 1]
        )
          // 可以向右移动
          return true;
      }
    }
  }
  return false; //不能向右移动
}

/**
 * 判断是否能向下移动 可以返回 true 不能返回 false
 */
function canMoveDown() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (chessBoard[i][j] !== 0) {
        if (
          chessBoard[i + 1][j] === 0 ||
          chessBoard[i + 1][j] === chessBoard[i][j]
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
    document.removeEventListener("keyup", clickKeyUp);
    // for (let i = 0; i < 4; i++) {
    //   for (let j = 0; j < 4; j++) {
    //     chessBoard[i][j] = 0;
    //   }
    // }
  }
}

/**
 * 用动画显示生成数字的过程
 */
function showNumberWithAnimation(i, j, randNumber) {
  let numberCell = document.getElementById("number-cell-" + i + "-" + j);
  if (numberCell) {
    // 获取随机数值的背景颜色
    numberCell.style.top = getPosTop(i, j) + "px";
    numberCell.style.left = getPosLeft(i, j) + "px";
    // numberCell.style.width = "100px";
    // numberCell.style.height = "100px";

    let backgroundColor = getNumberBackgroundColor(randNumber);
    numberCell.style.backgroundColor = backgroundColor;

    let color = getNumberColor(randNumber);

    numberCell.style.color = color;

    // numberCell.animate(
    //   {
    //     // width: "100px",
    //     // height: "100px",
    //     top: getPosTop(i, j) + "px",
    //     left: getPosLeft(i, j) + "px",
    //   },
    //   150
    // );
    numberCell.style.width = "100px";
    numberCell.style.height = "100px";
    numberCell.textContent = randNumber;
  }
}

/**
 * 随机生成数字
 *
 * @returns
 */
function generateOneNumber() {
  //棋盘中还有空间就生成数字
  if (isChessBoardExistSpace()) {
    // 没有空间返回 false
    return false;
  }

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

  // 随机生成 2 或 4，他们的概率相同
  var randNumber = Math.random() > 0.5 ? 2 : 4;

  // 在随机位置显示随机数字
  chessBoard[randx][randy] = randNumber;

  // 显示动画效果
  showNumberWithAnimation(randx, randy, randNumber);
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

.score-class {
  margin-top: 20px;
}
</style>
