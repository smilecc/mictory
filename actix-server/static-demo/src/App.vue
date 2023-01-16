<script setup lang="ts">
import { ref } from "vue";
import { Session } from "./session";
import { useStore } from "./stores";

const store = useStore();

const inputRoomId = ref("");

function onJoinRoomClick() {
  store.session.joinRoom(inputRoomId.value);
}
</script>

<template>
  <div>
    <input placeholder="房间号" v-model="inputRoomId" />
    <button @click="onJoinRoomClick">加入房间</button>
  </div>
</template>

<style scoped></style>
