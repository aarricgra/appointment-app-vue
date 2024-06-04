<template>
  <div class="chart-container">
<Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
  </div>
  
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
        labels: ["Afeitado","Degradado","Corte","Masaje"],
        datasets: [{
          label: "Servicios Realizados",
          data: this.randomValues(), // Example data, adjust as needed
          backgroundColor: Array(this.getServices().length).fill('rgba(75, 192, 192, 0.2)'),
          borderColor: Array(this.getServices().length).fill('rgba(75, 192, 192, 1)'),
          borderWidth: 1
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
    
  },methods: {
    getServices(){
      return ["Afeitado","Degradado","Corte","Masaje"]
    },
    randomValues(){
      return Array.from({ length: this.getServices().length }, () => Math.floor(Math.random() * 20));
    },
    getAppointments(){
      
    }
  }
}
</script>

<style>
/* Add any styles if needed */
</style>
