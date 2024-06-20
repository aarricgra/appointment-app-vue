<template>
  <div style="color: white">
    <v-snackbar v-model="snackbar"> Import realizados </v-snackbar>
    <v-row>
      <v-col />
      <v-col cols="7">
        <v-row>
          <v-col class="center-content">
            <input type="file" id="file-input" style="display: none" @change="handleFileUpload" />

            <label for="file-input" style="height: 90px" class="center-content">
              <i class="fa-solid fa-file"></i>
            </label>
            <p style="margin-left: 10px" v-if="file">{{ file.name }}</p>
            <v-btn @click="uploadFile" style="margin-left: 10px"> Validar </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="center-content" v-if="validationResult">
            <v-btn @click="importFile" style="margin-left: 10px"> Importar </v-btn>
          </v-col>
          <v-col v-else-if="validationErrors">
            <h1>No valido</h1>
            <br />
            <p>{{ validationErrors }}</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col />
    </v-row>
  </div>
</template>

<script>
import Ajv from 'ajv'
import axios from 'axios'

export default {
  data() {
    return {
      file: null,
      validationResult: null,
      validationErrors: null,
      jsonSchema: null,
      fileContent: null,
      snackbar: false
    }
  },
  async created() {
    //Importo el Schema
    this.jsonSchema = await fetch('/src/schemas/schema.json').then((res) => res.json())
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]
    },
    async uploadFile() {
      if (!this.file) {
        alert('Elige un archivo primero')
        return
      }

      this.fileContent = await this.readFile(this.file)

      //Si es un json intento validarlo
      if (this.file.type === 'application/json') {
        this.validateJson()
      } else {
        alert('Tipo de archivo no soportado')
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(e)
        reader.readAsText(file)
      })
    },
    validateJson() {
      const ajv = new Ajv()
      const validate = ajv.compile(this.jsonSchema)
      const data = JSON.parse(this.fileContent)

      if (validate(data)) {
        this.validationResult = true
      } else {
        this.validationErrors = validate.errors
      }
    },
    async importFile() {
      try {
        await this.deleteAllInfo()
        await this.postWithChilds()
      } catch (error) {
        console.error('Error importing file:', error)
      }
    },

    async deleteAllInfo() {
      // Perform deletions for each endpoint
      const deleteRequests = []

      const respServ = await axios.get('http://localhost:1337/api/servicios')
      respServ.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/servicios/' + element.id))
      })

      const respProd = await axios.get('http://localhost:1337/api/productos')
      respProd.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/productos/' + element.id))
      })

      const respRang = await axios.get('http://localhost:1337/api/rangos')
      respRang.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/rangos/' + element.id))
      })

      const respCli = await axios.get('http://localhost:1337/api/clientes')
      respCli.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/clientes/' + element.id))
      })

      const respRes = await axios.get('http://localhost:1337/api/reservas')
      respRes.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/reservas/' + element.id))
      })

      const respSup = await axios.get('http://localhost:1337/api/superusers')
      respSup.data.data.forEach((element) => {
        deleteRequests.push(axios.delete('http://localhost:1337/api/superusers/' + element.id))
      })

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests)
    },
    async postNoChilds() {
      const postRequests = []

      JSON.parse(this.fileContent).servicios.forEach(async (element) => {
        let tempData = { data: element }
        if(tempData.data.Imagen){
          try{
            await axios.get('http://localhost:1337/api/upload/files/'+tempData.data.Imagen)
          }catch (error){
            delete tempData.data.Imagen
          }
        }
        postRequests.push(axios.post('http://localhost:1337/api/servicios', tempData))
      })

      JSON.parse(this.fileContent).productos.forEach(async (element) => {
        let tempData = { data: element }
        if(tempData.data.Imagen){
          try{
            await axios.get('http://localhost:1337/api/upload/files/'+tempData.data.Imagen)
          }catch (error){
            delete tempData.data.Imagen
          }
        }
        postRequests.push(axios.post('http://localhost:1337/api/productos', tempData))
      })

      JSON.parse(this.fileContent).rangos.forEach((element) => {
        let tempData = { data: element }
        postRequests.push(axios.post('http://localhost:1337/api/rangos', tempData))
      })

      JSON.parse(this.fileContent).superusers.forEach((element) => {
        let tempData = { data: element }
        postRequests.push(axios.post('http://localhost:1337/api/superusers', tempData))
      })

      await Promise.all(postRequests)
    },
    async postWithChilds() {
      await this.postNoChilds()

      // Now process postWithChilds logic
      const postRequests = []

      await Promise.all(
        JSON.parse(this.fileContent).clientes.map(async (element) => {
          let tempData = { data: element }
          // Assuming you need to fetch additional data from the server first
          const idRangoData = await axios.get(
            'http://localhost:1337/api/rangos/?filters[Nombre][$eq]=' + tempData.data.idRango
          )
          tempData.data.idRango = idRangoData.data.data[0].id

          postRequests.push(axios.post('http://localhost:1337/api/clientes', tempData))
        })
      )

      await Promise.all(
        JSON.parse(this.fileContent).reservas.map(async (element) => {
          let tempData = { data: element }
          // Assuming you need to fetch additional data from the server first
          
          if(tempData.data.idCliente){
            const idCliente = await axios.get(
            'http://localhost:1337/api/clientes/?filters[Correo][$eq]=' + tempData.data.idCliente
          )
            tempData.data.idCliente = idCliente.data.data[0].id
          }

          const idServicio = await axios.get(
            'http://localhost:1337/api/servicios/?filters[Nombre][$eq]=' + tempData.data.idServicio
          )
          tempData.data.idServicio = idServicio.data.data[0].id

          postRequests.push(axios.post('http://localhost:1337/api/reservas', tempData))
        })
      )

      // Wait for all post requests to complete
      await Promise.all(postRequests)
      this.snackbar=!this.snackbar
    }
  }
}
</script>

<style scoped></style>
