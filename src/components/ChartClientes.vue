<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.defaults.color = "white"

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: this.getDaysInCurrentMonth(),
        datasets: [{
          label: "Clientes",
          data: this.randomValues(), // Example data, adjust as needed
          backgroundColor: Array(this.getDaysInCurrentMonth().length).fill('rgba(75, 192, 192, 0.2)'),
          borderColor: Array(this.getDaysInCurrentMonth().length).fill('rgba(75, 192, 192, 1)'),
          borderWidth: 1
        }],
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
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
      return Array.from({ length: this.getDaysInCurrentMonth().length }, () => Math.floor(Math.random() * 100));
    }
  }
}
</script>

<style>
/* Add any styles if needed */
</style>
