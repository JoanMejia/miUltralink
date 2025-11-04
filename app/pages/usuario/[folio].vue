<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-00002 -->
<template>
    <div class="p-4">
    <!-- <h1>PrimeVue 4 en Nuxt 4</h1> -->



      <pre>{{infoCompleta}}</pre>
      
      <div class="card">
        <Timeline :value="pasosInstalacion" align="alternate" class="customized-timeline">
          <template #marker="slotProps">
                    <span
                        class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
                        :class="{
                            'current-marker': slotProps.item.idStatus == infoCompleta[0]?.status?.idStatus,
                            'completed-marker': slotProps.item.idStatus <= (infoCompleta[0]?.status?.idStatus ?? 1)-1
                        }",
                        :id="'paso'+slotProps.item.idStatus"
                        :style="{ backgroundColor: slotProps.item.color }">
                        <i :class="slotProps.item.icon"></i>
                    </span>
                </template>
                <template #content="slotProps">

                    <Card class="mt-4">
                        <template #title>
                            {{ slotProps.item.status }}
                        </template>
                        <template #subtitle>
                          {{ infoCompleta[0]?.['fecha'+slotProps.item.camelCase] }}
                        </template>
                        <template #content>

                            <div style="background-color: red;" v-if="slotProps.item.status == 'Confirmacion de Cita' ">
                                aquí va el template para confirmacion cita
                            </div>





                              <div  v-if="infoCompleta[0]?.status?.idStatus && slotProps.item.idStatus <= infoCompleta[0].status.idStatus">

                                <!-- Mosntrar en base al estado actual mientras sean ese paso o anteriores -->
                                        <!-- menor o igual al idStatus del status de la instalacion -->
                                        <!-- <div v-if="slotProps.item.idStatus <= infoCompleta[0]"></div> -->
                                        <p>Direccion: {{ infoCompleta[0].direccion }}</p>
                                        <p>Ciudad: {{ infoCompleta[0].ciudad }}</p>
                                        <p>Estado: {{ infoCompleta[0].estado }}</p>
                                        <p>codigo postal: {{ infoCompleta[0].codigoPostal}}</p>
                                        <h3>Info Cliente</h3>
                                        <p>Nombre: {{ infoCompleta[0].usuario?.nombre }}  {{ infoCompleta[0].usuario?.apellidos}}</p>
                                        <p>Telefono: {{ infoCompleta[0].usuario?.telefono }}</p>
                                        <p>Correo: {{ infoCompleta[0].usuario?.correo }}</p>
                                        <!-- <Button label="Read more" variant="text" @click="showToast" /> -->
                              </div>


                            
                        </template>
                    </Card>
                </template>
            </Timeline>
        </div>

  </div>

</template>

<script lang="ts" setup>
import type { Usuario } from '../../../server/models/Usuario';
import type { Instalacion} from '../../../server/models/Instalacion';
import TecnicoInstalador from './tecnicoInstalador.vue';

import { ref } from "vue";
import { item } from '@primeuix/themes/aura/breadcrumb';
import { info } from 'console';
import type { Status } from '~~/server/models/Status';


import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  const anchor = document.querySelector('#paso'+infoCompleta[0]?.status?.idStatus)
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth' })
  }
})

// Define a type for the enriched installation data
type InstalacionCompleta = Omit<Instalacion, 'status'> & {
  usuario?: Usuario;
  status?: Status;
  [key: string]: any; // Index signature for dynamic property access
}

const pasosInstalacion = ref([
      { idStatus: 1, status: 'Solicitud', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg', current: false, completed: true, camelCase: 'Solicitud' },
      { idStatus: 2, status: 'En espera de Cita', icon: 'pi pi-cog', color: '#673AB7', image: 'game-controller.jpg', current: true, completed: false, camelCase: 'EsperaCita' },
      { idStatus: 3, status: 'Confirmacion de Cita', icon: 'pi pi-shopping-cart', color: '#FF9800', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'ConfirmacionCita'},
      { idStatus: 4, status: 'Instalacion', icon: 'pi pi-check', color: '#607D8B', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'Instalacion' },
      { idStatus: 5, status: 'Instalado', icon: 'pi pi-check', color: '#4CAF50', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'Instalado' },
])

let listadoStatus: Status[]=[];
await useFetch('/api/instalaciones/status').then(res => {
  listadoStatus = res.data.value?.data ?? [];
});


const route = useRoute();
let folioInstalacion = route.params.folio;


let listadoUsuarios: Usuario[] = [];
let listadoInstalaciones: Instalacion[]= [];
let infoCompleta: InstalacionCompleta[] = [];





await useFetch('/api/usuarios/usuarios').then(res => {
  listadoUsuarios = res.data.value?.data ?? [];
});


await useFetch('/api/instalaciones/instalaciones').then(res => {
  listadoInstalaciones = res.data.value?.data ?? [];
});


 listadoInstalaciones.forEach((item)=>{
      if(item.folio == folioInstalacion){
        infoCompleta = [item].map(instalacion=>({
          ...instalacion,
          usuario: listadoUsuarios.find(u => u.folio === instalacion.folio),
          status: listadoStatus.find(s => s.descripcion === instalacion.status)
        }))
      }
    })



    console.log(infoCompleta);





</script>

<style lang="scss" scoped>



/* // Estilos para remarcar el estado actual y completados */
::v-deep(.customized-timeline) {
    /* // Remarcar la línea del timeline SOLO para eventos completados (hacia arriba desde el actual) */
    .p-timeline-event:has(.completed-marker) {
        .p-timeline-event-connector {
            background-color: #4CAF50; 
            width: 4px; 
        }
    }

    /* // Efecto pulsante en el marcador actual (SOLO el icono, no la línea) */
    .current-marker {
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
/* // Marcador un poco más grande */
        transform: scale(1.1); 
    }

    /* // Los marcadores completados también tienen un estilo especial */
    .completed-marker {
        border: 3px solid #4CAF50;
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
}

@media screen and (max-width: 960px) {
    ::v-deep(.customized-timeline) {
        .p-timeline-event:nth-child(even) {
            flex-direction: row;

            .p-timeline-event-content {
                text-align: left;
            }
        }

        .p-timeline-event-opposite {
            flex: 0;
        }
    }
}
</style>

<style>
body{
  height: 3500px;
}</style>