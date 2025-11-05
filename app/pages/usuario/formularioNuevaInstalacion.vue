<template>
  <div class="container mx-auto p-4">
    <Card>
      <template #title>
        <h2 class="text-2xl font-bold">Nueva Instalación</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="p-fluid">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div class="field">
              <label for="nombre" class="font-semibold">Nombre <span class="text-red-500">*</span></label>
              <InputText
                id="nombre"
                v-model="formData.nombre"
                :class="{ 'p-invalid': submitted && !formData.nombre }"
                placeholder="Ingrese el nombre"
              />
              <small v-if="submitted && !formData.nombre" class="p-error">El nombre es requerido.</small>
            </div>

            <!-- Apellidos -->
            <div class="field">
              <label for="apellidos" class="font-semibold">Apellidos <span class="text-red-500">*</span></label>
              <InputText
                id="apellidos"
                v-model="formData.apellidos"
                :class="{ 'p-invalid': submitted && !formData.apellidos }"
                placeholder="Ingrese los apellidos"
              />
              <small v-if="submitted && !formData.apellidos" class="p-error">Los apellidos son requeridos.</small>
            </div>

            <!-- Teléfono -->
            <div class="field">
              <label for="telefono" class="font-semibold">Teléfono <span class="text-red-500">*</span></label>
              <InputText
                id="telefono"
                v-model="formData.telefono"
                :class="{ 'p-invalid': submitted && !formData.telefono }"
                placeholder="Ingrese el teléfono"
                maxlength="10"
              />
              <small v-if="submitted && !formData.telefono" class="p-error">El teléfono es requerido.</small>
            </div>

            <!-- Correo -->
            <div class="field">
              <label for="correo" class="font-semibold">Correo <span class="text-red-500">*</span></label>
              <InputText
                id="correo"
                v-model="formData.correo"
                type="email"
                :class="{ 'p-invalid': submitted && !formData.correo }"
                placeholder="Ingrese el correo electrónico"
              />
              <small v-if="submitted && !formData.correo" class="p-error">El correo es requerido.</small>
            </div>

            <!-- Dirección -->
            <div class="field md:col-span-2">
              <label for="direccion" class="font-semibold">Dirección <span class="text-red-500">*</span></label>
              <InputText
                id="direccion"
                v-model="formData.direccion"
                :class="{ 'p-invalid': submitted && !formData.direccion }"
                placeholder="Ingrese la dirección completa"
              />
              <small v-if="submitted && !formData.direccion" class="p-error">La dirección es requerida.</small>
            </div>

            <!-- Ciudad -->
            <div class="field">
              <label for="ciudad" class="font-semibold">Ciudad <span class="text-red-500">*</span></label>
              <InputText
                id="ciudad"
                v-model="formData.ciudad"
                :class="{ 'p-invalid': submitted && !formData.ciudad }"
                placeholder="Ingrese la ciudad"
              />
              <small v-if="submitted && !formData.ciudad" class="p-error">La ciudad es requerida.</small>
            </div>

            <!-- Estado -->
            <div class="field">
              <label for="estado" class="font-semibold">Estado <span class="text-red-500">*</span></label>
              <Dropdown
                id="estado"
                v-model="formData.estado"
                :options="estadosMexico"
                option-label="label"
                option-value="value"
                placeholder="Seleccione el estado"
                :class="{ 'p-invalid': submitted && !formData.estado }"
                filter
              />
              <small v-if="submitted && !formData.estado" class="p-error">El estado es requerido.</small>
            </div>

            <!-- Código Postal -->
            <div class="field">
              <label for="codigoPostal" class="font-semibold">Código Postal <span class="text-red-500">*</span></label>
              <InputText
                id="codigoPostal"
                v-model="formData.codigoPostal"
                :class="{ 'p-invalid': submitted && !formData.codigoPostal }"
                placeholder="Ingrese el código postal"
                maxlength="5"
              />
              <small v-if="submitted && !formData.codigoPostal" class="p-error">El código postal es requerido.</small>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-3 mt-6">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              severity="secondary"
              @click="handleCancel"
              type="button"
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              type="submit"
              :loading="loading"
            />
          </div>
        </form>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const formData = ref({
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigoPostal: ''
})

const submitted = ref(false)
const loading = ref(false)

const estadosMexico = ref([
  { label: 'Aguascalientes', value: 'Aguascalientes' },
  { label: 'Baja California', value: 'Baja California' },
  { label: 'Baja California Sur', value: 'Baja California Sur' },
  { label: 'Campeche', value: 'Campeche' },
  { label: 'Chiapas', value: 'Chiapas' },
  { label: 'Chihuahua', value: 'Chihuahua' },
  { label: 'Ciudad de México', value: 'Ciudad de México' },
  { label: 'Coahuila', value: 'Coahuila' },
  { label: 'Colima', value: 'Colima' },
  { label: 'Durango', value: 'Durango' },
  { label: 'Estado de México', value: 'Estado de México' },
  { label: 'Guanajuato', value: 'Guanajuato' },
  { label: 'Guerrero', value: 'Guerrero' },
  { label: 'Hidalgo', value: 'Hidalgo' },
  { label: 'Jalisco', value: 'Jalisco' },
  { label: 'Michoacán', value: 'Michoacán' },
  { label: 'Morelos', value: 'Morelos' },
  { label: 'Nayarit', value: 'Nayarit' },
  { label: 'Nuevo León', value: 'Nuevo León' },
  { label: 'Oaxaca', value: 'Oaxaca' },
  { label: 'Puebla', value: 'Puebla' },
  { label: 'Querétaro', value: 'Querétaro' },
  { label: 'Quintana Roo', value: 'Quintana Roo' },
  { label: 'San Luis Potosí', value: 'San Luis Potosí' },
  { label: 'Sinaloa', value: 'Sinaloa' },
  { label: 'Sonora', value: 'Sonora' },
  { label: 'Tabasco', value: 'Tabasco' },
  { label: 'Tamaulipas', value: 'Tamaulipas' },
  { label: 'Tlaxcala', value: 'Tlaxcala' },
  { label: 'Veracruz', value: 'Veracruz' },
  { label: 'Yucatán', value: 'Yucatán' },
  { label: 'Zacatecas', value: 'Zacatecas' }
])

const validateForm = (): boolean => {
  return !!(
    formData.value.nombre &&
    formData.value.apellidos &&
    formData.value.telefono &&
    formData.value.correo &&
    formData.value.direccion &&
    formData.value.ciudad &&
    formData.value.estado &&
    formData.value.codigoPostal
  )
}

const handleSubmit = async () => {
  submitted.value = true

  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor complete todos los campos requeridos',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const instalacionData = {
      nombre: formData.value.nombre,
      apellidos: formData.value.apellidos,
      telefono: formData.value.telefono,
      correo: formData.value.correo,
      direccion: formData.value.direccion,
      ciudad: formData.value.ciudad,
      estado: formData.value.estado,
      codigoPostal: formData.value.codigoPostal
    }

    // Aquí debes implementar la llamada a tu API
    const respuesta = await $fetch('/api/instalaciones/instalaciones', {
      method: 'POST',
      body: instalacionData
    })

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Instalación registrada correctamente',
      life: 3000
    })

    // Resetear el formulario
    resetForm()

    // Redireccionar a la página del folio
    if (respuesta.data.folio) {
      await navigateTo(`/usuario/${respuesta.data.folio}`)
    }
  } catch (error) {
    console.error('Error al guardar la instalación:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la instalación. Intente nuevamente.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    nombre: '',
    apellidos: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    estado: '',
    codigoPostal: ''
  }
  submitted.value = false
}
</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
