<template>
    <div>

        <!-- <pre>{{ infoCompletaInstalacion }}</pre> -->

        <div v-for="solicitudActual in infoCompletaInstalacion" :key="solicitudActual.folio">
            <Card>
                <template #title>{{ solicitudActual.folio }}</template>
                <template #content>
                    <p>Nombre: {{ solicitudActual.usuario.nombre }}</p>
                    <p>Direccion: {{ solicitudActual.usuario.direccion.calle }} {{ solicitudActual.usuario.direccion.numero }}</p>
                    <p>Ciudad: {{ solicitudActual.usuario.direccion.ciudad }}</p>
                    <p>Estado: {{ solicitudActual.usuario.direccion.estado }}</p>

                    <Button @click="abrirDialogoFecha(solicitudActual)">Atender</Button>
                </template>
            </Card>
        </div>

        <!-- Dialog para seleccionar fecha -->
        <Dialog v-model:visible="mostrarDialogo" header="Seleccionar fecha de cita" :modal="true" :style="{ width: '30rem' }">
            <div class="flex flex-col gap-4">
                <label for="fecha-cita">Fecha y hora de la cita:</label>
                <Calendar
                    id="fecha-cita"
                    v-model="fechaSeleccionada"
                    showTime
                    hourFormat="24"
                    dateFormat="dd/mm/yy"
                    placeholder="Selecciona fecha y hora"
                />
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" @click="cerrarDialogo" />
                <Button label="Confirmar" @click="confirmarFecha" />
            </template>
        </Dialog>

    </div>
</template>

<script lang="ts" setup>
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import type { Usuario } from '../../../server/models/Usuario';
import type { Instalacion } from '../../../server/models/Instalacion';
import type { Status } from '~~/server/models/Status';
import { ref, watch } from "vue";
import { onMounted, nextTick } from 'vue'
import { item } from '@primeuix/themes/aura/breadcrumb';
import type { Tecnico } from '~~/server/models/Tecnico';


    type InstalacionCompleta = Omit<Instalacion, 'status'> & {
        usuario: Usuario;
        status: Status;
        // [key: string]: any; // Index signature for dynamic property access
    }


// variables reactivas
const instalacionEncontrada = ref<Instalacion[]>([]);
const infoCompletaInstalacion = ref<InstalacionCompleta[]>([]);
const infoTecnico = ref<Tecnico>();
const mostrarDialogo = ref(false);
const fechaSeleccionada = ref<Date | null>(null);
const instalacionSeleccionada = ref<InstalacionCompleta | null>(null);



const cargarDatos = async () => {
    // Cargar datos en paralelo
    const [statusRes, usuariosRes, instalacionesRes, tecnico] = await Promise.all([
        $fetch('/api/instalaciones/status'),
        $fetch('/api/usuarios/usuarios'),
        $fetch('/api/instalaciones/instalaciones'),
        $fetch('/api/tecnicos/tecnicos')
    ])




    //se obtiene un tecnico random como prueba par el registro en la instalacion
    const listadoTecnicos: Tecnico[] = tecnico?.data ?? [];
    if (listadoTecnicos.length > 0) {
        const indexRandom = Math.floor(Math.random() * listadoTecnicos.length);
        infoTecnico.value = listadoTecnicos[indexRandom];
    }


    

    const listadoInstalaciones: Instalacion[] = (instalacionesRes?.data ?? []).map(inst => ({
        ...inst,
        timeStamps:{
            fechaSolicitado: new Date(inst.timeStamps.fechaSolicitado),
            fechapendienteasignacion: null,
            fechaPendienteConfirmacion: null,
            fechaCitaConfirmada: null,
            fechaEnProgresoInstalacion: null,
            fechaInstalacionCompletada: null,
            fechaCancelacion: null,
        },
        citaDetalle:{
            fechaPropuesta: null,
            confirmacionUsuario:false,
            fechaConfirmacion: null
        }
    }))
    

    instalacionEncontrada.value = listadoInstalaciones.filter(item => item.statusAtual === 'Solicitado');


    const listadoStatus: Status[] = statusRes?.data ?? []
    const listadoUsuarios: Usuario[] = usuariosRes?.data ?? []


    instalacionEncontrada.value.forEach(item => {
       

        const usuarioActual = listadoUsuarios.find(u => u.folio === item.folio);
        const statusActual = listadoStatus.find(s => s.descripcion === item.statusAtual);

        if (usuarioActual && statusActual) {
            const infoCompleta: InstalacionCompleta = {
                ...item,
                usuario: usuarioActual,
                status: statusActual
            }

            infoCompletaInstalacion.value.push(infoCompleta);

        }
    })

}

const abrirDialogoFecha = (instalacion: InstalacionCompleta) => {
    instalacionSeleccionada.value = instalacion;
    fechaSeleccionada.value = null;
    mostrarDialogo.value = true;
}

const cerrarDialogo = () => {
    mostrarDialogo.value = false;
    fechaSeleccionada.value = null;
    instalacionSeleccionada.value = null;
}

const confirmarFecha = async () => {
    if (fechaSeleccionada.value && instalacionSeleccionada.value) {
        try {
            // Preparar los datos para actualizar la instalación
            const datosActualizacion = {
                folio: instalacionSeleccionada.value.folio,
                tecnicoId: infoTecnico.value?.numeroEmpleado || '',
                statusAtual: 'Pendiente de Confirmar Cita',
                pasos: {
                    solicitado: true,
                    pendienteAsignacion: true,
                    pendienteConfirmacion: true,
                    citaConfirmada: false,
                    enProgresoInstalacion: false,
                    instalacionConpletada: false,
                    cancelado: false
                },
                timeStamps: {
                    fechaSolicitado: instalacionSeleccionada.value.timeStamps.fechaSolicitado,
                    fechapendienteasignacion: new Date(),
                    fechaPendienteConfirmacion: new Date(),
                    fechaCitaConfirmada: null,
                    fechaEnProgresoInstalacion: null,
                    fechaInstalacionCompletada: null,
                    fechaCancelacion: null
                },
                citaDetalle: {
                    fechaPropuesta: fechaSeleccionada.value,
                    confirmacionUsuario: false,
                    fechaConfirmacion: null
                }
            };

            // Llamar a la API para actualizar la instalación
            const response = await $fetch('/api/instalaciones/instalaciones', {
                method: 'PUT',
                body: datosActualizacion
            });

            if (response.success) {
                console.log("Instalación actualizada correctamente");

                // Recargar los datos para reflejar los cambios
                infoCompletaInstalacion.value = [];
                await cargarDatos();

                cerrarDialogo();
            }
        } catch (error) {
            console.error("Error al actualizar la instalación:", error);
            alert("Error al actualizar la instalación. Por favor intenta nuevamente.");
        }
    } else {
        alert("Por favor selecciona una fecha y hora");
    }
}



onMounted(() => {
    cargarDatos()
})
</script>



<style>

</style>