<template>
  <div class="p-4">
    <h1>PrimeVue 4 en Nuxt 4</h1>



    


        <div class="card">
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
        </div>
    

    <Toast />
  </div>
</template>

<script setup lang="ts">


// Timeline
import { ref } from "vue";

const events = ref([
    { status: 'Solicitud', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg', current: false, completed: true },
    { status: 'En espera de cita', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7', image: 'game-controller.jpg', current: true, completed: false },
    { status: 'Confirmacion cita', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800', image: 'game-controller.jpg', current: false, completed: false },
    { status: 'Instalacion', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B', image: 'game-controller.jpg', current: false, completed: false },
    { status: 'Instalado', date: '16/10/2020 14:00', icon: 'pi pi-check', color: '#4CAF50', image: 'game-controller.jpg', current: false, completed: false },
]);



//botones, input, datatable y toast
const text = ref('')
const toast = useToast()



const showToast = () => {
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Mensaje enviado correctamente',
    life: 3000
  })
}
</script>



<style lang="scss" scoped>
// Estilos para remarcar el estado actual y completados
::v-deep(.customized-timeline) {
    // Remarcar la línea del timeline SOLO para eventos completados (hacia arriba desde el actual)
    .p-timeline-event:has(.completed-marker) {
        .p-timeline-event-connector {
            background-color: #4CAF50; // Verde para indicar completado
            width: 4px; // Línea más gruesa
        }
    }

    // Efecto pulsante en el marcador actual (SOLO el icono, no la línea)
    .current-marker {
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
        transform: scale(1.1); // Marcador un poco más grande
    }

    // Los marcadores completados también tienen un estilo especial
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