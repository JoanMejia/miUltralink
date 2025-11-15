<template>
    <div>

        <h2>Solicitudes ({{ infoCompletaInstalacion.length }}) </h2>
        <div class="grid-container">
            <div v-for="solicitudActual in infoCompletaInstalacion" :key="solicitudActual.folio">
                <Card>
                    <template #title>{{ solicitudActual.folio }}</template>
                    <template #content>
                        <p>Nombre: {{ solicitudActual.usuario.nombre }}</p>
                        <p>Direccion: {{ solicitudActual.usuario.direccion.calle }} {{solicitudActual.usuario.direccion.numero }}</p>
                        <p>Ciudad: {{ solicitudActual.usuario.direccion.ciudad }}</p>
                        <p>Estado: {{ solicitudActual.usuario.direccion.estado }}</p>

                        <Button @click="abrirDialogoFecha(solicitudActual)">Atender</Button>
                    </template>
                </Card>
            </div>
        </div>

        <h2>Instalaciones ({{ infoCompletaInstalacionConfirmada.length }})</h2>
        <div class="grid-container">
            <div v-for="solicitudActual in infoCompletaInstalacionConfirmada" :key="solicitudActual.folio">
                <Card>
                    <template #title>{{ solicitudActual.folio }}</template>
                    <template #content>
                        <p>Nombre: {{ solicitudActual.usuario.nombre }}</p>
                        <p>Direccion: {{ solicitudActual.usuario.direccion.calle }} {{solicitudActual.usuario.direccion.numero }}</p>
                        <p>Ciudad: {{ solicitudActual.usuario.direccion.ciudad }}</p>
                        <p>Estado: {{ solicitudActual.usuario.direccion.estado }}</p>

                        <Button v-if="solicitudActual.statusAtual == 'Cita Confirmada'"
                            @click="abrirDialogoProcesoInstalacion(solicitudActual)">Empezar Instalacion</Button>
                        <Button v-if="solicitudActual.statusAtual == 'Instalando'" label="Info" severity="info"
                            @click="abrirDialogoterminarInstalacion(solicitudActual)">Terminar Instalacion</Button>
                    </template>
                </Card>
            </div>
        </div>





        <h2>Completados ({{ infoCompletaInstalacionCompletada.length }}) </h2>
        <div class="grid-container">
            <div v-for="solicitudActual in infoCompletaInstalacionCompletada" :key="solicitudActual.folio">
                <Card>
                    <template #title>{{ solicitudActual.folio }}</template>
                    <template #content>
                        <p>Nombre: {{ solicitudActual.usuario.nombre }}</p>
                        <p>Direccion: {{ solicitudActual.usuario.direccion.calle }} {{solicitudActual.usuario.direccion.numero }}</p>
                        <p>Ciudad: {{ solicitudActual.usuario.direccion.ciudad }}</p>
                        <p>Estado: {{ solicitudActual.usuario.direccion.estado }}</p>
                         <Form class="flex flex-col gap-1">
                            <Rating v-model="solicitudActual.calificacion"  :readonly="true"/>
                            <p>{{ solicitudActual.feedback??"Sin Comentarios" }}</p>
                        </Form>
                    </template>
                </Card>
            </div>
        </div>

        <Dialog v-model:visible="mostrarDialogo" header="Seleccionar fecha de cita" :modal="true"
            :style="{ width: '30rem' }">
            <div class="flex flex-col gap-4">
                <label for="fecha-cita">Fecha y hora de la cita:</label>
                <Calendar id="fecha-cita" v-model="fechaSeleccionada" showTime hourFormat="24" dateFormat="dd/mm/yy"
                    placeholder="Selecciona fecha y hora" />
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" @click="cerrarDialogo" />
                <Button label="Confirmar" @click="confirmarFecha" />
            </template>
        </Dialog>



        <Dialog v-model:visible="mostrarDialogoEmpezarInstalacion" header="Empezar Proceso de instalacion" :modal="true"
            :style="{ width: '30rem' }">
            <div class="flex flex-col gap-4" style="width: 100%;">
                <IftaLabel>
                    <InputText id="username" v-model="valorNumeroModem" />
                    <label for="username">Numero de modem</label>
                </IftaLabel>
            </div>
            <template #footer>
                <Button label="Confirmar" @click="empezarProcesoInstalacion" />
                <Button label="Cancelar" severity="secondary" @click="cerrarDialogoProcesoInstalacion" />
            </template>
        </Dialog>


        <Dialog v-model:visible="mostrarDialogoTerminarInstalacion" header="Terminar Instalacion" :modal="true"
            :style="{ width: '30rem' }">
            <template #footer>
                <Button label="Confirmar" @click="terminarInstalacion" />
                <Button label="Cancelar" severity="secondary" @click="cerrarDialogoTerminarInstalacion" />
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
const instalacionesConfirmadas = ref<Instalacion[]>([])
const instalacionesCompletadas = ref<Instalacion[]>([]);
const infoCompletaInstalacion = ref<InstalacionCompleta[]>([]);
const infoCompletaInstalacionConfirmada = ref<InstalacionCompleta[]>([]);
const infoCompletaInstalacionCompletada = ref<InstalacionCompleta[]>([]);
const infoTecnico = ref<Tecnico>();
const mostrarDialogo = ref(false);
const mostrarDialogoEmpezarInstalacion = ref(false);
const mostrarDialogoTerminarInstalacion = ref(false);
const fechaSeleccionada = ref<Date | null>(null);
const instalacionSeleccionada = ref<InstalacionCompleta | null>(null);
const valorNumeroModem = ref(null);



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
    instalacionesConfirmadas.value = listadoInstalaciones.filter(item => item.statusAtual === 'Cita Confirmada' || item.statusAtual === 'Instalando');
    instalacionesCompletadas.value = listadoInstalaciones.filter(item => item.statusAtual === 'Completado');


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
    });



    instalacionesConfirmadas.value.forEach(item => {
       

        const usuarioActual = listadoUsuarios.find(u => u.folio === item.folio);
        const statusActual = listadoStatus.find(s => s.descripcion === item.statusAtual);

        if (usuarioActual && statusActual) {
            const infoCompleta: InstalacionCompleta = {
                ...item,
                usuario: usuarioActual,
                status: statusActual
            }

            infoCompletaInstalacionConfirmada.value.push(infoCompleta);

        }
    });




    instalacionesCompletadas.value.forEach(item => {
       

        const usuarioActual = listadoUsuarios.find(u => u.folio === item.folio);
        const statusActual = listadoStatus.find(s => s.descripcion === item.statusAtual);

        if (usuarioActual && statusActual) {
            const infoCompleta: InstalacionCompleta = {
                ...item,
                usuario: usuarioActual,
                status: statusActual
            }

            infoCompletaInstalacionCompletada.value.push(infoCompleta);

        }
    });

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


const abrirDialogoProcesoInstalacion = (instalacion: InstalacionCompleta) => {
    instalacionSeleccionada.value = instalacion;
    mostrarDialogoEmpezarInstalacion.value = true;
}

const cerrarDialogoProcesoInstalacion = () => {
    mostrarDialogoEmpezarInstalacion.value = false;
}
const abrirDialogoterminarInstalacion = (instalacion: InstalacionCompleta)=>{
    instalacionSeleccionada.value = instalacion;
    mostrarDialogoTerminarInstalacion.value = true;
}
const cerrarDialogoTerminarInstalacion = ()=>{
     mostrarDialogoTerminarInstalacion.value = false;
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
                infoCompletaInstalacionConfirmada.value = [];
                infoCompletaInstalacionCompletada.value = [];
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


const empezarProcesoInstalacion = async ()=>{

       if (instalacionSeleccionada.value) {
        try {
            // Preparar los datos para actualizar la instalación
            const datosActualizacion = {
                folio: instalacionSeleccionada.value.folio,
                tecnicoId: infoTecnico.value?.numeroEmpleado || '',
                statusAtual: 'Instalando',
                numeroModem: valorNumeroModem.value,
                pasos: {
                    solicitado: true,
                    pendienteAsignacion: true,
                    pendienteConfirmacion: true,
                    citaConfirmada: true,
                    enProgresoInstalacion: true,
                    instalacionConpletada: false,
                    cancelado: false
                },
                timeStamps: {
                    fechaSolicitado: instalacionSeleccionada.value.timeStamps.fechaSolicitado,
                    fechapendienteasignacion: instalacionSeleccionada.value.timeStamps.fechapendienteasignacion,
                    fechaPendienteConfirmacion: instalacionSeleccionada.value.timeStamps.fechaPendienteConfirmacion,
                    fechaCitaConfirmada: instalacionSeleccionada.value.timeStamps.fechaCitaConfirmada,
                    fechaEnProgresoInstalacion: new Date(),
                    fechaInstalacionCompletada: null,
                    fechaCancelacion: null
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
                infoCompletaInstalacionConfirmada.value = [];
                infoCompletaInstalacionCompletada.value = [];
                await cargarDatos();

                cerrarDialogoProcesoInstalacion();
            }
        } catch (error) {
            console.error("Error al actualizar la instalación:", error);
            alert("Error al actualizar la instalación. Por favor intenta nuevamente.");
        }
    } else {
        alert("Error al empezar proceso de instalacion");
    }
}


const terminarInstalacion = async () => {
    if (instalacionSeleccionada.value) {
        try {




            const datosActualizacion = {
                folio: instalacionSeleccionada.value.folio,
                tecnicoId: infoTecnico.value?.numeroEmpleado || '',
                statusAtual: 'Completado',
                numeroModem: valorNumeroModem.value,
                pasos: {
                    solicitado: true,
                    pendienteAsignacion: true,
                    pendienteConfirmacion: true,
                    citaConfirmada: true,
                    enProgresoInstalacion: true,
                    instalacionConpletada: true,
                    cancelado: false
                },
                timeStamps: {
                    fechaSolicitado: instalacionSeleccionada.value.timeStamps.fechaSolicitado,
                    fechapendienteasignacion: instalacionSeleccionada.value.timeStamps.fechapendienteasignacion,
                    fechaPendienteConfirmacion: instalacionSeleccionada.value.timeStamps.fechaPendienteConfirmacion,
                    fechaCitaConfirmada: instalacionSeleccionada.value.timeStamps.fechaCitaConfirmada,
                    fechaEnProgresoInstalacion: instalacionSeleccionada.value.timeStamps.fechaEnProgresoInstalacion,
                    fechaInstalacionCompletada: new Date(),
                    fechaCancelacion: null
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
                infoCompletaInstalacionConfirmada.value = [];
                infoCompletaInstalacionCompletada.value = [];
                await cargarDatos();

                cerrarDialogoTerminarInstalacion();
            }
        } catch (error) {
            console.error("Error al terminar la instalación:", error);
            alert("Error al actualizar la instalación. Por favor intenta nuevamente.");
        }
    } else {
        alert("Error al terminar instalacion");
    }

}



onMounted(() => {
    cargarDatos()
})
</script>



<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}
</style>