import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import vueTouch from "vue-touch";
import "lib-flexible";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(vueTouch);
app.use(Vue3DraggableResizable);
app.mount("#app");
