<script>
import router from '@/router';
import axios from 'axios'

export default {
  props: ['id'],
  data() {
    return {
      serviceInfo: null,
      name: '',
      price: null,
      sale: null,
      imgId:null,
      imgUrl: null,
      imageToAdd: null,
      snackbar: false,
      hasImage: false
    }
  },
  mounted() {
    this.updateInfo()
  },
  methods: {
    async updateInfo() {
      const response = (
        await axios.get(
          'http://localhost:1337/api/productos/' + this.$props.id + '/?populate=Imagen'
        )
      ).data.data.attributes
      this.serviceInfo = response
      this.name = response.Nombre
      this.price = response.Precio
      this.sale = response.Oferta
      if(response.Imagen.data){
        this.imgUrl = response.Imagen.data[0].attributes.url
        this.imgId = response.Imagen.data[0].id
        this.hasImage=true
      }
      
    },
    onFileChange(){
        if(event.target.files[0]!=undefined){
            const file = event.target.files[0];
            this.imageToAdd = file;
            this.imgUrl = URL.createObjectURL(file);
            this.hasImage=true
        }
    },
    async deleteService(){
        if(confirm("¿Estás seguro de eliminar el producto?")){
            if(confirm("¿Estás completamente seguro de eliminar el producto?")){
              if(this.imgId){
                await axios.delete('src/views/ProductView.vue' + this.imgId)
              }
                
                await axios.delete('http://localhost:1337/api/productos/' + this.$props.id)
                router.push("/productos")
            }
        }
    },
    async updateService(){
      if(this.imageToAdd){
        if(this.imgId){
          await axios.delete('http://localhost:1337/api/upload/files/' + this.imgId)
        }
        const formData = new FormData();
        formData.append('files', this.imageToAdd);
        try {
          const response = await fetch('http://localhost:1337/api/upload', {
          method: 'post',
          body: formData,
        });
        const data = await response.json();
        
        this.imgId=data[0].id
        } catch (error) {
          console.log(error);
        }
      }

      const serviceData = {
          data: {
            Nombre: this.name,
            Precio: this.price,
            Oferta: this.sale,
            Imagen: this.imgId
          }
      };
      await axios.put('http://localhost:1337/api/productos/'+this.$props.id, serviceData);
      this.snackbar=!this.snackbar
    }
  }
}
</script>

<template>
  <div>
    <v-snackbar
      v-model="snackbar"
    >
    Cambios realizados
    </v-snackbar>
    <v-row v-if="serviceInfo != null">
      <v-col />
      <v-col cols="8">
        <v-row>
          <v-col style="text-align: center">
            <input type="file" id="file-input" style="display: none" @change="onFileChange" />
              <label for="file-input" class="center-content">
              {{ console.log(hasImage)
               }}
                <i class="fa-solid fa-image" v-if="!hasImage" style="font-size: 5em;color: white;"></i>
                <img
                  :src="'http://localhost:1337'+imgUrl"
                  alt="Click to upload"
                  id="upload-image"
                  v-else-if="!imageToAdd"
                  style="width: 250px; border-radius: 10%"
                />
                <img
                  :src="imgUrl"
                  alt="Click to upload"
                  id="upload-image"
                  v-else
                  style="width: 250px; border-radius: 10%"
                />
              </label>
          </v-col>
        </v-row>
        <v-row>
          <v-col />
          <v-col class="center-content" style="color: white" cols="3">
            <v-text-field hide-details="auto" label="Nombre" v-model="name" />
          </v-col>
          <v-col class="center-content" style="color: white">
            <v-text-field hide-details="auto" label="Precio" v-model="price" />€
          </v-col>

          <v-col class="center-content" style="color: white">
            <v-text-field hide-details="auto" label="Oferta" v-model="sale" />%
          </v-col>
          <v-col />
        </v-row>
        <v-row>
          <v-col />
          <v-col class="center-content" cols="2">
            <v-btn style="margin-right: 10px" @click="updateService()">Guardar</v-btn>
            <v-btn @click="deleteService()">Eliminar</v-btn>
          </v-col>
          <v-col />
        </v-row>
      </v-col>
      <v-col />
    </v-row>
  </div>
</template>

<style>
.formText {
  color: white;
  font-size: 20px;
  text-align: center;
}
.inputCustom {
  background-color: grey;
  color: white;
}
</style>
