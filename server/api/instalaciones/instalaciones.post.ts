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

    console.log("Entra al post");
    const body = await readBody(event)

    // Validación básica
    if (!body.nombre || !body.apellidos || !body.telefono || !body.correo || !body.direccion || !body.ciudad || !body.estado || !body.codigoPostal) {
      throw createError({
        statusCode: 400,
        message: 'Todos los campos son requeridos'
      })
    }

    const collectionUsuario = await getCollection('Usuario');

    // Verificar si el email ya existe
    const existingUser = await collectionUsuario.findOne({ correo: body.correo })
    if (existingUser) {
        throw createError({
        statusCode: 409,
        message: 'El email ya está registrado'
    })
}

    // Generar folio único
    const folio = generarFolio()

    const nuevoUsuario: Omit<Usuario, '_id'> = {
        folio: folio,
        nombre: body.nombre,
        apellidos: body.apellidos,
        rol: 'Cliente',
        telefono: body.telefono,
        correo: body.correo
    }

    const resultNuevoUsuario = await collectionUsuario.insertOne(nuevoUsuario)


    const collectionInstalacion = await getCollection('Instalacion');
    const nuevaInstalacion: Omit<Instalacion, '_id' > = {
        folio: folio,
        calificacion: body.calificacion || '',
        descripcion: body.descripcion || '',
        direccion: body.direccion,
        fechaInstalacion: body.fechaInstalacion || '',
        observaciones: body.observaciones || '',
        ciudad: body.ciudad,
        estado: body.estado,
        codigoPostal: body.codigoPostal,
        status: 'Solicitud'
    }
    const resultNuevaInstalacion = await collectionInstalacion.insertOne(nuevaInstalacion);


    return {
      success: true,
      data: {
        _id: resultNuevoUsuario.insertedId,
        _idInstalacion: resultNuevaInstalacion.insertedId,
        ...nuevoUsuario
      }
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