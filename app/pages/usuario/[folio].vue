<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-00002 -->
<template>
    <div class="p-4">
    <h1>PrimeVue 4 en Nuxt 4</h1>


      <pre>{{infoCompleta}}</pre>

            <div class="card">
            <Timeline :value="pasosInstalacion" align="alternate" class="customized-timeline">
                <template #content="slotProps">

                    <Card class="mt-4">
                        <template #title>
                            {{ slotProps.item.status }}
                        </template>
                        <template #subtitle>
                            {{ infoCompleta[0].fechaSolicitud }}
                        </template>
                        <template #content>

                            <div style="background-color: red;" v-if="slotProps.item.status == 'Confirmacion cita' ">
                                aquí va el template para confirmacion cita
                            </div>


                            


                            <!-- <div v-if=" infoCompleta[0].status < listadoStatus[infoCompleta[0].status]"></div> -->

                            <p>Direccion: {{ infoCompleta[0].direccion }}</p>
                            <p>Ciudad: {{ infoCompleta[0].ciudad }}</p>
                            <p>Estado: {{ infoCompleta[0].estado }}</p>
                            <p>codigo postal: {{ infoCompleta[0].codigoPostal}}</p>
                            <h3>Info Cliente</h3>
                            <p>Nombre: {{ infoCompleta[0].usuario.nombre }}  {{ infoCompleta[0].usuario.apellidos}}</p>
                            <p>Telefono: {{ infoCompleta[0].usuario.telefono }}</p>
                            <p>Correo: {{ infoCompleta[0].usuario.correo }}</p>
                            <Button label="Read more" variant="text" @click="showToast" />

                            
                        </template>
                    </Card>
                </template>
            </Timeline>
        </div>



    


        <!-- <div class="card">
            <Timeline :value="events" align="alternate" class="customized-timeline">
                <template #marker="slotProps">
                    <span
                        class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
                        :class="{
                            'current-marker': slotProps.item.current,
                            'completed-marker': slotProps.item.completed
                        }"
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
                            {{ slotProps.item.date }}
                        </template>
                        <template #content>

                            <div style="background-color: red;" v-if="slotProps.item.status === 'Solicitud'">

                                aquí va el template para solicitud
                            </div>


                            <img v-if="slotProps.item.image" :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.item.image}`" :alt="slotProps.item.name" width="200" class="shadow-sm" />
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                                neque quas!
                            </p>
                            <Button label="Read more" variant="text" @click="showToast" />

                            
                        </template>
                    </Card>
                </template>
            </Timeline>
        </div> -->
    

    <Toast />
  </div>

</template>

<script lang="ts" setup>
import type { Usuario } from '../../../server/models/Usuario';
import type { Instalacion} from '../../../server/models/Instalacion';
import TecnicoInstalador from './tecnicoInstalador.vue';

import { ref } from "vue";
import { item } from '@primeuix/themes/aura/breadcrumb';
import { info } from 'console';

// const events = ref([
//     { status: 'Solicitud', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg', current: false, completed: true },
//     { status: 'En espera de cita', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7', image: 'game-controller.jpg', current: true, completed: false },
//     { status: 'Confirmacion cita', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800', image: 'game-controller.jpg', current: false, completed: false },
//     { status: 'Instalacion', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B', image: 'game-controller.jpg', current: false, completed: false },
//     { status: 'Instalado', date: '16/10/2020 14:00', icon: 'pi pi-check', color: '#4CAF50', image: 'game-controller.jpg', current: false, completed: false },
// ]);


const pasosInstalacion = ref([
      { status: 'Solicitud', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg', current: false, completed: true },
      { status: 'En espera de cita', icon: 'pi pi-cog', color: '#673AB7', image: 'game-controller.jpg', current: true, completed: false },
      { status: 'Confirmacion cita', icon: 'pi pi-shopping-cart', color: '#FF9800', image: 'game-controller.jpg', current: false, completed: false },
      { status: 'Instalacion', icon: 'pi pi-check', color: '#607D8B', image: 'game-controller.jpg', current: false, completed: false },
      { status: 'Instalado', icon: 'pi pi-check', color: '#4CAF50', image: 'game-controller.jpg', current: false, completed: false },
])

const listadoStatus = {'solicitud':1, 'esperaCita':2, 'confirmacionCita':3, 'instalacion':4, 'instalado':5};



const route = useRoute();
let folioInstalacion = route.params.folio;


let listadoUsuarios: Usuario[];
let listadoInstalaciones: Instalacion[]= [];
let infoCompleta;


let ejemplo = "test";


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
          usuario: listadoUsuarios.find(u => u.folio === instalacion.folio)
        }))
      }
    })



    console.log(infoCompleta);

    // const events = ref(infoCompleta);




</script>

<style>

</style>