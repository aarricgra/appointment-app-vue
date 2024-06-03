<template>
  <Pie
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'PieChart',
  components: { Pie },
  data() {
    return {
      chartData: {
        labels: ["Realizadas", "Perdidas"],
        datasets: [{
          label: "Servicios Realizados",
          data: this.randomValues(), // Example data, adjust as needed
          backgroundColor: ["rgb(194, 248, 255)", "rgb(245, 149, 153)"], // Corrected colors
        }],
      },
      chartOptions: {
        responsive: true,
        aspectRatio:2
      }
    }
  },
  methods: {
    randomValues() {
      const realizadas = Math.floor(Math.random() * 30) + 70;
      return [realizadas, 100 - realizadas]
    }
  }
}
</script>

<style>
/* Add any styles if needed */
</style>
