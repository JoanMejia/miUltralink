<template>
    <div>

        <!-- <pre>{{ infoCompletaInstalacion }}</pre> -->

        
       




        <div v-for="solicitudActual in infoCompletaInstalacion">
            <Card>
                <template #title>Simple Card</template>
                <template #content>
                    <p>Folio: {{ solicitudActual.folio }}</p>
                    <p>Nombre: {{ solicitudActual.usuario.nombre }} {{ solicitudActual.usuario.apellidos }}</p>
                    <p>Direccion: {{ solicitudActual.direccion }}</p>
                    <p>Ciudad: {{ solicitudActual.ciudad }}</p>
                    <p>Estado: {{ solicitudActual.estado }}</p>


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


    type InstalacionCompleta = Omit<Instalacion, 'status'> & {
        usuario: Usuario;
        status: Status;
        // [key: string]: any; // Index signature for dynamic property access
    }


// variables reactivas
const instalacionEncontrada = ref<Instalacion[]>([]);
const infoCompletaInstalacion = ref<InstalacionCompleta[]>([]);



const cargarDatos = async () => {
    // Cargar datos en paralelo
    const [statusRes, usuariosRes, instalacionesRes] = await Promise.all([
        $fetch('/api/instalaciones/status'),
        $fetch('/api/usuarios/usuarios'),
        $fetch('/api/instalaciones/instalaciones')
    ])

    const listadoInstalaciones: Instalacion[] = (instalacionesRes?.data ?? []).map(inst => ({
        ...inst,
        fechaSolicitud: new Date(inst.fechaSolicitud)
    }))


    instalacionEncontrada.value = listadoInstalaciones.filter(item => item.status === 'Solicitud');


    const listadoStatus: Status[] = statusRes?.data ?? []
    const listadoUsuarios: Usuario[] = usuariosRes?.data ?? []


    instalacionEncontrada.value.forEach(item => {
       

        const usuarioActual = listadoUsuarios.find(u => u.folio === item.folio);
        const statusActual = listadoStatus.find(s => s.descripcion === item.status);

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