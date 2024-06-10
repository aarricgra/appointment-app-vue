<script setup>
import { RouterLink, RouterView } from 'vue-router'
import moment from 'moment';

moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'Lun_Mar_Mie_Jue_Vie_Sáb_Dom'.split('_'),
});
</script>

<template>
  <div class="menu">
    <RouterLink to="/" class="menuElement">Home</RouterLink>
    <RouterLink to="/calendar" class="menuElement">Calendario</RouterLink>
  </div>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
