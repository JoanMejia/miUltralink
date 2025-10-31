// import {getCollection} from '../../../server/utils/mongodb';
// import type { User } from '../../../server/models/Usuario'
import {getCollection} from '../../utils/mongodb'
import {Usuario} from '../../../server/models/Usuario'

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection('Usuario');
    const usuarios = await collection.find<Usuario>({}).toArray()



    return {
      success: true,
      data: usuarios,
      count: usuarios.length,
      mensaje: "todo correcto",
    }
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener usuarios'
    })
  }
})