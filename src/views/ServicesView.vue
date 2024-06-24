<script>
import axios from 'axios';

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
    };
  },
  methods: {
    async getServices() {
      try {
        const resp = (await axios.get('http://localhost:1337/api/servicios/?populate=Imagen&filters[Nombre][$ne]=Cerrado')).data.data;
        this.servicesList = resp;
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    cancelAdd() {
      this.isAdding = !this.isAdding;
      this.nameToAdd = '';
      this.priceToAdd = null;
      this.saleToAdd = null;
      this.imageToAdd = null;
      this.imagePreview = null;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.imageToAdd = file;
      this.imagePreview = URL.createObjectURL(file);
    },
    async postNewService() {
      if (!this.imageToAdd) {
        alert('Please select an image');
        return;
      }

      const formData = new FormData();
      formData.append('files', this.imageToAdd);
      try {
        const response = await fetch('http://localhost:1337/api/upload', {
        method: 'post',
        body: formData,
        });
        const data = await response.json();
        const id=data[0].id

        const serviceData = {
          data: {
            Nombre: this.nameToAdd,
            Precio: this.priceToAdd,
            Oferta: this.saleToAdd,
            Imagen: [id]
          }
        };
        await axios.post('http://localhost:1337/api/servicios', serviceData);
        this.getServices();
        this.cancelAdd(); 
      } catch (error) {
        console.error("Error uploading file or creating service:", error);
      }
    }
  },
  mounted() {
    this.getServices();
  }
};
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
                v-if="service.attributes.Imagen.data"
                :src="'http://localhost:1337' + service.attributes.Imagen.data[0].attributes.url"
                alt="aa"
                style="width: 90px; border-radius: 100%"
              />
              <i v-else class="fa-solid fa-image center-content" style="height: 90px;"></i>
            </v-col>
            <v-col class="center-content" >
              <v-row style="height: 100%">
                <v-col class="center-content" style="padding: 0;">
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
            <router-link :to="{name:'servicio',params:{id:service.id}}" class="center-content">
              <v-col cols="1" class="center-content">
              <i class="fa-solid fa-pen-to-square"></i>
            </v-col>
            </router-link>
            
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

              <label for="file-input" style="height: 90px" class="center-content">
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
            <v-col class="center-content">
              <v-row>
                <v-col class="center-content" cols="4">
                  <v-text-field hide-details="auto" label="Nombre" v-model="nameToAdd" />
                </v-col>
                <v-col class="center-content" cols="3">
                  <v-text-field hide-details="auto" label="Precio" v-model="priceToAdd" />€
                </v-col>
                <v-col class="center-content" cols="3">
                  <v-text-field hide-details="auto" label="Oferta" v-model="saleToAdd" />%
                </v-col>
                <v-col cols="1" @click="postNewService()" class="center-content">
                  <i class="fa-solid fa-floppy-disk"></i>
                </v-col>
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
