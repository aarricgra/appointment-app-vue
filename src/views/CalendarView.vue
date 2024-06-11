<template>
  <div>
    <v-row>
      <v-col style="font-size: 2em; color: white">
        <v-row class="g-4" style="padding-bottom: 10px">
          <v-col cols="10" class="pa-0 text-md-left" style="display: flex; align-items: center">
            <v-btn @click="updateSelected(-1)" style="font-size: 1em" :ripple="true" variant="text">
              <i class="fa-sharp fa-regular fa-circle-left"></i>
            </v-btn>
            <v-btn @click="updateSelected(1)" style="font-size: 1em" :ripple="true" variant="text">
              <i class="fa-sharp fa-regular fa-circle-right"></i>
            </v-btn>
            <p>{{ firstDay }} - {{ lastDay }}</p>
          </v-col>
          <v-col>
            <v-btn v-if="!isBlocking" @click="isBlocking = !isBlocking"> Bloquear </v-btn>
            <v-btn v-else @click="blockAppointments()"> Guardar </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="calHeader"><p></p></v-col>
      <v-col v-for="day in weekArray" :key="day" class="calHeader">
        {{ getWeekDayName(day) }} {{ day.split('-')[2] }}
      </v-col>
    </v-row>
    <v-row v-for="time in timeArray" :key="time">
      <v-col class="calHeader d-flex align-center justify-center"
        ><p>{{ time }}</p></v-col
      >
      <v-col
        v-for="day in weekArray"
        :key="day"
        class="calHeader d-flex align-center justify-center"
      >
        <div v-if="checkDateTime(day, time)">
          
          <router-link :to="{name:'appointment',params:{id:checkDateTime(day, time).id}}" v-if="checkDateTime(day, time).attributes.idServicio.data.id != 1">
            <div>
              {{ checkDateTime(day, time).attributes.idCliente.data.attributes.Nombre }}<br /><br />
            {{ checkDateTime(day, time).attributes.idServicio.data.attributes.Nombre }}
            </div>
          </router-link>
          <div v-else>
            <p style="color:red">Cerrado</p>
            
            <div v-if="isBlocking">
              <br />
              <span class="text-h4">
                <i
                v-if="appointsToOpen.includes(checkDateTime(day, time).id)"
                class="fa-solid fa-lock-open"
                @click="addOpenAppoint(checkDateTime(day, time).id)"
                style="color: green"
              ></i>
              <i v-else class="fa-solid fa-lock" @click="addOpenAppoint(checkDateTime(day, time).id)" style="color:red"></i>
              </span>
            </div>
          </div>
        </div>
        <div v-else-if="isBlocking">
          <span class="text-h4">
            <i
            v-if="appointsToBlock.includes(day + ' ' + time)"
            class="fa-solid fa-lock"
            @click="addBlockAppoint(day, time)"
            style="color:red"
          ></i>
          <i v-else class="fa-solid fa-lock-open" @click="addBlockAppoint(day, time)" style="color:green"></i>
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'

export default {
  data() {
    return {
      selectedDay: moment().format('YYYY-MM-DD'),
      firstDay: moment().startOf('week').format('D [de] MMMM'),
      lastDay: moment().endOf('week').format('D [de] MMMM'),
      weekArray: [],
      timeArray: [],
      weekAppointments: [],
      isBlocking: false,
      appointsToBlock: [],
      appointsToOpen: []
    }
  },
  mounted() {
    this.initializeCalendar()
  },
  methods: {
    async initializeCalendar() {
      this.updateArray()
      this.genTimeArray()
      await this.updateAppointments()
    },
    async updateSelected(weeks) {
      this.selectedDay = moment(this.selectedDay).add(weeks, 'weeks').format('YYYY-MM-DD')
      this.firstDay = moment(this.selectedDay).startOf('week').format('D [de] MMMM')
      this.lastDay = moment(this.selectedDay).endOf('week').format('D [de] MMMM')
      this.updateArray()
      await this.updateAppointments()
    },
    updateArray() {
      this.weekArray = Array.from({ length: 7 }, (_, i) =>
        moment(this.selectedDay).startOf('week').add(i, 'days').format('YYYY-MM-DD')
      )
    },
    genTimeArray() {
      const start = moment('08:00', 'HH:mm')
      const end = moment('23:00', 'HH:mm')
      const interval = 25
      this.timeArray = []

      while (start <= end) {
        this.timeArray.push(start.format('HH:mm'))
        start.add(interval, 'minutes')
      }
    },
    async updateAppointments() {
      const firstDay = moment(this.selectedDay).startOf('week').format('YYYY-MM-DD')
      const lastDay = moment(this.selectedDay).endOf('week').format('YYYY-MM-DD')
      const response = await axios.get(
        `http://localhost:1337/api/reservas?populate=*&filters[Fecha][$gte]=${firstDay}&filters[Fecha][$lte]=${lastDay}`
      )
      this.weekAppointments = response.data.data
    },
    getWeekDayName(day) {
      return moment(day).format('dd')
    },
    checkDateTime(date, time) {
      return this.weekAppointments.find((app) => {
        const [hour, minute] = app.attributes.Hora.split(':')
        const parsedTime = `${hour}:${minute}`
        return app.attributes.Fecha === date && parsedTime === time
      })
    },
    addBlockAppoint(day, time) {
      if (this.appointsToBlock.includes(day + ' ' + time)) {
        this.appointsToBlock.splice(this.appointsToBlock.indexOf(day + ' ' + time), 1)
      } else {
        this.appointsToBlock.push(day + ' ' + time)
      }
    },
    addOpenAppoint(index) {
      if (this.appointsToOpen.includes(index)) {
        this.appointsToOpen.splice(this.appointsToOpen.indexOf(index), 1)
      } else {
        this.appointsToOpen.push(index)
      }
    },
    async blockAppointments() {
      //Bloquear dias
      for (const dateTime of this.appointsToBlock) {
        let day = dateTime.split(' ')[0]
        let time = dateTime.split(' ')[1] + ':00.000'
        const data = JSON.stringify({
          data: {
            Fecha: day,
            Hora: time,
            idServicio: 1
          }
        })

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:1337/api/reservas',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        }

        try {
          await axios.request(config)
        } catch (error) {
          console.error('Error posting appointment:', error)
        }
      }

      //Desbloquear dias
      for (const index of this.appointsToOpen) {
        try {
          await axios.delete("http://localhost:1337/api/reservas/"+index)
        } catch (error) {
          console.error('Error posting appointment:', error)
        }
      }

      this.appointsToBlock=[]
      this.appointsToOpen=[]
      this.isBlocking = !this.isBlocking
      this.updateAppointments()
    }
  }
}
</script>

<style>
.calHeader {
  border: 1px solid gray;
  color: white;
  font-weight: bold;
  text-align: center;
  align-items: center;
}
v-col {
  padding: 0;
}
a{
  text-decoration: none;
  color:inherit
}
</style>
