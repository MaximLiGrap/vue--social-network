<template lang="pug">
  .empty-layout
    router-view
</template>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl';

.empty-layout {
  background-color: eucalypt;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}
</style>
