<template>
  <div>
    <header>
      <h2>2048</h2>
      <div class="menu-class">
        <el-button type="primary" @click="startNewGame">开始新游戏</el-button>
        <el-button color="#626aef" @click="showScoreRank">查看排行榜</el-button>
        <Service
          class="music-icon-class"
          v-if="isPlaying"
          :src="musicUrl"
          @click="onPlay" />
        <el-tooltip
          class="box-item"
          content="随机一首"
          placement="top-start"
          v-if="isPlaying">
          <ArrowRight class="music-icon-class" @click="onSwitchMusic" />
        </el-tooltip>
        <MuteNotification
          class="music-icon-class"
          v-else-if="!isPlaying"
          :src="musicUrl"
          @click="onPlay" />
      </div>

      <el-radio-group v-model="defaultTheme" size="small" @change="selectTheme">
        <el-radio-button @keydown="handleKeydown" label="默认" />
        <el-radio-button @keydown="handleKeydown" label="青灰" />
        <el-radio-button @keydown="handleKeydown" label="风信紫" />
        <el-radio-button @keydown="handleKeydown" label="琥珀黄" />
        <el-radio-button @keydown="handleKeydown" label="梦幻粉" />
      </el-radio-group>

      <p class="score-class" id="score">score:{{ score }}</p>
      <div class="use-time-class">用时：{{ useTime }} 秒</div>
    </header>

    <el-dialog
      v-model="centerDialogVisible"
      title="游戏结束"
      width="80%"
      align-center>
      <span>你的分数：{{ score }}</span>
      <span> 用时：{{ useTime }} 秒</span>
      <template #footer>
        <span class="dialog-footer">
          <el-input
            class="el-input-class"
            v-model="playerName"
            placeholder="请输入你的昵称"
            style="margin-bottom: 20px"
            clearable />
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitScore"
            >提交到排行榜</el-button
          >
        </span>
      </template>
    </el-dialog>

    <div>
      <div
        id="grid-container"
        @touchstart="touchstart()"
        @touchmove="touchmove()"
        @touchend="touchend()">
        <div>
          <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
            <div
              v-for="(cell, columnIndex) in row"
              :key="rowIndex + columnIndex"
              class="grid-cell"
              :id="'grid-cell-' + rowIndex + '-' + columnIndex"></div>
          </div>

          <div v-for="(row, rowIndex) in chessBoard" :key="rowIndex">
            <div
              v-for="(cell, columnIndex) in row"
              :key="rowIndex + columnIndex">
              <span
                class="number-cell"
                :id="'number-cell-' + rowIndex + '-' + columnIndex"
                v-show="shouldShowCell(rowIndex, columnIndex)"
                v-text="cell"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-text color="#626aef" class="about-author-class" @click="showAuthor"
      >关于开发者</el-text
    >
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { ElNotification } from 'element-plus';
  import { h } from 'vue';
  import { nextTick } from 'vue';
  import $ from 'jquery';
  import { insertScoreApi } from '../api/score';
  import { getSentenceApi } from '../api/score';

  import { useRoute, useRouter } from 'vue-router';
  import Vue3DraggableResizable from 'vue3-draggable-resizable';
  import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

  import { useCounterStore } from '../store/user';
  import { getLocalStorageData } from '../store/user';

  const defaultTheme = ref('默认');

  // 初始化格子内容
  let chessBoard: number[][] = reactive([
    [2, 256, 512, 65536],
    [4, 128, 1024, 32768],
    [8, 64, 2048, 16384],
    [16, 32, 4096, 8192],
  ]);

  // 分数
  let score = ref(0);
  let centerDialogVisible = ref(false);
  // 玩家昵称
  let playerName = ref();
  // 路由
  const router = useRouter();
  // 用时
  let useTime = ref(0);
  // 棋盘宽高
  const chessBoardWidth = ref(80);
  const chessBoardHeight = ref(80);

  // 本地音乐
  const musicUrl =
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E5%8D%A1%E5%86%9C.mp3';

  const musicUrlList = [
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/Here%20We%20Are%20Again.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/MELANCHOLY.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/Nomak%20-%20Moon%20Flow.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/Snigellin%20-%20Sakura%20Tears.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E4%BD%90%E8%97%A4%E5%BA%B7%E5%A4%AB%20-%20%E5%A4%9C%E6%98%8E.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E5%8D%A1%E5%86%9C.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E5%9F%8E%E5%8D%97%E8%8A%B1%E5%B7%B2%E5%BC%80-%E4%B8%89%E4%BA%A9%E5%9C%B0.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E5%BC%A0%E5%AE%87%E6%A1%A6%20-%20%E4%BC%98%E7%BE%8E%E7%9A%84%E5%B0%8F%E8%B0%83.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/%E5%A4%8F%E6%81%8B.mp3',
    'https://book-1253628880.cos.ap-nanjing.myqcloud.com/music/Summer.mp3',
  ];

  let isPlaying = ref(false);
  let audio = ref(null);
  /**
   * 点击播放音乐
   */
  function onPlay() {
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      if (audio.value === null || audio.value === undefined) {
        audio.value = new Audio(musicUrl);
      }
      audio.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }

  /**
   * 随机一首
   */
  const onSwitchMusic = () => {
    let randomIndex = Math.floor(Math.random() * musicUrlList.length);
    let currentMusicUrl = musicUrlList[randomIndex];
    audio.value.pause();

    let frontMusic = audio.value.src;
    while (currentMusicUrl === frontMusic) {
      randomIndex = Math.floor(Math.random() * musicUrlList.length);
      currentMusicUrl = musicUrlList[randomIndex];
    }

    // 更改音频源
    audio.value.src = currentMusicUrl;
    // 重新加载新的音频
    audio.value.load();
    // 播放新歌曲
    audio.value.play();
  };

  /**
   * el-radio 阻止上下左右切换
   */
  function handleKeydown(event) {
    // 阻止上下左右箭头键触发选项切换
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault();
    }
  }

  function showAuthor() {
    ElNotification({
      title: '开发者：云胡',
      message: h(
        'b',
        { style: 'color: balck' },
        '如有使用问题, 请微信联系: pan703019048'
      ),
    });
  }

  /**
   * 主题列表
   */
  const themeList = reactive([
    {
      themeName: '默认',
      customBackgroundColor: {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#9c0',
        1024: '#33b5e5',
        2048: '#09c',
        4096: '#a6c',
        8192: '#93c',
        16384: '#7807f9',
        32768: 'black',
        65536: 'black',
      },
      // 字体颜色
      customFontColor: {
        2: '#776e65',
        2047: '#fffcff',
      },
      // 棋盘背景颜色
      customGridContainerBackgroundColor: '#bbada0',
      // 方块背景颜色
      customGridCellBackgroundColor: '#ccc0b3',
    },
    {
      themeName: '青灰',
      customBackgroundColor: {
        2: '#dcdcdc',
        4: '#d8d8d8',
        8: '#d4d4d4',
        16: '#d0d0d0',
        32: '#c0c0c0',
        64: '#b0b0b0',
        128: '#a0a0a0',
        256: '#909090',
        512: '#808080',
        1024: '#707070',
        2048: '#606060',
        4096: '#505050',
        8192: '#404040',
        16384: '#303030',
        32768: '#202020',
        65536: '#000000',
      },
      customFontColor: '#fffcff',
      customGridContainerBackgroundColor: '#b6b6b6',
      customGridCellBackgroundColor: '#afafaf',
    },
    {
      themeName: '风信紫',
      customBackgroundColor: {
        2: '#a0a8d6',
        4: '#af9ed5',
        8: '#9176c7',
        16: '#7058ba',
        32: '#935dbb',
        64: '#613cae',
        128: '#44288f',
        256: '#5432af',
        512: '#643ccb',
        1024: '#7446eb',
        2048: '#845aff',
        4096: '#9464ff',
        8192: '#a46eff',
        16384: '#b478ff',
        32768: 'black',
        65536: 'black',
      },
      customFontColor: '#fcffff',
      customGridContainerBackgroundColor: '#ddbef7',
      customGridCellBackgroundColor: '#d3b8eb',
    },
    {
      themeName: '琥珀黄',
      customBackgroundColor: {
        2: '#fce89f',
        4: '#fae77e',
        8: '#f6d548',
        16: '#f3c043',
        32: '#f1b96e',
        64: '#f2ae3f',
        128: '#f29c37',
        256: '#ee8834',
        512: '#ee8b3e',
        1024: '#ee8e49',
        2048: '#ee9164',
        4096: '#ee946e',
        8192: '#ee9779',
        16384: '#ee9a83',
        32768: '#202020',
        65536: '#000000',
      },
      customFontColor: '#ffffff',
      customGridContainerBackgroundColor: '#dccbc3',
      customGridCellBackgroundColor: '#d3c4a5',
    },
    {
      themeName: '梦幻粉',
      customBackgroundColor: {
        2: '#f5b9c5',
        4: '#e493b1',
        8: '#ed8095',
        16: '#eb68ac',
        32: '#d25189',
        64: '#d24f6e',
        128: '#ea4259',
        256: '#b6204c',
        512: '#b63662',
        1024: '#b64c78',
        2048: '#b6628e',
        4096: '#b678a4',
        8192: '#b68eba',
        16384: '#b6a4d0',
        32768: '#202020',
        65536: '#000000',
      },
      customFontColor: '#ffffff',
      customGridContainerBackgroundColor: '#f8d6ef',
      customGridCellBackgroundColor: '#efcfe7',
    },
  ]);
  // 自定义棋盘的背景颜色

  // 当前选择的主题
  const currentSelectThemeStyle = ref(themeList[0]);

  /**
   * 选择主题
   */
  let currentTheme = ref('');
  const selectTheme = (value) => {
    currentTheme.value = value;
    if (value === '默认') {
      currentSelectThemeStyle.value = themeList[0];
    } else if (value === '青灰') {
      currentSelectThemeStyle.value = themeList[1];
    } else if (value === '风信紫') {
      currentSelectThemeStyle.value = themeList[2];
    } else if (value === '琥珀黄') {
      currentSelectThemeStyle.value = themeList[3];
    } else if (value === '梦幻粉') {
      currentSelectThemeStyle.value = themeList[4];
    }
    // 保存主题配置到本地
    const counterStore = useCounterStore();
    counterStore.setLocalStorageThemeValue(value);
    updateBoardView();
  };

  /**
   * 加载本地数据
   */
  const loadLocalStore = () => {
    // 从 localstore 里面读取数据
    const counterStore = useCounterStore();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        chessBoard[i][j] = counterStore.chessBoardArray[i][j];
      }
    }
    let flag = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (chessBoard[i][j] != 0) {
          document.addEventListener('keyup', processKeyUp);
          flag = 1;
          break;
        }
      }
      if (flag === 1) {
        break;
      }
    }
    defaultTheme.value = counterStore.localStorageTheme;
    currentTheme.value = counterStore.localStorageTheme;
    if (currentTheme.value === '默认') {
      currentSelectThemeStyle.value = themeList[0];
    } else if (currentTheme.value === '青灰') {
      currentSelectThemeStyle.value = themeList[1];
    } else if (currentTheme.value === '风信紫') {
      currentSelectThemeStyle.value = themeList[2];
    } else if (currentTheme.value === '琥珀黄') {
      currentSelectThemeStyle.value = themeList[3];
    } else if (currentTheme.value === '梦幻粉') {
      currentSelectThemeStyle.value = themeList[4];
    }
  };

  onMounted(() => {
    loadLocalStore();
    // 初始化棋盘格;
    initChessboard();
    const counterStore = useCounterStore();
    useTime.value = counterStore.localStorageTime;
    score.value = counterStore.localStorageScore;
    timer.value = setInterval(() => useTime.value++, 1000);
  });

  let startX = ref();
  let startY = ref();

  /**
   * 点击
   */
  function touchstart() {
    // 阻止默认事件（长按的时候出现复制）
    event.preventDefault();
    startX.value = event.changedTouches[0].pageX;
    startY.value = event.changedTouches[0].pageY;
  }

  function touchmove() {}

  function touchend() {
    // event.preventDefault();

    let moveEndX = event.changedTouches[0].pageX;
    let moveEndY = event.changedTouches[0].pageY;
    let X = moveEndX - startX.value;
    let Y = moveEndY - startY.value;

    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      if (moveRight()) {
        afterMove();
      }
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      if (moveLeft()) {
        afterMove();
      }
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      if (moveDown()) {
        afterMove();
      }
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      if (moveUp()) {
        afterMove();
      }
    }
  }

  /**
   * 点击跳转到查看排行榜页面
   */
  function showScoreRank() {
    if (audio.value !== null) {
      audio.value.pause();
    }
    isPlaying.value = false;
    router.push({
      path: '/scoreRank',
    });
  }

  /**
   * 提交分数
   */
  async function submitScore() {
    let scoreData = {
      score: 0,
      playerName: '',
      useTime: 0,
    };
    if (playerName.value === '' || playerName.value === undefined) {
      playerName.value = '匿名用户';
    }
    scoreData.score = score.value;
    scoreData.playerName = playerName.value;
    scoreData.useTime = useTime.value;

    insertScoreApi(scoreData)
      .then((res) => {
        ElMessage.success('提交分数成功, 希望你玩的开心^_^');
        centerDialogVisible.value = false;
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error('提交分数失败');
      });
  }

  let timer = ref();

  /**
   * 点击开始新游戏
   */
  const startNewGame = () => {
    document.addEventListener('keyup', processKeyUp);
    useTime.value = 0;
    clearInterval(timer.value);
    timer.value = setInterval(() => useTime.value++, 1000);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        chessBoard[i][j] = 0;
      }
    }
    updateBoardView();

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

  /**
   * 获取与顶部的位置
   */
  function getPosTop(i, j) {
    return 6 + i * 92;
  }

  /**
   * 获取与左侧的位置
   */
  function getPosLeft(i, j) {
    return 6 + j * 92;
  }

  /**
   * 判断是否能向上移动
   * 1. 上面那个格子的值为 0，表示是空的，因此可以移动过去
   * 2. 上面那个格子的值与当前值相同，表示可以合并，因此也可以移动过去
   *
   * @return 可以返回 true, 不能返回 false
   */
  function canMoveUp() {
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (chessBoard[i][j] !== 0) {
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
    return false;
  }

  /**
   * 判断垂直障碍物是否存在
   * 在同一列的 startRow 和 endRow 中间只要有一个值为 0，说明垂直方向存在障碍物
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
      'number-cell-' + fromX + '-' + fromY
    );
    // 200ms 动画效果不好
    // 50 ms 好
    if (numberCell) {
      numberCell.animate(
        {
          top: getPosTop(toX, toY) + 'px',
          left: getPosLeft(toX, toY) + 'px',
        },
        50
      );
    }
    // 使用CSS过渡动画
    // numberCell.style.transition = 'top 10s, left 10s';
    // // 设置元素的新位置
    // numberCell.style.top = getPosTop(toX, toY) + 'px';
    // numberCell.style.left = getPosLeft(toX, toY) + 'px';
    // if (numberCell) {
    //   numberCell.style.transition = 'top 0.2s, left 0.2s'; // 同时设置淡入淡出和位置移动的过渡动画
    //   // 同时设置元素的新位置
    //   numberCell.style.top = getPosTop(toX, toY) + 'px';
    //   numberCell.style.left = getPosLeft(toX, toY) + 'px';
    // }
  }

  /**
   * 向右移动
   */
  function moveRight() {
    if (!canMoveRight()) {
      // 如果不能向右移动
      return false;
    }

    let canMoveRightColumnIndex = [3, 3, 3, 3];

    // 对左侧三列进行处理
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 2; columnIndex >= 0; columnIndex--) {
        if (chessBoard[rowIndex][columnIndex] !== 0) {
          for (
            let k = canMoveRightColumnIndex[rowIndex];
            k >= columnIndex + 1;
            k--
          ) {
            if (
              chessBoard[rowIndex][k] === 0 &&
              noBlockHor(rowIndex, columnIndex, k)
            ) {
              showMoveAnimation(rowIndex, columnIndex, rowIndex, k);
              chessBoard[rowIndex][k] = chessBoard[rowIndex][columnIndex];
              chessBoard[rowIndex][columnIndex] = 0;
              continue;
            } else if (
              chessBoard[rowIndex][k] === chessBoard[rowIndex][columnIndex] &&
              noBlockHor(rowIndex, columnIndex, k)
            ) {
              showMoveAnimation(rowIndex, columnIndex, rowIndex, k);
              // 移动过去，合并
              chessBoard[rowIndex][k] = 2 * chessBoard[rowIndex][columnIndex];
              // 之前的消失
              chessBoard[rowIndex][columnIndex] = 0;
              score.value = score.value + chessBoard[rowIndex][k];
              canMoveRightColumnIndex[rowIndex] = k - 1;
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

    let canMoveDownRowIndex = [3, 3, 3, 3];

    // 对前三行进行判断
    for (let rowIndex = 2; rowIndex >= 0; rowIndex--) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (chessBoard[rowIndex][columnIndex] !== 0) {
          for (
            let k = canMoveDownRowIndex[columnIndex];
            k >= rowIndex + 1;
            k--
          ) {
            // 下侧为空
            if (
              chessBoard[k][columnIndex] === 0 &&
              noBlockVer(columnIndex, rowIndex, k)
            ) {
              showMoveAnimation(rowIndex, columnIndex, k, columnIndex);
              chessBoard[k][columnIndex] = chessBoard[rowIndex][columnIndex];
              chessBoard[rowIndex][columnIndex] = 0;
              continue;
            } else if (
              chessBoard[k][columnIndex] ===
                chessBoard[rowIndex][columnIndex] &&
              noBlockVer(columnIndex, rowIndex, k)
            ) {
              showMoveAnimation(rowIndex, columnIndex, k, columnIndex);
              chessBoard[k][columnIndex] =
                2 * chessBoard[rowIndex][columnIndex]; //移动过去
              chessBoard[rowIndex][columnIndex] = 0; //之前的消失
              score.value = score.value + chessBoard[k][columnIndex];
              canMoveDownRowIndex[columnIndex] = k - 1;
              continue;
            }
          }
        }
      }
    }
    return true;
  }

  const storeChessBoard = () => {
    const counterStore = useCounterStore();

    // 调用 Store 中的 setCellValue 方法
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        counterStore.setCellValue(
          rowIndex,
          columnIndex,
          chessBoard[rowIndex][columnIndex]
        );
      }
    }
    counterStore.setLocalStorageScoreValue(score.value);
    counterStore.setLocalStorageTimeValue(useTime.value);
  };

  const gameOverStoreChessBoard = () => {
    const counterStore = useCounterStore();

    // 调用 Store 中的 setCellValue 方法
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        counterStore.setCellValue(rowIndex, columnIndex, 0);
      }
    }
    counterStore.setLocalStorageScoreValue(0);
    counterStore.setLocalStorageTimeValue(0);
  };

  /**
   * 往上移动
   */
  function moveUp() {
    if (!canMoveUp()) {
      // 如果不能移动
      console.log('无法向上移动');
      return false;
    }

    // 每一列可以移动到最顶端的那个行
    let canMoveTopRowIndex = [0, 0, 0, 0];

    for (let rowIndex = 1; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (chessBoard[rowIndex][columnIndex] !== 0) {
          for (let k = canMoveTopRowIndex[columnIndex]; k < rowIndex; k++) {
            if (
              chessBoard[k][columnIndex] === 0 &&
              noBlockVer(columnIndex, k, rowIndex)
            ) {
              //上侧为空，不存在障碍物
              showMoveAnimation(rowIndex, columnIndex, k, columnIndex);
              // 移动过去
              chessBoard[k][columnIndex] = chessBoard[rowIndex][columnIndex];
              // 之前的消失
              chessBoard[rowIndex][columnIndex] = 0;
              continue;
            } else if (
              chessBoard[k][columnIndex] ===
                chessBoard[rowIndex][columnIndex] &&
              noBlockVer(columnIndex, k, rowIndex)
            ) {
              showMoveAnimation(rowIndex, columnIndex, k, columnIndex);
              chessBoard[k][columnIndex] =
                2 * chessBoard[rowIndex][columnIndex];
              chessBoard[rowIndex][columnIndex] = 0;
              score.value = score.value + chessBoard[k][columnIndex];
              canMoveTopRowIndex[columnIndex] = k + 1;
              continue;
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

    // 每一行能移动到最左侧的那个列数
    let canMoveLeftColumnIndex = [0, 0, 0, 0];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      // 最左侧那一列不移动
      for (let columnIndex = 1; columnIndex < 4; columnIndex++) {
        if (chessBoard[rowIndex][columnIndex] != 0) {
          for (let k = canMoveLeftColumnIndex[rowIndex]; k < columnIndex; k++) {
            if (
              chessBoard[rowIndex][k] == 0 &&
              noBlockHor(rowIndex, k, columnIndex)
            ) {
              //左侧为空
              // move
              chessBoard[rowIndex][k] = chessBoard[rowIndex][columnIndex]; //移动过去
              chessBoard[rowIndex][columnIndex] = 0; //之前的消失
              showMoveAnimation(rowIndex, columnIndex, rowIndex, k);
              continue;
            } else if (
              chessBoard[rowIndex][k] == chessBoard[rowIndex][columnIndex] &&
              noBlockHor(rowIndex, k, columnIndex)
            ) {
              showMoveAnimation(rowIndex, columnIndex, rowIndex, k);
              chessBoard[rowIndex][k] = 2 * chessBoard[rowIndex][columnIndex]; //移动过去
              chessBoard[rowIndex][columnIndex] = 0; //之前的消失
              score.value = score.value + chessBoard[rowIndex][k];
              canMoveLeftColumnIndex[rowIndex] = k + 1;
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
    updateBoardView();

    setTimeout(() => {
      generateOneNumber();
      storeChessBoard();
    }, 160);

    setTimeout(() => {
      isGameOver();
    }, 300);
  }

  /**
   * 点击上下左右按键
   */
  function processKeyUp(e) {
    var keyCode = e.keyCode;
    // 点击上键
    if (keyCode === 38) {
      if (moveUp()) {
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
  }

  /**
   * 根据格子数值获取背景颜色
   */
  function getNumberBackgroundColor(number) {
    switch (number) {
      case 2:
        return currentSelectThemeStyle.value.customBackgroundColor[2];
        break;
      case 4:
        return currentSelectThemeStyle.value.customBackgroundColor[4];
        break;
      case 8:
        return currentSelectThemeStyle.value.customBackgroundColor[8];
        break;
      case 16:
        return currentSelectThemeStyle.value.customBackgroundColor[16];
        break;
      case 32:
        return currentSelectThemeStyle.value.customBackgroundColor[32];
        break;
      case 64:
        return currentSelectThemeStyle.value.customBackgroundColor[64];
        break;
      case 128:
        return currentSelectThemeStyle.value.customBackgroundColor[128];
        break;
      case 256:
        return currentSelectThemeStyle.value.customBackgroundColor[256];
        break;
      case 512:
        return currentSelectThemeStyle.value.customBackgroundColor[512];
        break;
      case 1024:
        return currentSelectThemeStyle.value.customBackgroundColor[1024];
        break;
      case 2048:
        return currentSelectThemeStyle.value.customBackgroundColor[2048];
        break;
      case 4096:
        return currentSelectThemeStyle.value.customBackgroundColor[4096];
        break;
      case 8192:
        return currentSelectThemeStyle.value.customBackgroundColor[8192];
        break;
      case 16384:
        return currentSelectThemeStyle.value.customBackgroundColor[16384];
        break;
      case 32768:
        return currentSelectThemeStyle.value.customBackgroundColor[32768];
        break;
      case 65536:
        return currentSelectThemeStyle.value.customBackgroundColor[65536];
        break;
        return 'black';
    }
  }

  /**
   * 获取数字颜色
   */
  function getNumberColor(number) {
    if (currentTheme.value === '默认') {
      if (number <= 4 && number >= 2) {
        return currentSelectThemeStyle.value.customFontColor[2];
      } else {
        return currentSelectThemeStyle.value.customFontColor[2047];
      }
    }

    return currentSelectThemeStyle.value.customFontColor;
  }

  /**
   * 判断棋盘中还有空间吗
   *
   * @returns true->还有空间, false->没有
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

  // 创建淡出效果
  function fadeOut(element, i, j) {
    let opacity = 1;
    const fadeInterval = setInterval(function () {
      if (opacity <= 0) {
        // 淡出完成，清除定时器并隐藏元素
        clearInterval(fadeInterval);
        element.style.display = 'none';
        // element.style.width = '0px';
        // element.style.height = '0px';
        // element.style.width = '0px';
        // element.style.height = '0px';
        // element.style.top = getPosTop(i, j) + 'px';
        // element.style.left = getPosLeft(i, j) + 'px';
        // element.style.backgroundColor = getNumberBackgroundColor(
        //   chessBoard[i][j]
        // );
        // element.style.color = getNumberColor(chessBoard[i][j]);
      } else {
        // 逐渐减小透明度
        opacity -= 0.5; // 调整步长以控制淡出速度
        element.style.opacity = opacity;
      }
    }, 100); // 每100毫秒执行一次
  }

  /**
   * 重绘界面
   */
  function updateBoardView() {
    changeChessboardBackgroundColor();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let theNumberCell = document.getElementById(
          'number-cell-' + i + '-' + j
        );
        if (chessBoard[i][j] !== 0 && theNumberCell) {
          theNumberCell.style.width = chessBoardWidth.value + 'px';
          theNumberCell.style.height = chessBoardHeight.value + 'px';

          theNumberCell.style.top = getPosTop(i, j) + 'px';
          theNumberCell.style.left = getPosLeft(i, j) + 'px';

          if (chessBoard[i][j] >= 100 && chessBoard[i][j] < 1024) {
            theNumberCell.style.fontSize = '42px';
          } else if (chessBoard[i][j] >= 1024 && chessBoard[i][j] <= 10000) {
            theNumberCell.style.fontSize = '30px';
          } else if (chessBoard[i][j] > 10000 && chessBoard[i][j] < 100000) {
            theNumberCell.style.fontSize = '22px';
          } else if (chessBoard[i][j] >= 100000) {
            theNumberCell.style.fontSize = '18px';
          } else {
            theNumberCell.style.fontSize = '60px';
          }
          theNumberCell.style.backgroundColor = getNumberBackgroundColor(
            chessBoard[i][j]
          );
          theNumberCell.style.color = getNumberColor(chessBoard[i][j]);
        } else if (chessBoard[i][j] === 0 && theNumberCell) {
          // fadeOut(theNumberCell, i, j);

          theNumberCell.style.width = '0px';
          theNumberCell.style.height = '0px';
          theNumberCell.style.top = getPosTop(i, j) + 'px';
          theNumberCell.style.left = getPosLeft(i, j) + 'px';
          theNumberCell.style.backgroundColor = getNumberBackgroundColor(
            chessBoard[i][j]
          );
          theNumberCell.style.color = getNumberColor(chessBoard[i][j]);
        }
      }
    }
  }

  /**
   * 切换棋盘背景颜色
   */
  function changeChessboardBackgroundColor() {
    // 切换棋盘背景颜色
    let gridContainer = document.getElementById('grid-container');
    if (gridContainer) {
      gridContainer.style.backgroundColor =
        currentSelectThemeStyle.value.customGridContainerBackgroundColor;
    }

    // 切换每一个方格的背景颜色
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let gridCell = document.getElementById('grid-cell-' + i + '-' + j);
        if (gridCell) {
          gridCell.style.top = getPosTop(i, j) + 'px';
          gridCell.style.left = getPosLeft(i, j) + 'px';
          gridCell.style.backgroundColor =
            currentSelectThemeStyle.value.customGridCellBackgroundColor;
        }
      }
    }
  }

  /**
   * 初始化棋盘
   */
  function initChessboard() {
    updateBoardView();
  }

  /**
   * 判断是否可以移动
   *
   * @returns false 可以移动, true 无法移动
   */
  function noMove() {
    // 只要有一个方向可以移动，就能移动
    if (canMoveDown() || canMoveLeft() || canMoveRight() || canMoveUp()) {
      return false;
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
            // 可以向左移动
            return true;
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
    // 不能向右移动
    return false;
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
            // 可以向下移动
            return true;
        }
      }
    }
    // 不能向下移动
    return false;
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
      ElMessage.error('游戏结束');
      centerDialogVisible.value = true;
      clearInterval(timer.value);
      document.removeEventListener('keyup', processKeyUp);
      gameOverStoreChessBoard();
    }
  }

  /**
   * 用动画显示生成数字的过程
   */
  function showNumberWithAnimation(i, j, randNumber) {
    let numberCell = document.getElementById('number-cell-' + i + '-' + j);
    if (numberCell) {
      // 获取随机数值的背景颜色
      numberCell.style.top = getPosTop(i, j) + 'px';
      numberCell.style.left = getPosLeft(i, j) + 'px';

      let backgroundColor = getNumberBackgroundColor(randNumber);
      numberCell.style.backgroundColor = backgroundColor;

      let color = getNumberColor(randNumber);
      numberCell.style.color = color;
      numberCell.style.fontSize = '60px';
      numberCell.style.width = chessBoardWidth.value + 'px';
      numberCell.style.height = chessBoardHeight.value + 'px';
      numberCell.textContent = randNumber;
    }
  }

  /**
   * 随机生成数字
   *
   * @returns
   */
  function generateOneNumber() {
    // 棋盘中还有空间就生成数字
    if (isChessBoardExistSpace()) {
      // 没有空间返回 false
      return false;
    }

    // 随机生成 0-4 的位置不包括 4
    let randX = parseInt(Math.floor(Math.random() * 4));
    let randY = parseInt(Math.floor(Math.random() * 4));

    // 判断位置是否可用
    while (true) {
      if (chessBoard[randX][randY] === 0) {
        // 位置可用跳出死循环，不可用继续找
        break;
      }
      randX = parseInt(Math.floor(Math.random() * 4));
      randY = parseInt(Math.floor(Math.random() * 4));
    }

    // 随机生成 2 或 4，它们的概率相同
    var randNumber = Math.random() > 0.5 ? 2 : 4;

    // 在随机位置显示随机数字 2 或 4
    chessBoard[randX][randY] = randNumber;

    showNumberWithAnimation(randX, randY, randNumber);
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
    font-family: 'Arial Rounded MT Bold';
    font-size: 30px;
    font-weight: bold;
  }

  header p {
    font-family: Arial;
    font-size: 25px;
    margin: 5px auto;
  }

  #grid-container {
    width: 368px;
    height: 368px;
    /* padding: 20px; */
    margin: 10px auto;
    border-radius: 10px;
    position: relative;
  }

  .grid-cell {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    position: absolute;
  }

  .number-cell {
    /* font-weight: bold; */
    font-family: Arial;
    border-radius: 6px;
    font-size: 60px;
    line-height: 80px;
    text-align: center;
    position: absolute;
  }

  .score-class {
    margin-top: 20px;
  }

  .use-time-class {
    width: 100px;
    margin-top: 20px;
    margin-left: 240px;
    position: relative;
  }

  .music-class {
    margin: 20px;
  }

  .music-icon-class {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }

  .menu-class {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .about-author-class {
    margin-top: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
