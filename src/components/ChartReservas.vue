<template>
  <div class="chart-container">
    <p>{{ appointments }}</p>
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <button @click="changeMonth(-1)">
      Previous Month
    </button>
    <button @click="changeMonth(1)">
      Next Month
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
      addmonth: 0,
      appointments: [],
      chartData: {
        labels: [],
        datasets: [{
          label: "Reservas",
          data: [],
          backgroundColor: [],
          borderColor: [],
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
    this.getAppointments();
  },
  methods: {
    getDaysInMonth(year, month) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    },
    changeMonth(value) {
      this.addmonth += value;
      this.getAppointments();
    },
    async getAppointments() {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + this.addmonth;
        const firstDay = moment(new Date(year, month, 1)).format("YYYY-MM-DD");
        const lastDay = moment(new Date(year, month + 1, 0)).format("YYYY-MM-DD");

        const response = await axios.get(`http://localhost:1337/api/reservas?populate=*&filters[Fecha][$gte]=${firstDay}&filters[Fecha][$lte]=${lastDay}`);
        const appointments = response.data.data;

        this.updateChart(appointments, year, month);
      } catch (error) {
        console.log(error);
      }
    },
    updateChart(appointments, year, month) {
      const daysInMonth = this.getDaysInMonth(year, month);
      const data = Array.from({ length: daysInMonth.length }, () => 0);

      appointments.forEach(element => {
        const day = moment(element.attributes.Fecha).date();
        data[day - 1]++;
      });

      this.chartData = {
        labels: daysInMonth,
        datasets: [{
          label: "Reservas",
          data: data,
          backgroundColor: Array(daysInMonth.length).fill('rgba(75, 192, 192, 0.2)'),
          borderColor: Array(daysInMonth.length).fill('rgba(75, 192, 192, 1)'),
          borderWidth: 1,
          tension: 0.3
        }],
      };
    }
  }
}
</script>
