<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-000001 -->
<template>
  <div>




    <p></p>

      <div v-for="usuario in listadoUsuarios" >
        <div v-if="usuarioActualId === usuario.folio" class="mb-4 p-4 border rounded">
            <h3 class="text-lg font-bold">{{ usuario.nombre }} {{ usuario.apellidos }}</h3>
            <p><strong>Folio:</strong> {{ usuario.folio }}</p>
            <p><strong>Rol:</strong> {{ usuario.rol }}</p>
            <p><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
            <p><strong>Correo:</strong> {{ usuario.correo }}</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Usuario } from '../../../server/models/Usuario'


const route = useRoute();
let usuarioActualId = route.params.folio;

let listadoUsuarios: Usuario[];
const respuesta = await useFetch('/api/usuarios/usuarios').then(res => {

listadoUsuarios = res.data.value?.data ?? [];

});


</script>

<style>

</style>