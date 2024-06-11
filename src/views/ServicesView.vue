<script>
import axios from 'axios'

export default {
  data() {
    return {
      servicesList: [],
      isAdding: false,
      nameToAdd: '',
      priceToAdd: null,
      saleToAdd: null,
      imageToAdd: null,
      imagePreview: null
    }
  },
  methods: {
    async getServices() {
      const resp = (await axios.get('http://localhost:1337/api/servicios/?populate=Imagen')).data
        .data
      this.servicesList = resp
    },
    cancelAdd() {
      this.isAdding = !this.isAdding
      this.nameToAdd = ''
      this.priceToAdd = null
      this.saleToAdd = null
      this.imageToAdd = null
      this.imagePreview = null
    },
    onFileChange(event) {
      const file = event.target.files[0]
      this.imageToAdd = file
      this.imagePreview = URL.createObjectURL(file)
    }
  },
  mounted() {
    this.getServices()
  }
}
</script>

<template>
  <div style="color: white">
    <div v-for="service in servicesList" :key="service.id" style="margin-bottom: 40px">
      <v-row v-if="service.id != 1">
        <v-col />
        <v-col cols="7" class="listElement">
          <v-row>
            <v-col cols="2" class="center-content">
              <img
                :src="'http://localhost:1337' + service.attributes.Imagen.data[0].attributes.url"
                alt="aa"
                style="width: 90px; border-radius: 100%"
              />
            </v-col>
            <v-col class="center-content">
              <v-row style="height: 100%">
                <v-col class="center-content">
                  <p>{{ service.attributes.Nombre }}</p>
                </v-col>
                <v-col class="center-content">
                  <p>{{ service.attributes.Precio + '€' }}</p>
                </v-col>
                <v-col class="center-content">
                  <p>{{ service.attributes.Oferta + '%' }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col />
      </v-row>
    </div>

    <div v-if="isAdding">
      <v-row>
        <v-col />
        <v-col cols="7" class="listElement">
          <v-row>
            <v-col cols="2" class="center-content">
              <input type="file" id="file-input" style="display: none" @change="onFileChange" />

              <label for="file-input" style="height: 90px;" class="center-content">
                <img
                  :src="imagePreview"
                  alt="Click to upload"
                  id="upload-image"
                  v-if="imagePreview"
                  style="width: 90px; border-radius: 100%"
                />
                <i class="fa-solid fa-image" v-else></i>
              </label>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="1" @click="cancelAdd()" class="center-content">
                  <i class="fa-solid fa-ban"></i>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col />
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col />
        <v-col cols="7" class="togle-add" @click="isAdding = !isAdding" style="width: 100%">
          <i class="fa-solid fa-plus"></i>
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
