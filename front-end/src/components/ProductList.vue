<template>
  <div class="product-list">
      <h1>Vintage Video rental</h1>
      <ul>
          <li v-for="product in products" :key="product._id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-image"/>
              <div class="product-details">
                  <h2>{{ product.name }}</h2>
                  <p>${{ product.price }}</p>
                  <button @click="buyProduct(product._id)">Rent Now</button>
              </div>
          </li>
      </ul>
      <DialogBox v-if="dialogVisible" :visible="dialogVisible" @close="dialogVisible = false">
          <p>{{ dialogMessage }}</p>
      </DialogBox>
  </div>
</template>

<script>
import axios from 'axios';
import DialogBox from './DialogBox.vue';

export default {
  components: {
    DialogBox
  },
  data() {
      return {
          products: [],
          dialogVisible: false,
          dialogMessage: ''
      };
  },
  created() {
      this.fetchProducts();
  },
  methods: {
      fetchProducts() {
          axios.get(`${process.env.VUE_APP_PRODUCT_API_URL}products`)
              .then(response => {
                  this.products = response.data;
              })
              .catch(error => {
                  console.error('There was an error fetching the products!', error);
              });
      },
      buyProduct(productId) {
          axios.post(`${process.env.VUE_APP_BUY_API_URL}buy/${productId}`)
              .then(response => {
                  this.dialogMessage = response.data.message;
                  this.dialogVisible = true;
              })
              .catch(error => {
                  console.error('There was an error making the purchase!', error);
                  this.dialogMessage = 'There was an error making the purchase!';
                  this.dialogVisible = true;
              });
      }
  }
};
</script>

<style scoped>
.product-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.product-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 20px;
}
.product-details {
  flex: 1;
}
.product-details h2 {
  margin: 0 0 10px;
}
.product-details p {
  margin: 0 0 10px;
}
.product-details button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.product-details button:hover {
  background-color: #0056b3;
}
</style>
