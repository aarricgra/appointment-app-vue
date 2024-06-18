<script>
import axios from 'axios';

export default {
  data() {
    return {
      clientList: [],
    };
  },
  methods: {
    async getClients() {
      try {
        this.clientList = (await axios.get('http://localhost:1337/api/clientes/?populate=Imagen')).data.data;
        console.log(this.clientList);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
  },
  mounted() {
    this.getClients();
  }
};
</script>

<template>
  <div style="color: white">
    <div v-for="client in clientList" :key="client.id" style="margin-bottom: 40px">
      <v-row >
        <v-col />
        <v-col cols="12" md="7" class="listElement">
          <v-row>
            <v-col cols="2" class="center-content" style="padding-left: 10px;">
              <img
                :src="'http://localhost:1337' + client.attributes.Imagen.data.attributes.url"
                alt="aa"
                style="width: 90px; border-radius: 100%"
                v-if="client.attributes.Imagen.data"
              />
              <i class="fa-solid fa-image" v-else></i>

            </v-col>
            <v-col class="center-content">
              <v-row style="height: 100%">
                <v-col class="center-content">
                  <p>{{ client.attributes.Nombre }}</p>
                </v-col>
              </v-row>
            </v-col>
            <router-link :to="{name:'cliente',params:{id:client.id}}" class="center-content">
              <v-col cols="1" class="center-content">
              <i class="fa-solid fa-pen-to-square"></i>
            </v-col>
            </router-link>
            
          </v-row>
        </v-col>
        <v-col />
      </v-row>
    </div>
  </div>
</template>

<style>
.listElement {
  border: 4px solid gray;
  border-radius: 10px;
}
.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
}
.togle-add {
  height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  border: 4px dashed gray;
  border-radius: 10px;
  cursor: pointer;
}
</style>
