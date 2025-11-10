<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-00002 -->
<template>
  <div class="p-4 espacio-superior">


    <!-- <pre>{{infoCompleta}}</pre> -->

    <div class="card">
      <Timeline :value="pasosInstalacion" align="alternate" class="customized-timeline">
        <template #marker="slotProps">
          <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :class="{
            'current-marker': slotProps.item.idStatus == (infoCompleta[0]?.status?.idStatus ?? 1) + 1,
            'completed-marker': slotProps.item.idStatus <= (infoCompleta[0]?.status?.idStatus ?? 1)
          }" :id="'paso' + slotProps.item.idStatus" :style="{ backgroundColor: slotProps.item.color }+';border: 0px solid #4CAF50;'">
            <i :class="slotProps.item.icon"></i>
          </span>
        </template>
        <template #content="slotProps">

          <Card class="mt-4">
            <template #title>
              {{ slotProps.item.status }}
            </template>
            <template #subtitle>
              {{ infoCompleta[0]?.['fecha' + slotProps.item.camelCase] }}
            </template>
            <template #content>

              <!-- <div style="background-color: red;" v-if="slotProps.item.status == 'Confirmacion de Cita' ">
                      aquí va el template para confirmacion cita
                    </div> -->
              <div
                v-if="infoCompleta[0]?.status?.idStatus && slotProps.item.idStatus <= infoCompleta[0].status.idStatus">

                <!-- Mosntrar en base al estado actual mientras sean ese paso o anteriores -->
                <!-- menor o igual al idStatus del status de la instalacion -->
                <!-- <div v-if="slotProps.item.idStatus <= infoCompleta[0]"></div> -->
                 <p><strong>FOLIO: {{ infoCompleta[0].folio }}</strong></p>
                <p>Direccion: {{ infoCompleta[0].direccion }}</p>
                <p>Ciudad: {{ infoCompleta[0].ciudad }}</p>
                <p>Estado: {{ infoCompleta[0].estado }}</p>
                <p>codigo postal: {{ infoCompleta[0].codigoPostal }}</p>
                <h3>Info Cliente</h3>
                <p>Nombre: {{ infoCompleta[0].usuario?.nombre }}</p>
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
import type { Status } from '~~/server/models/Status';
import { ref, watch } from "vue";
import { onMounted, nextTick } from 'vue'

// Define a type for the enriched installation data
type InstalacionCompleta = Omit<Instalacion, 'status'> & {
  usuario?: Usuario;
  status?: Status;
  [key: string]: any; // Index signature for dynamic property access
}

const pasosInstalacion = ref([
      { idStatus: 1, status: 'Solicitud', icon: 'pi pi-plus-circle', color: '#9C27B0', image: 'game-controller.jpg', current: false, completed: true, camelCase: 'Solicitud' },
      { idStatus: 2, status: 'En espera de Cita', icon: 'pi pi-hourglass', color: '#673AB7', image: 'game-controller.jpg', current: true, completed: false, camelCase: 'EsperaCita' },
      { idStatus: 3, status: 'Confirmacion de Cita', icon: 'pi pi-calendar-clock', color: '#FF9800', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'ConfirmacionCita'},
      { idStatus: 4, status: 'Instalacion', icon: 'pi pi-home', color: '#607D8B', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'Instalacion' },
      { idStatus: 5, status: 'Instalado', icon: 'pi pi-check-square', color: '#4CAF50', image: 'game-controller.jpg', current: false, completed: false, camelCase: 'Instalado' },
])

const route = useRoute();

// Usar refs reactivos
const infoCompleta = ref<InstalacionCompleta[]>([])

// Función para cargar los datos
const cargarDatos = async () => {
  const folioInstalacion = route.params.folio

  // Cargar datos en paralelo
  const [statusRes, usuariosRes, instalacionesRes] = await Promise.all([
    $fetch('/api/instalaciones/status'),
    $fetch('/api/usuarios/usuarios'),
    $fetch('/api/instalaciones/instalaciones')
  ])

  const listadoStatus: Status[] = statusRes?.data ?? []
  const listadoUsuarios: Usuario[] = usuariosRes?.data ?? []
  // const listadoInstalaciones: Instalacion[] = instalacionesRes?.data ?? [];

  const listadoInstalaciones: Instalacion[] = (instalacionesRes?.data ?? []).map(inst => ({
    ...inst,
    timeStamps: {
      fechaSolicitado: new Date(inst.timeStamps.fechaSolicitado)
    },
    citaDetalle: {
      fechaPropuesta: null,
      confirmacionUsuario: false,
      fechaConfirmacion: null
    }
  }))

  // Buscar la instalación específica y enriquecerla
  const instalacionEncontrada = listadoInstalaciones.find(item => item.folio == folioInstalacion)

  if (instalacionEncontrada) {
    infoCompleta.value = [{
      ...instalacionEncontrada,
      usuario: listadoUsuarios.find(u => u.folio === instalacionEncontrada.folio),
      status: listadoStatus.find(s => s.descripcion === instalacionEncontrada.statusAtual)
    }]
  }

  console.log('Datos cargados:', infoCompleta.value)
}

// Cargar datos cuando el componente se monta
onMounted(async () => {
  await cargarDatos()
  await nextTick()

  // Scroll al paso actual
    const anchor = document.querySelector('#paso' + infoCompleta.value[0]?.status?.idStatus)
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
  }
})

// Recargar datos cuando cambia el folio en la ruta
watch(() => route.params.folio, async () => {
  await cargarDatos()
  await nextTick()

  const anchor = document.querySelector('#paso' + infoCompleta.value[0]?.status?.idStatus)
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth' })
  }
})





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
}
.espacio-superior{
  padding-top: 3rem;
}

</style>