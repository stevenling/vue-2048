import { defineStore } from 'pinia';
import { ref } from 'vue';

// 用于从本地存储中获取数据
export const getLocalStorageData = () => {
  const data = localStorage.getItem('chessBoardArray');
  return data
    ? JSON.parse(data)
    : [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
};

/**
 * 获取本地分数
 */
const getLocalStorageScore = () => {
  const data = localStorage.getItem('localStorageScore');
  return data ? JSON.parse(data) : 0;
};

/**
 * 获取本地用时
 */
const getLocalStorageTime = () => {
  const data = localStorage.getItem('localStorageTime');
  return data ? JSON.parse(data) : 0;
};

const getLocalStorageTheme = () => {
  const theme = localStorage.getItem('localStorageTheme');
  return theme ? JSON.parse(theme) : '默认';
};

/**
 * 保存棋盘上的值
 * @param data
 */
const setLocalStorageData = (data: number[][]) => {
  localStorage.setItem('chessBoardArray', JSON.stringify(data));
};

/**
 * 设置分数
 * @param data
 */
const setLocalStorageScore = (data: number) => {
  localStorage.setItem('localStorageScore', JSON.stringify(data));
};

/**
 * 设置用时
 * @param data
 */
const setLocalStorageTime = (data: number) => {
  localStorage.setItem('localStorageTime', JSON.stringify(data));
};

/**
 * 设置主题
 * @param data
 */
const setLocalStorageTheme = (theme: string) => {
  localStorage.setItem('localStorageTheme', JSON.stringify(theme));
};

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    chessBoardArray: ref(getLocalStorageData()),
    localStorageScore: ref(getLocalStorageScore()),
    localStorageTime: ref(getLocalStorageTime()),
    localStorageTheme: ref(getLocalStorageTheme()),
  }),
  actions: {
    setCellValue(row: number, col: number, value: number) {
      const updatedArray = [...this.chessBoardArray];
      updatedArray[row][col] = value;
      this.chessBoardArray = updatedArray;
      setLocalStorageData(updatedArray);
    },

    setLocalStorageScoreValue(score: number) {
      this.localStorageScore = score;
      setLocalStorageScore(score);
    },

    setLocalStorageTimeValue(time: number) {
      this.localStorageTime = time;
      setLocalStorageTime(time);
    },

    setLocalStorageThemeValue(theme: string) {
      this.localStorageTheme = theme;
      setLocalStorageTheme(theme);
    },
  },
});

// import { defineStore } from "pinia";

// export default defineStore("user", {
//   state() {
//     return {
//       userList: [] as IUser[],
//     };
//   },
//   actions: {
//     getList() {
//       // 模拟从后端获取数据
//       let resList: IUser[] = [
//         { name: "张三", age: 18 },
//         { name: "李四", age: 19 },
//       ];
//       //   resList[0].name  此时resList[0]只能点出 name 或 age
//       userList = resList;
//     },
//   },
// });

// import { defineStore } from 'pinia';

// export const useCounterStore = defineStore({
//   id: 'counter',
//   state: () => ({
// chessBoardArray: [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ] as number[][],
//   }),
//   actions: {
//     setCellValue(
//       state: { chessBoardArray: number[][] },
//       row: number,
//       col: number,
//       value: number
//     ) {
//       state.chessBoardArray[row][col] = value;
//     },
//   },
// });
