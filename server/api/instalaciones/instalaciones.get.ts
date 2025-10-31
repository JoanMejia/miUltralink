import {getCollection} from '../../utils/mongodb'
import {Instalacion} from '../../models/Instalacion'

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection('Instalacion');
    const instalaciones = await collection.find<Instalacion>({}).toArray()



    return {
      success: true,
      data: instalaciones,
      count: instalaciones.length,
      mensaje: "todo correcto",
    }
  } catch (error) {
    console.error('Error obteniendo instalaciones:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener instalaciones'
    })
  }
})