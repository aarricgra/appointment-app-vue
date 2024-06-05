<script>
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es'); // Set locale to Spanish
console.log(moment.locale);

export default {
  data() {
    return {
      selectedDay: moment().format('YYYY-MM-DD'),
      firstDay: moment().startOf('week').format('D [de] MMMM'),
      lastDay: moment().endOf('week').format('D [de] MMMM')
    };
  },
  watch: {
    selectedDay(newValue) {
      this.updateWeekBounds(newValue);
    }
  },
  methods: {
    updateWeekBounds(date) {
      this.firstDay = moment(date).startOf('week').format('D [de] MMMM');
      this.lastDay = moment(date).endOf('week').format('D [de] MMMM');
    }
  }
};
</script>

<template>
  <div class="calendarContaier">
    <v-row class="monthPicker">
      <v-col style="background-color: bisque; font-size: 2em;color:white">
        <v-row>
          <v-col cols="1" class="pa-0 text-md-left" >
            <i class="fa-sharp fa-regular fa-circle-left"></i>
          </v-col>
          <v-col cols="1" class="pa-0 text-md-right">
            <i class="fa-sharp fa-regular fa-circle-right"></i>
          </v-col>
          <v-col class="pa-0 pl-4 text-md-left">
            <p>{{ firstDay + " - " + lastDay }}</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6"/>
    </v-row>
  </div>
</template>

<style>
.calendarContaier {
  background-color: aqua;
}
.menuIcon {
  width: 30px;
}
.monthPicker {
  background-color: rgb(255, 127, 138)
}
v-col {
  padding: 0;
}
</style>
