<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "./stores";
import axios from "axios";

const store = useStore();

const state = reactive({
  account: "test@test.com",
  password: "test1234",
  accessToken: "",
  inputServerId: "1",
  inputRoomId: "",
  serverRooms: [] as any[],
  serverUsers: [] as any[],
});

function onAuthClick() {
  axios
    .post("/api/user/login", {
      account: state.account,
      password: state.password,
    })
    .then(({ data }) => {
      state.accessToken = data.data.accessToken;
      store.session.auth(state.accessToken);
    });
}

function onJoinRoomClick() {
  store.session.joinRoom(state.inputRoomId);
}

function onExitRoomClick() {
  store.session.exitRoom();
  loadServerInfo();
}

function loadServerInfo() {
  axios
    .get(`/api/server/${state.inputServerId}/rooms`, {
      headers: {
        Authorization: state.accessToken,
      },
    })
    .then(({ data }) => {
      state.serverRooms = data.data;
    });

  axios
    .get(`/api/server/${state.inputServerId}/users`, {
      headers: {
        Authorization: state.accessToken,
      },
    })
    .then(({ data }) => {
      state.serverUsers = data.data;
    });
}

window.addEventListener("session:server_user_join", (e) => {
  loadServerInfo();
});

window.addEventListener("session:server_user_exit", (e) => {
  loadServerInfo();
});
</script>

<template>
  <div>
    <h2>登录</h2>
    <input v-model="state.account" />
    <input v-model="state.password" />
    <button @click="onAuthClick">登录</button>
    <div v-if="state.accessToken">
      <p>
        <span>AccessToken: </span>
        <span>{{ state.accessToken }}</span>
      </p>
    </div>
  </div>
  <hr />
  <div>
    <h2>服务器/房间</h2>
    <div>
      <label for="ipt-server-id">服务器ID</label>
      <input id="ipt-server-id" v-model="state.inputServerId" />
      <button @click="loadServerInfo">加载房间</button>
      <button @click="onExitRoomClick">退出房间</button>
    </div>

    <div>
      <h3>房间列表</h3>
      <ul>
        <li v-for="room in state.serverRooms" :key="room.id">
          <p>
            <span>[RoomId: {{ room.id }}] {{ room.name }}</span>
            <button @click="store.session.joinRoom(`${room.id}`)">加入</button>
          </p>
          <ul
            v-for="u in state.serverUsers.filter((it) => it.roomId === room.id)"
            :key="u.id"
          >
            <span>
              [UserId: {{ u.userId }}]
              {{ u.userNickname }}
            </span>
          </ul>
        </li>
      </ul>
    </div>

    <input placeholder="房间号" v-model="state.inputRoomId" />
    <button @click="onJoinRoomClick">加入房间</button>
  </div>
</template>

<style scoped></style>
