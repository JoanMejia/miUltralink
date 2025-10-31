<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-000001 -->
<template>
  <div>




    <p></p>

      <div v-for="usuario in listadoUsuarios" >
        <div v-if="folioInstalacion === usuario.folio" class="mb-4 p-4 border rounded">
          
          
          <UAccordion :items="itemsAcordion">
            <template #body="{ item }">
                <h3 class="text-lg font-bold">{{ usuario.nombre }} {{ usuario.apellidos }}</h3>
                <p><strong>Folio:</strong> {{ usuario.folio }}</p>
                <p><strong>Rol:</strong> {{ usuario.rol }}</p>
                <p><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
                <p><strong>Correo:</strong> {{ usuario.correo }}</p>
              </template>
          </UAccordion>
        </div>
    </div>



     <div v-for="instalacion in listadoInstalaciones" >
        <div v-if="folioInstalacion === instalacion.folio" class="mb-4 p-4 border rounded">

          
          
          <UAccordion :items="itemsAcordion">
            <template #body="{ item }">
                <h3 class="text-lg font-bold"> {{ instalacion.folio }}</h3>
                <p><strong>Status:</strong> {{ instalacion.status }}</p>
                <p><strong>Dirección:</strong> {{ instalacion.direccion }}</p>
                <p><strong>Ciudad:</strong> {{ instalacion.ciudad }}</p>
                <p><strong>Estado:</strong> {{ instalacion.estado }}</p>
                <p><strong>Código Postal:</strong> {{ instalacion.codigoPostal }}</p>
                <p><strong>Fecha de Instalación:</strong> {{ instalacion.fechaInstalacion }}</p>
                <p><strong>Observaciones:</strong> {{ instalacion.observaciones }}</p>
            </template>
          </UAccordion>

        </div>
    </div>





   <UAccordion :items="itemsAcordion">
    <template #body="{ item }">
      <UButton class="mt-4" color="primary">Click me</UButton>
    </template>
  </UAccordion>
  
  </div>
</template>

<script lang="ts" setup>
import type { Usuario } from '../../../server/models/Usuario';
import type { Instalacion} from '../../../server/models/Instalacion';
import TecnicoInstalador from './tecnicoInstalador.vue';


const route = useRoute();
let folioInstalacion = route.params.folio;


let listadoUsuarios: Usuario[];
let listadoInstalaciones: Instalacion[];
let infoCompleta: [];


await useFetch('/api/usuarios/usuarios').then(res => {
  listadoUsuarios = res.data.value?.data ?? [];
});

await useFetch('/api/instalaciones/instalaciones').then(res => {
  listadoInstalaciones = res.data.value?.data ?? [];
});


const itemsAcordion = ref([
  {
    label: 'Solicitud de instalacion generada'
  },
  {
    label: 'Instalacion programada'
  },
  {
    label: 'Instalacion completada'
  }
])



// let infoCompleta = [
//   {
//     folio: folioInstalacion,
//     usuarios: listadoUsuarios.filter(usuario => usuario.folio === folioInstalacion),
//     instalaciones: listadoInstalaciones.filter(instalacion => instalacion.folio === folioInstalacion)
//   }
// ]


</script>

<style>

</style>