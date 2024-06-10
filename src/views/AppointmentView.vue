<script>
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'

export default {
  props: ['id'],
  data(){
    return {
        appointmentInfo:null
    }
  },mounted(){
    this.updateInfo()
  },
  methods:{
    async updateInfo(){
        const response = (await axios.get("http://localhost:1337/api/reservas/"+this.$props.id+"/?populate=*")).data.data.attributes
        this.appointmentInfo=response
    },
    formatTime(time){
        let newTime = moment(time,"HH:mm:ssss")
        return newTime
    }
  }
}
</script>

<template>
    <div>
        <v-row v-if="appointmentInfo!=null">
            <v-col/>
            <v-col cols="8" style="border:10px solid grey;padding: 20px">
                <v-row>
                    <v-col>
                        <p class="formText">Fecha: {{ appointmentInfo.Fecha  }}</p>
                    </v-col>
                    <v-col>
                        <p class="formText">Hora: {{ appointmentInfo.Hora  }}</p>
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
}
</style>