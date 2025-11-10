import { getCollection } from '../../utils/mongodb'
import type { Usuario } from '../../models/Usuario'
import { randomInt } from 'crypto'
import { Instalacion } from '~~/server/models/Instalacion';

// Función para generar folio único
const generarFolio = (): string => {
  const fecha = new Date()
  const year = fecha.getFullYear().toString().slice(-2)
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  const random = String(randomInt(10000, 99999))
  return `INS${year}${month}${day}-${random}`
}

export default defineEventHandler(async (event) => {
  try {

    const body = await readBody(event)

    // Validación básica
    if (!body.nombre || !body.telefono || !body.calle || !body.numero || !body.plan) {
      throw createError({
        statusCode: 400,
        message: 'Hacen falta llenar campos requeridos'
      })
    }

    const collectionUsuario = await getCollection('Usuario');

    if (body.correo) {
      // Verificar si el email ya existe
      const existingUser = await collectionUsuario.findOne({ correo: body.correo })
      if (existingUser) {
        throw createError({
          statusCode: 409,
          message: 'El email ya está registrado'
        })
      }
    }

    // Generar folio único
    const folio = generarFolio()

    const nuevoUsuario:Usuario = {
        folio: folio,
        nombre: body.nombre,
        telefono: body.telefono,
        correo: body.correo,
        direccion: {
          calle: body.calle,
          numero: body.numero
        }
    }

    const resultNuevoUsuario = await collectionUsuario.insertOne(nuevoUsuario);
  
  const nuevaInstalacion: Instalacion = {
      folio: folio,
      calificacion: body.calificacion || '',
     plan: body.plan || '',
     timeStamps:{
      fechaSolicitado: new Date(),
     },
      statusAtual: 'Solicitud',
      pasos:{
        solicitado: true,
        pendienteAsignacion: false,
        pendienteConfirmacion: false,
        citaConfirmada: false,
        enProgresoInstalacion: false,
        instalacionConpletada: false,
        cancelado: false
      }
  }
  
  const collectionInstalacion = await getCollection('Instalacion');
  const resultNuevaInstalacion = await collectionInstalacion.insertOne(nuevaInstalacion);


    return {
      success: true,
      data: {
        ...nuevoUsuario,
        ...nuevaInstalacion
      },
      urlmiUltralink: 'http://localhost:3000/usuario/'+nuevoUsuario.folio
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error creando usuario:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear usuario'
    })
  }
})