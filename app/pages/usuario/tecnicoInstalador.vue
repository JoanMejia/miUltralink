<template>
    <div>

        <!-- <pre>{{ infoCompletaInstalacion }}</pre> -->

        <div v-for="solicitudActual in infoCompletaInstalacion">
            <Card>
                <template #title>{{ solicitudActual.folio }}</template>
                <template #content>
                    <p>Nombre: {{ solicitudActual.usuario.nombre }}</p>
                    <p>Direccion: {{ solicitudActual.usuario.direccion.calle }} {{ solicitudActual.usuario.direccion.numero }}</p>
                    <p>Ciudad: {{ solicitudActual.usuario.direccion.ciudad }}</p>
                    <p>Estado: {{ solicitudActual.usuario.direccion.estado }}</p>

                    <Button :onclick="atender" >Atender</Button>
                </template>
            </Card>
        </div>

    </div>
</template>

<script lang="ts" setup>
import Card from 'primevue/card';
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


    instalacionEncontrada.value = listadoInstalaciones.filter(item => item.statusAtual === 'Solicitud');


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

const atender = ()=>{
    console.log("proceso atencion");
}



onMounted(() => {
    cargarDatos()
})
</script>



<style>

</style>