import {getCollection} from '../../utils/mongodb'
import {Status} from '../../models/Status'

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection('Status');
    const status = await collection.find<Status>({}).toArray()



    return {
      success: true,
      data: status,
      count: status.length,
      mensaje: "todo correcto con los status",
    }
  } catch (error) {
    console.error('Error obteniendo status:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener status'
    })
  }
})