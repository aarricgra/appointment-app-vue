<template>
  <div class="chart-container">
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      ref="lineChart"
    />
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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)
ChartJS.defaults.color = "white"

export default {
  name: 'LineChart',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  data() {
    return {
      chartData: {
        labels: this.getDaysInCurrentMonth(),
        datasets: [{
          label: "Clientes",
          data: this.randomValues(), // Example data, adjust as needed
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
    this.$nextTick(() => {
      // Ensure the chart fills its container
      this.resizeChart()
      window.addEventListener('resize', this.resizeChart)
    })
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
    resizeChart() {
      if (this.$refs.lineChart) {
        this.$refs.lineChart.chartObject.resize()
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}
</style>
