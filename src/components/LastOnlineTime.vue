<template>
    <span class="online" v-if="(this.nowDate - time) < 3000">В сети</span>
    <span class="online-offline" v-else-if="((this.nowDate - time) < 10000)">Был(а) недавно</span>
    <span class="offline" v-else>Не в сети</span>
</template>

<script>

export default {
  name: 'LastOnlineTime',
  props: ['time'],
  computed: {
      nowDate() {
          let now = Math.floor(Date.now() / 1)
          return now;
      }
  },
}
</script>

<style>
    .online {
        color: #21a45d;
        padding-left: 20px;
        font-size: 13px;
    }
    .online-offline {
        color: #a4a4b8;
        padding-left: 20px;
        font-size: 13px;
    }
    .offline {
        color: #f9555f;
        padding-left: 20px;
        font-size: 13px;
    }
</style>
