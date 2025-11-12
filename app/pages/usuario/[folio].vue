<!-- ejemplo de URL para probar:
http://localhost:3000/usuario/INS251030-00002 -->
<template>
  <div class="p-4 espacio-superior">


    <!-- <pre>{{infoCompleta}}</pre> -->

    <div class="card">
      <Timeline :value="pasosInstalacion" align="alternate" class="customized-timeline">
        <template #marker="slotProps">
          <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :class="{
            'current-marker': slotProps.item.status == infoCompleta[0]?.statusAtual,
            'completed-marker': slotProps.item.idStatus < PasosActivos.length && !PasosActivos.includes('cancelado')
          }" :id="'paso' + slotProps.item.idStatus"
            :style="{ backgroundColor: slotProps.item.color }+';border: 0px solid #4CAF50;'">

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

              <div v-if="slotProps.item.status == 'Solicitado'">
                <p><strong>FOLIO: {{ infoCompleta[0]?.folio }}</strong></p>
                <p>Plan: {{ infoCompleta[0]?.plan }}</p>
                <p>Direccion: {{ infoCompleta[0]?.usuario?.direccion.calle }} {{
                  infoCompleta[0]?.usuario?.direccion.numero }}</p>
                <p>Ciudad: {{ infoCompleta[0]?.usuario?.direccion.ciudad }}</p>
                <p>Estado: {{ infoCompleta[0]?.usuario?.direccion.estado }}</p>
                <p>codigo postal: {{ infoCompleta[0]?.usuario?.direccion.codigoPostal }}</p>
                <h3>Info Cliente</h3>
                <p>Nombre: {{ infoCompleta[0]?.usuario?.nombre }}</p>
                <p>Telefono: {{ infoCompleta[0]?.usuario?.telefono }}</p>
                <p>Correo: {{ infoCompleta[0]?.usuario?.correo }}</p>
              </div>

              <div v-if="slotProps.item.status == 'Pendiente de Asignacion de Cita'">
                <div v-if="infoCompleta[0]?.pasos.pendienteAsignacion">
                  <p>Tecnico asignado: {{ infoCompleta[0].tecnico?.nombre }}</p>
                  <p>Dentro de un periodo de tiempo el tecnico le asignara una fecha para la instalacion</p>
                </div>
              </div>

              <div v-if="slotProps.item.status == 'Pendiente de Confirmar Cita'">
                <div v-if="infoCompleta[0]?.pasos.pendienteConfirmacion">
                  <p>Fecha propuesta: {{ infoCompleta[0].citaDetalle?.fechaPropuesta}}</p>
                  <Button label="Aceptar" variant="text" @click="abrirVentanaConfirmacionCita"></Button>
                  <Button label="Otra Fecha" variant="text"></Button>
                </div>
              </div>
              <div v-if="slotProps.item.status == 'Cita Confirmada'">
                <div v-if="infoCompleta[0]?.pasos.citaConfirmada">
                  fecha confirm
                  fecha cita
                  aquí va el template cita confirmada
                </div>
              </div>
              <div v-if="slotProps.item.status == 'Instalando'">
                <div v-if="infoCompleta[0]?.pasos.enProgresoInstalacion">
                  nombre del tecnico
                </div>
              </div>
              <div v-if="slotProps.item.status == 'Completado'">
                <div v-if="infoCompleta[0]?.pasos.instalacionConpletada">
                  numero de serie modem
                  observaciones
                  seleccionador de estrellas
                  caja de comentarios
                </div>
              </div>
              <div v-if="slotProps.item.status == 'Cancelado'">
                <div v-if="infoCompleta[0]?.pasos.cancelado">
                  Cancelaste la cita
                </div>
              </div>







            </template>
          </Card>
        </template>
      </Timeline>
    </div>


    <Dialog v-model:visible="mostrarVentanaConfirmacionCita" header="Confirmar Cita" :modal="true"
      :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <label for="fecha-cita">Tu cita sera el {{ infoCompleta[0]?.citaDetalle?.fechaPropuesta }}</label>
      </div>
      <template #footer>
        <Button label="Confirmar" @click="confirmarCita" />
        <Button label="Cancelar" severity="secondary" @click="cerrarVentanaConfirmacionCita" />
      </template>
    </Dialog>

  </div>

</template>

<script lang="ts" setup>
import type { Usuario } from '../../../server/models/Usuario';
import type { Instalacion} from '../../../server/models/Instalacion';
import type { Status } from '~~/server/models/Status';
import { ref, watch } from "vue";
import { onMounted, nextTick } from 'vue';
import type { Tecnico } from '~~/server/models/Tecnico';
import { date } from '@primeuix/themes/aura/datepicker';
import { json } from 'stream/consumers';
import { parse } from 'path';
import { item } from '@primeuix/themes/aura/breadcrumb';


//variables reactivas
const mostrarVentanaConfirmacionCita = ref(false);

// Define a type for the enriched installation data
type InstalacionCompleta = Omit<Instalacion, 'status'> & {
  usuario?: Usuario;
  status?: Status;
  tecnico?: Tecnico;
  [key: string]: any; // Index signature for dynamic property access
}


const PasosActivos = ref<string[]>([]);

const pasosInstalacion = ref([
      { idStatus: 1, status: 'Solicitado', icon: 'pi pi-plus-circle', color: '#9C27B0', current: false, completed: true, camelCase: 'solicitado' },
      { idStatus: 2, status: 'Pendiente de Asignacion de Cita', icon: 'pi pi-hourglass', color: '#673AB7',  current: true, completed: false, camelCase: 'pendienteAsignacion' },
      { idStatus: 3, status: 'Pendiente de Confirmar Cita', icon: 'pi pi-calendar-clock', color: '#FF9800',  current: false, completed: false, camelCase: 'pendienteConfirmacion'},
      { idStatus: 4, status: 'Cita Confirmada', icon: 'pi pi-home', color: '#607D8B',  current: false, completed: false, camelCase: 'citaConfirmada' },
      { idStatus: 5, status: 'Instalando', icon: 'pi pi-check-square', color: '#4CAF50',  current: false, completed: false, camelCase: 'enProgresoInstalacion' },
      { idStatus: 6, status: 'Completado', icon: 'pi pi-check-square', color: '#4CAF50',  current: false, completed: false, camelCase: 'instalacionConpletada' },
      // { idStatus: 7, status: 'Cancelado', icon: 'pi pi-check-square', color: '#4CAF50',  current: false, completed: false, camelCase: 'cancelado' },
])

const route = useRoute();

// Usar refs reactivos
const infoCompleta = ref<InstalacionCompleta[]>([])
const listadoInstalaciones = ref<Instalacion[]>([]);




let folioInstalacion = route.params.folio;
// Función para cargar los datos
const cargarDatos = async () => {
  folioInstalacion = route.params.folio

  // Cargar datos en paralelo
  const [statusRes, usuariosRes, instalacionesRes, tecnicosRes] = await Promise.all([
    $fetch('/api/instalaciones/status'),
    $fetch('/api/usuarios/usuarios'),
    $fetch('/api/instalaciones/instalaciones'),
    $fetch('/api/tecnicos/tecnicos')

  ])

  const listadoStatus: Status[] = statusRes?.data ?? []
  const listadoUsuarios: Usuario[] = usuariosRes?.data ?? []
  const listadoTecnicos: Tecnico[] = tecnicosRes.data??[];
  // const listadoInstalaciones: Instalacion[] = instalacionesRes?.data ?? [];


listadoInstalaciones.value = (instalacionesRes?.data).map(inst => ({
    ...inst,
    timeStamps: {
      fechaSolicitado: new Date(inst.timeStamps.fechaSolicitado),
      fechapendienteasignacion: inst.timeStamps.fechapendienteasignacion?new Date(inst.timeStamps.fechapendienteasignacion):null,
      fechaPendienteConfirmacion: inst.timeStamps.fechaPendienteConfirmacion?new Date(inst.timeStamps.fechaPendienteConfirmacion):null,
      fechaCitaConfirmada: inst.timeStamps.fechaCitaConfirmada?new Date(inst.timeStamps.fechaCitaConfirmada):null,
      fechaEnProgresoInstalacion: inst.timeStamps.fechaEnProgresoInstalacion?new Date(inst.timeStamps.fechaEnProgresoInstalacion):null,
      fechaInstalacionCompletada: inst.timeStamps.fechaInstalacionCompletada?new Date(inst.timeStamps.fechaInstalacionCompletada):null,
      fechaCancelacion: inst.timeStamps.fechaCancelacion?new Date(inst.timeStamps.fechaCancelacion):null
    },
    citaDetalle: {
      fechaPropuesta: inst.citaDetalle?.fechaPropuesta? new Date(inst.citaDetalle?.fechaPropuesta): null,
      confirmacionUsuario: inst.citaDetalle?.confirmacionUsuario? inst.citaDetalle.confirmacionUsuario:false,
      fechaConfirmacion: inst.citaDetalle?.fechaConfirmacion? new Date(inst.citaDetalle.fechaConfirmacion): null
    }
  }));

  // Buscar la instalación específica y enriquecerla
  const instalacionEncontrada = listadoInstalaciones.value.find(item => item.folio == folioInstalacion)

  if (instalacionEncontrada) {
    infoCompleta.value = [{
      ...instalacionEncontrada,
      usuario: listadoUsuarios.find(u => u.folio === instalacionEncontrada.folio),
      status: listadoStatus.find(s => s.descripcion === instalacionEncontrada.statusAtual),
      tecnico: listadoTecnicos.find(t=>t.numeroEmpleado === instalacionEncontrada.tecnicoId)
    }]

    if(infoCompleta.value[0]?.pasos){
      const pasos = infoCompleta.value[0].pasos;
      PasosActivos.value =  Object.keys(pasos).filter(key => pasos[key as keyof typeof pasos] === true);
    }

  }

  console.log('Datos cargados:', infoCompleta.value)
}


const abrirVentanaConfirmacionCita = () => {
    // instalacionSeleccionada.value = instalacion;
    // fechaSeleccionada.value = null;
    mostrarVentanaConfirmacionCita.value = true;
}

const cerrarVentanaConfirmacionCita = () => {
    mostrarVentanaConfirmacionCita.value = false;
    // fechaSeleccionada.value = null;
    // instalacionSeleccionada.value = null;
}

const confirmarCita = async () =>{



  const datosActualiza = {
    folio: infoCompleta.value[0]?.folio,
    statusAtual: 'Cita Confirmada',
    pasos: {
      solicitado: true,
      pendienteAsignacion: true,
      pendienteConfirmacion: true,
      citaConfirmada: true,
      enProgresoInstalacion: false,
      instalacionConpletada: false,
      cancelado: false
    },
    timeStamps: {
      fechaSolicitado: infoCompleta.value[0]?.timeStamps.fechaSolicitado,
      fechapendienteasignacion: infoCompleta.value[0]?.timeStamps.fechapendienteasignacion,
      fechaPendienteConfirmacion: infoCompleta.value[0]?.timeStamps.fechaPendienteConfirmacion,
      fechaCitaConfirmada: new Date(),
      fechaEnProgresoInstalacion: null,
      fechaInstalacionCompletada: null,
      fechaCancelacion: null
    },
    citaDetalle: {
      fechaPropuesta: infoCompleta.value[0]?.citaDetalle?.fechaPropuesta,
      confirmacionUsuario: true,
      fechaConfirmacion: new Date()
    }
  }




  // Llamar a la API para actualizar la instalación
  const response = await $fetch('/api/instalaciones/instalaciones', {
    method: 'PUT',
    body: datosActualiza
  });
  
  if (response?.success) {
    console.log("Instalación actualizada correctamente");
  
    // Recargar los datos para reflejar los cambios
    await cargarDatos();
  
    cerrarVentanaConfirmacionCita();
  }
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