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
      imageToAdd: null
    }
  },
  mounted() {
    this.updateInfo()
  },
  methods: {
    async updateInfo() {
      const response = (
        await axios.get(
          'http://localhost:1337/api/servicios/' + this.$props.id + '/?populate=Imagen'
        )
      ).data.data.attributes
      this.serviceInfo = response
      this.name = response.Nombre
      this.price = response.Precio
      this.sale = response.Oferta
      this.imgUrl = response.Imagen.data[0].attributes.url
      this.imgId = response.Imagen.data[0].id
    },
    onFileChange(){
        if(event.target.files[0]!=undefined){
            const file = event.target.files[0];
            this.imageToAdd = file;
            this.imgUrl = URL.createObjectURL(file);
        }
    },
    async deleteService(){
        if(confirm("¿Estás seguro de eliminar el servicio?")){
            if(confirm("¿Estás completamente seguro de eliminar el servicio?")){
                let response = await axios.delete('http://localhost:1337/api/upload/files/' + this.imgId)
                console.log("Borrar foto",response);
                response = await axios.delete('http://localhost:1337/api/servicios/' + this.$props.id)
                console.log("Borrar servicio",response);
                router.push("/servicios")
            }
        }
    }
  }
}
</script>

<template>
  <div>
    <v-row v-if="serviceInfo != null">
      <v-col />
      <v-col cols="8">
        <v-row>
          <v-col style="text-align: center">
            <input type="file" id="file-input" style="display: none" @change="onFileChange" />

              <label for="file-input" class="center-content">
                <img
                  :src="'http://localhost:1337'+imgUrl"
                  alt="Click to upload"
                  id="upload-image"
                  v-if="!imageToAdd"
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
            <v-btn style="margin-right: 10px">Guardar</v-btn>
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
