<template>
    <div id="app">
      <MainMap/>
      <SideBar class="side-bar"/>
    </div>
  </template>
  
  <script>
  import MainMap from '@/components/Course/MainMap'
  import SideBar from '@/components/Course/SideBar'
  
  export default {
    name: 'App',
    components: {
      MainMap,
      SideBar
    }
  }
  </script>
  
  <style>
  #app {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .side-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }
  </style>