import { reactive } from "vue";
import { io } from "socket.io-client";
import { DEMO, SERVER_URL } from "./communicationsManager";
import { createDemoSocket } from "./demo/fakeSocket";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

export const socket = DEMO
  ? createDemoSocket(state)
  : io(`${SERVER_URL}`, {
      withCredentials: true,
    });

if (!DEMO) {
  socket.on("connect", () => {
    state.connected = true;
  });

  socket.on("disconnect", () => {
    state.connected = false;
  });
}
