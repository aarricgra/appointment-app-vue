<script>
import router from '@/router';
import axios from 'axios'

export default {
  props: ['id'],
  data() {
    return {
      serviceInfo: null,
      name: '',
      email: null,
      telf: null,
      tickets:null,
      cartera:null,
      rank:null,
      imgId:null,
      imgUrl: null,
      imageToAdd: null,
      snackbar: false,
      ranks:[]
    }
  },
  mounted() {
    this.updateInfo()
    this.getRanks()
  },
  methods: {
    async updateInfo() {
      const response = (
        await axios.get(
          'http://localhost:1337/api/clientes/' + this.$props.id + '/?populate=Imagen&populate=idRango'
        )
      ).data.data.attributes
      this.serviceInfo = response
      this.name = response.Nombre
      this.email = response.Correo
      this.telf = response.Telefono
      this.tickets = response.Tickets
      this.cartera = response.Cartera
      this.imgUrl = response.Imagen.data.attributes.url
      this.imgId = response.Imagen.data.id
      this.rank=response.idRango.data.id
    },
    onFileChange(){
        if(event.target.files[0]!=undefined){
            const file = event.target.files[0];
            this.imageToAdd = file;
            this.imgUrl = URL.createObjectURL(file);
        }
    },
    async deleteService(){
        if(confirm("¿Estás seguro de eliminar el cliente?")){
            if(confirm("¿Estás completamente seguro de eliminar el cliente?")){
                if(this.imgId!=40){
                  await axios.delete('http://localhost:1337/api/upload/files/' + this.imgId)
                }
                await axios.delete('http://localhost:1337/api/clientes/' + this.$props.id)
                router.push("/productos")
            }
        }
    },
    async getRanks(){
      const response = (
        await axios.get(
          'http://localhost:1337/api/rangos'
        )
      ).data.data
      this.ranks = response
    },
    async updateService(){
      if(this.imageToAdd){
        await axios.delete('http://localhost:1337/api/upload/files/' + this.imgId)

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
            Correo: this.email,
            Telefono: this.telf,
            Imagen: this.imgId,
            Tickets:this.tickets,
            Cartera:this.cartera,
            idRango:this.rank
          }
      };
      await axios.put('http://localhost:1337/api/clientes/'+this.$props.id, serviceData);
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
            <v-text-field hide-details="auto" label="Correo" v-model="email" />
          </v-col>

          <v-col class="center-content" style="color: white">
            <v-text-field hide-details="auto" label="Telefono" v-model="telf" />
          </v-col>
          <v-col />
        </v-row>
        <v-row>
          <v-col />
          <v-col class="center-content" style="color: white">
            <v-text-field hide-details="auto" label="Tickets" v-model="tickets"/>
          </v-col>
          <v-col class="center-content" style="color: white">
            <v-text-field hide-details="auto" label="Cartera" v-model="cartera" />€
          </v-col>
          <v-col class="center-content" style="color: white">
            <v-select hide-details="auto" :items="ranks" item-title="attributes.Nombre" item-value="id" v-model="rank"></v-select>
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
