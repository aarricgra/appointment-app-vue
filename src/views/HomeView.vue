<script setup>
import ChartClientes from '@/components/ChartClientes.vue';
import ChartServicios from '@/components/ChartServicios.vue';
import ChartHoras from '@/components/ChartHoras.vue';

</script>

<template>
  <div class="card">
    <ChartClientes/>
  </div>
  <div class="main-row2">
    <div class="card" style="flex:1">
      <ChartServicios/>
    </div>
    <div  class="card" style="flex:1">
      <ChartHoras/>
    </div>
  </div>
</template>
