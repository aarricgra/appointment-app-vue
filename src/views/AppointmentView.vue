<script>
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'

export default {
  props: ['id'],
  data(){
    return {
        appointmentInfo:null,
        clientInfo:null,
        serviceInfo:null
    }
  },mounted(){
    this.updateInfo()
  },
  methods:{
    async updateInfo(){
        const response = (await axios.get("http://localhost:1337/api/reservas/"+this.$props.id+"/?populate[idServicio][populate]=Imagen&populate=idCliente")).data.data.attributes
        console.log(response);
        this.appointmentInfo=response
        this.clientInfo=response.idCliente.data.attributes
        this.serviceInfo=response.idServicio.data.attributes
    },
    formatTime(time){
        let newTime = moment(time,"HH:mm:ssss").format("HH:mm")
        return newTime
    },
    formatDate(date){
        let newDate = moment(date).format("YYYY/MM/DD")
        return newDate
    }
  }
}
</script>

<template>
    <div>
        <v-row v-if="appointmentInfo!=null">
            <v-col/>
            <v-col cols="8">
                <v-row>
                    <v-col style="text-align: center;">
                        <img :src="'http://localhost:1337'+serviceInfo.Imagen.data[0].attributes.url" alt="alternatetext" style="width: 250px; border-radius: 20px;">
                    </v-col>
                </v-row>
                <v-row>
                    <v-col style="color: white; font-size: 2em;text-align: center">
                        <p>{{ serviceInfo.Nombre }}</p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col style="text-align: center; color: white;font-size: 2em;">
                        <div style="display: flex; flex-direction: row;justify-content: center;align-content: center;gap:10px">
                            <i class="fa-regular fa-calendar-days" style="padding-top:5px;"></i>   
                            <p>{{ formatDate(appointmentInfo.Fecha)  }} - {{ formatTime(appointmentInfo.Hora)}}</p>   
                        </div>
                        
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p class="formText">Cliente: {{ clientInfo.Nombre  }}</p>
                    </v-col>
                </v-row>
                
            </v-col>
            <v-col/>
        </v-row>
    </div>
</template>

<style>
.formText{
    color: white;
    font-size: 20px;
    text-align: center;
}
</style>