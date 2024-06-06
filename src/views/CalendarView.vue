<template>
  <div>
    <v-row>
      <v-col style="font-size: 2em; color: white">
        <v-row style="max-width: fit-content" class="g-4">
          <v-col cols="12" class="pa-0 text-md-left" style="display: flex; align-items: center">
            <v-btn @click="updateSelected(-1)" style="font-size: 1em" :ripple="true" variant="text">
              <i class="fa-sharp fa-regular fa-circle-left"></i>
            </v-btn>
            <v-btn @click="updateSelected(1)" style="font-size: 1em" :ripple="true" variant="text">
              <i class="fa-sharp fa-regular fa-circle-right"></i>
            </v-btn>
            <p>{{ firstDay }} - {{ lastDay }}</p>
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
      <v-col class="calHeader d-flex align-center justify-center"><p>{{ time }}</p></v-col>
      <v-col v-for="day in weekArray" :key="day" class="calHeader d-flex align-center justify-center">
        <p v-if="checkDateTime(day, time)">
          {{ checkDateTime(day, time).attributes.idCliente.data.attributes.Nombre }}<br/><br/>
          {{ checkDateTime(day, time).attributes.idServicio.data.attributes.Nombre }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';

export default {
  data() {
    return {
      selectedDay: moment().format('YYYY-MM-DD'),
      firstDay: moment().startOf('week').format('D [de] MMMM'),
      lastDay: moment().endOf('week').format('D [de] MMMM'),
      weekArray: [],
      timeArray: [],
      weekAppointments: []
    };
  },
  mounted() {
    this.initializeCalendar();
  },
  methods: {
    async initializeCalendar() {
      this.updateArray();
      this.genTimeArray();
      await this.updateAppointments();
    },
    async updateSelected(weeks) {
      this.selectedDay = moment(this.selectedDay).add(weeks, 'weeks').format('YYYY-MM-DD');
      this.firstDay = moment(this.selectedDay).startOf('week').format('D [de] MMMM');
      this.lastDay = moment(this.selectedDay).endOf('week').format('D [de] MMMM');
      this.updateArray();
      await this.updateAppointments();
    },
    updateArray() {
      this.weekArray = Array.from({ length: 7 }, (_, i) => moment(this.selectedDay).startOf('week').add(i, 'days').format('YYYY-MM-DD'));
    },
    genTimeArray() {
      const start = moment('08:00', 'HH:mm');
      const end = moment('23:00', 'HH:mm');
      const interval = 25;
      this.timeArray = [];

      while (start <= end) {
        this.timeArray.push(start.format('HH:mm'));
        start.add(interval, 'minutes');
      }
    },
    async updateAppointments() {
      const firstDay = moment(this.selectedDay).startOf('week').format('YYYY-MM-DD');
      const lastDay = moment(this.selectedDay).endOf('week').format('YYYY-MM-DD');
      const response = await axios.get(`http://localhost:1337/api/reservas?populate=*&filters[Fecha][$gte]=${firstDay}&filters[Fecha][$lte]=${lastDay}`);
      this.weekAppointments = response.data.data;
    },
    getWeekDayName(day) {
      return moment(day).format('dd');
    },
    checkDateTime(date, time) {
      return this.weekAppointments.find(app => {
        const [hour, minute] = app.attributes.Hora.split(':');
        const parsedTime = `${hour}:${minute}`;
        return app.attributes.Fecha === date && parsedTime === time;
      });
    }
  }
};
</script>

<style>
.calHeader {
  border: 1px solid gray;
  color: white;
  font-weight: bold;
  text-align: center;
  align-items: center
}
v-col {
  padding: 0;
}
</style>
