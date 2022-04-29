<template>
  <div id="app">
    <Manager msg="Файловый менеджер" />
  </div>
</template>

<script>
import Manager from "./components/Manager.vue";

export default {
  name: "App",
  components: {
    Manager,
  },
};
</script>
