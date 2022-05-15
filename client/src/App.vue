<template>
  <div id="app">
    <Manager msg="Файловый менеджер" />
  </div>
</template>

<script>
import Manager from "./components/Manager.vue";

// default = App с компонентом Manager.Vue
export default {
  name: "App",
  components: {
    Manager,
  },
};
</script>
