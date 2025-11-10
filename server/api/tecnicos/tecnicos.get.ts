import {getCollection} from '../../utils/mongodb'
import {Tecnico} from '../../../server/models/Tecnico'

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection('Tecnico');
    const tecnicos = await collection.find<Tecnico>({}).toArray()



    return {
      success: true,
      data: tecnicos,
      count: tecnicos.length,
      mensaje: "Se obtuvo el listado de los tecnicos correctamente",
    }
  } catch (error) {
    console.error('Error al obtener listado de los tecnicos:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener listado de los tecnicos'
    })
  }
})