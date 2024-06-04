<template>
  <div id="app">
      <ProductList />
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue';

export default {
  name: 'App',
  components: {
      ProductList
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}
#app {
  text-align: center;
  padding: 20px;
}
</style>
