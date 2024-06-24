<template>
  <div style="color: white">
    <v-row>
      <v-col />
      <v-col cols="7" class="center-content">
        <v-btn @click="exportJson" style="margin-left: 10px"> Exportar </v-btn>
      </v-col>
      <v-col />
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: {
        servicios: [],
        productos: [],
        rangos: [],
        clientes: [],
        reservas: [],
        superusers: []
      }
    }
  },
  methods: {
    async exportJson() {
      await this.getServices()
      await this.getProducts()
      await this.getRangos()
      await this.getClientes()
      await this.getReservas()
      await this.getSuperUsers()

      const jsonData = JSON.stringify(this.data)
      const file = new Blob([jsonData], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file)
      a.download = 'BackUp.json'
      a.click()
    },
    async getServices() {
      const resp = await axios.get('http://localhost:1337/api/servicios/?populate=Imagen')
      let tempArray = []
    
      resp.data.data.forEach((element) => {
        let tempData={}
        if (element.attributes.Imagen.data) {
          tempData = {
          Nombre: element.attributes.Nombre,
          Precio: element.attributes.Precio,
          Oferta: element.attributes.Oferta,
          Imagen: element.attributes.Imagen.data[0].id 
        }
        }else{
          tempData = {
          Nombre: element.attributes.Nombre,
          Precio: element.attributes.Precio,
          Oferta: element.attributes.Oferta
        }
        }
        
        tempArray.push(tempData)
      })
      this.data.servicios = tempArray
    },
    async getProducts() {
      const resp = await axios.get('http://localhost:1337/api/productos/?populate=Imagen')
      let tempArray = []
      resp.data.data.forEach((element) => {
        console.log("product",element);
        let tempData={}
        if (element.attributes.Imagen.data) {
          tempData = {
          Nombre: element.attributes.Nombre,
          Precio: element.attributes.Precio,
          Oferta: element.attributes.Oferta,
          Imagen: element.attributes.Imagen.data[0].id 
        }
        }else{
          tempData = {
          Nombre: element.attributes.Nombre,
          Precio: element.attributes.Precio,
          Oferta: element.attributes.Oferta
        }
        }
        tempArray.push(tempData)
      })
      this.data.productos = tempArray
    },
    async getRangos() {
      const resp = await axios.get('http://localhost:1337/api/rangos')
      let tempArray = []
      resp.data.data.forEach((element) => {
        let tempData = {
          Nombre: element.attributes.Nombre
        }
        tempArray.push(tempData)
      })
      this.data.rangos = tempArray
    },
    async getClientes() {
      const resp = await axios.get('http://localhost:1337/api/clientes/?populate=idRango')
      let tempArray = []
      resp.data.data.forEach((element) => {
        let tempData = {
          Nombre: element.attributes.Nombre,
          Telefono: element.attributes.Telefono,
          Correo: element.attributes.Correo,
          Password: element.attributes.Password,
          Cartera: element.attributes.Cartera,
          Tickets: element.attributes.Tickets,
          idRango: element.attributes.idRango.data.attributes.Nombre
        }
        tempArray.push(tempData)
      })
      this.data.clientes = tempArray
    },
    async getReservas() {
      const resp = await axios.get(
        'http://localhost:1337/api/reservas/?populate=idCliente&populate=idServicio'
      )
      let tempArray = []
      resp.data.data.forEach((element) => {
        let tempData = {}
        if (element.attributes.idCliente.data) {
          tempData = {
            Fecha: element.attributes.Fecha,
            Hora: element.attributes.Hora,
            idCliente: element.attributes.idCliente.data.attributes.Correo,
            idServicio: element.attributes.idServicio.data.attributes.Nombre,
            Coste: element.attributes.Coste
          }
        } else {
          tempData = {
            Fecha: element.attributes.Fecha,
            Hora: element.attributes.Hora,
            idServicio: element.attributes.idServicio.data.attributes.Nombre,
            Coste: element.attributes.Coste
          }
        }
        tempArray.push(tempData)
      })
      this.data.reservas = tempArray
    },
    async getSuperUsers() {
      const resp = await axios.get('http://localhost:1337/api/superusers')
      let tempArray = []
      resp.data.data.forEach((element) => {
        let tempData = {
          Usuario: element.attributes.Usuario,
          Password: element.attributes.Password
        }
        tempArray.push(tempData)
      })
      this.data.superusers = tempArray
    }
  }
}
</script>

<style scoped></style>
