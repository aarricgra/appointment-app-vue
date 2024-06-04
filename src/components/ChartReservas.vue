<template>
  <div class="chart-container">
    <p>{{ appointments }}</p>
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <button v-on:click="addmonth-=1;this.getAppointments()">
      {{margen}}
    </button>
    <button v-on:click="addmonth+=1;this.getAppointments()">
      {{margen}}
    </button>
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
ChartJS.defaults.color = "white"

export default {
  name: 'appointmentChart',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  data() {
    return {
      addmonth:0,
      margen:"",
      appointments: [],
      chartData: {
        labels: this.getDaysInCurrentMonth(),
        datasets: [{
          label: "Clientes",
          data: this.appointments, // Example data, adjust as needed
          backgroundColor: Array(this.getDaysInCurrentMonth().length).fill('rgba(75, 192, 192, 0.2)'),
          borderColor: Array(this.getDaysInCurrentMonth().length).fill('rgba(75, 192, 192, 1)'),
          borderWidth: 1,
          tension: 0.3
        }],
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
    getDaysInCurrentMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    },
    randomValues(){
      return Array.from({ length: this.getDaysInCurrentMonth().length }, () => Math.floor(Math.random() * 20));
    },
    async getAppointments(){
      try{
      var date = new Date();
      var firstDay = moment(new Date(date.getFullYear(), date.getMonth()+this.addmonth, 1)).format("YYYY-MM-DD");
      var lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1+this.addmonth, 0)).format("YYYY-MM-DD")
      this.margen=(firstDay+"///"+lastDay)
      const response = await axios.get('http://localhost:1337/api/reservas?populate=*&filters[Fecha][$gte]='+firstDay+'&filters[Fecha][$lte]='+lastDay)
      this.appointments = response.data.data
      this.updateChart(this.appointments)
    }catch(e){
      console.log(e);
    }
    },updateChart(info){
      var array = Array.from({length: this.getDaysInCurrentMonth().length},() => Math.floor(Math.random() * 0))
      info.forEach(element => {
        array[moment(element.attributes.Fecha).format("DD")-1]+=1;
      })
      this.appointments=array
    }
  },
}
</script>

<style>

</style>
