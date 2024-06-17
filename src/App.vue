<script>
import axios from 'axios';
import moment from 'moment'
import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      isLoged: false,
      user: '',
      password: ''
    }
  },
  methods: {
    async handleLogin(){
      const resp =await axios.get('http://localhost:1337/api/superusers/?filters[Usuario][$eq]='+this.user+"&filters[Password][$eq]="+this.password)
      if((resp.data.data).length){
        localStorage.setItem('user',resp.data.data)
        this.isLoged=true
      }
    }
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.isLoged = true
    }
  }
}

moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'Lun_Mar_Mie_Jue_Vie_Sáb_Dom'.split('_')
})
</script>

<template>
  <div v-if="isLoged">
    <div class="menu">
      <RouterLink to="/" class="menuElement">Gráficos</RouterLink>
      <RouterLink to="/calendar" class="menuElement">Calendario</RouterLink>
      <RouterLink to="/servicios" class="menuElement">Servicios</RouterLink>
      <RouterLink to="/productos" class="menuElement">Productos</RouterLink>
      <RouterLink to="/clientes" class="menuElement">Clientes</RouterLink>
      <RouterLink to="/import" class="menuElement">Importar</RouterLink>
      <RouterLink to="/export" class="menuElement">Exportar</RouterLink>
    </div>
    <div class="main">
      <RouterView />
    </div>
  </div>
  <div
    v-else
    style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center"
  >
    <div
      style="
        background-color: rgb(38, 40, 60);
        padding: 20px;
        border: 2px solid grey;
        border-radius: 30px;
        width: 350px;
      "
    >
      <v-text-field
        hide-details="auto"
        label="Usuario"
        v-model="user"
        style="color: white; margin-bottom: 20px"
      />
      <v-text-field
        type="password"
        hide-details="auto"
        label="Contraseña"
        v-model="password"
        style="color: white; margin-bottom: 20px"
      />
      <div
        style="
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <v-btn color="grey" @click="handleLogin()">Iniciar sesión</v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
