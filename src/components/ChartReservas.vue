<template>
  <div class="chart-container" style="padding-bottom:70px;">
    <v-row>
      <v-col class="d-flex align-center justify-center">
        <v-btn @click="changeMonth(-1)"> Anterior </v-btn>
        <h1 style="color: white; padding:0 10px 0 10px">{{ getMonth(this.selectedMonth) }}</h1>
        <v-btn @click="changeMonth(1)"> Siguiente </v-btn>
      </v-col>
    </v-row>

    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import axios from 'axios'
import moment from 'moment'

moment.locale('es')

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)
ChartJS.defaults.color = 'white'

export default {
  name: 'appointmentChart',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  data() {
    return {
      addmonth: 0,
      appointments: [],
      selectedMonth: moment().format('YYYY-MM-DD'),
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Reservas',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            tension: 0.3
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  mounted() {
    this.getAppointments()
  },
  methods: {
    getMonth(date){
      return moment(date).format("MMMM")
    },
    getDaysInMonth(year, month) {
      //Coger ultimo dia del mes
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      //hacer una array con esa cantidad de dias
      return Array.from({ length: daysInMonth }, (_, i) => i + 1)
    },
    changeMonth(value) {
      if(value>0){
        this.selectedMonth=moment(this.selectedMonth).add(1,"month").format("YYYY-MM-DD")
      }else{
        this.selectedMonth=moment(this.selectedMonth).subtract(1,"month").format("YYYY-MM-DD")
      }
      this.getAppointments()
    },
    async getAppointments() {
      try {
        const firstDay = moment(this.selectedMonth).startOf("month").format('YYYY-MM-DD')
        const lastDay = moment(this.selectedMonth).endOf("month").format('YYYY-MM-DD')

        const response = await axios.get(
          `http://localhost:1337/api/reservas?populate=*&filters[Fecha][$gte]=${firstDay}&filters[Fecha][$lte]=${lastDay}`
        )
        const appointments = response.data.data

        this.updateChart(appointments, moment(this.selectedMonth).format("YYYY"), moment(this.selectedMonth).format("MM"))
      } catch (error) {
        console.log(error)
      }
    },
    updateChart(appointments, year, month) {
      const daysInMonth = this.getDaysInMonth(year, month)
      const data = Array.from({ length: daysInMonth.length }, () => 0)

      appointments.forEach((element) => {
        const day = moment(element.attributes.Fecha).date()
        data[day - 1]++
      })

      this.chartData = {
        labels: daysInMonth,
        datasets: [
          {
            label: 'Reservas',
            data: data,
            backgroundColor: Array(daysInMonth.length).fill('rgba(75, 192, 192, 0.2)'),
            borderColor: Array(daysInMonth.length).fill('rgba(75, 192, 192, 1)'),
            borderWidth: 1,
            tension: 0.3
          }
        ]
      }
    }
  }
}
</script>
