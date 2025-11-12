import { getCollection } from '../../utils/mongodb'
import type { Instalacion } from '../../models/Instalacion'

export default defineEventHandler(async (event) => {
  try {


    const body = await readBody(event)
    

    // Validación básica
    if (!body.folio) {
      throw createError({
        statusCode: 400,
        message: 'El folio es requerido para actualizar la instalación'
      })
    }

    const collection = await getCollection('Instalacion')

    // Verificar si la instalación existe
    const instalacionExistente = await collection.findOne({ folio: body.folio })
    if (!instalacionExistente) {
      throw createError({
        statusCode: 404,
        message: 'Instalación no encontrada'
      })
    }

    // Preparar el objeto de actualización, excluyendo el folio
    const { folio, _id, ...datosActualizacion } = body

    // Construir el objeto de actualización solo con los campos proporcionados
    const updateData: Partial<Instalacion> = {};

    // Actualizar campos básicos si están presentes
    if (body.tecnicoId !== undefined) updateData.tecnicoId = body.tecnicoId
    if (body.plan !== undefined) updateData.plan = body.plan
    if (body.statusAtual !== undefined) updateData.statusAtual = body.statusAtual
    if (body.numeroModem !== undefined) updateData.numeroModem = body.numeroModem
    if (body.notas !== undefined) updateData.notas = body.notas
    if (body.calificacion !== undefined) updateData.calificacion = body.calificacion
    if (body.feedback !== undefined) updateData.feedback = body.feedback

    // Actualizar pasos si están presentes
    if (body.pasos) {
      updateData.pasos = {
        solicitado: body.pasos.solicitado ?? instalacionExistente.pasos.solicitado,
        pendienteAsignacion: body.pasos.pendienteAsignacion ?? instalacionExistente.pasos.pendienteAsignacion,
        pendienteConfirmacion: body.pasos.pendienteConfirmacion ?? instalacionExistente.pasos.pendienteConfirmacion,
        citaConfirmada: body.pasos.citaConfirmada ?? instalacionExistente.pasos.citaConfirmada,
        enProgresoInstalacion: body.pasos.enProgresoInstalacion ?? instalacionExistente.pasos.enProgresoInstalacion,
        instalacionConpletada: body.pasos.instalacionConpletada ?? instalacionExistente.pasos.instalacionConpletada,
        cancelado: body.pasos.cancelado ?? instalacionExistente.pasos.cancelado
      }
    }

    // Actualizar timeStamps si están presentes
    if (body.timeStamps) {
      updateData.timeStamps = {
        fechaSolicitado: body.timeStamps.fechaSolicitado ? new Date(body.timeStamps.fechaSolicitado) : instalacionExistente.timeStamps.fechaSolicitado,
        fechapendienteasignacion: body.timeStamps.fechapendienteasignacion ? new Date(body.timeStamps.fechapendienteasignacion) : instalacionExistente.timeStamps.fechapendienteasignacion,
        fechaPendienteConfirmacion: body.timeStamps.fechaPendienteConfirmacion ? new Date(body.timeStamps.fechaPendienteConfirmacion) : instalacionExistente.timeStamps.fechaPendienteConfirmacion,
        fechaCitaConfirmada: body.timeStamps.fechaCitaConfirmada ? new Date(body.timeStamps.fechaCitaConfirmada) : instalacionExistente.timeStamps.fechaCitaConfirmada,
        fechaEnProgresoInstalacion: body.timeStamps.fechaEnProgresoInstalacion ? new Date(body.timeStamps.fechaEnProgresoInstalacion) : instalacionExistente.timeStamps.fechaEnProgresoInstalacion,
        fechaInstalacionCompletada: body.timeStamps.fechaInstalacionCompletada ? new Date(body.timeStamps.fechaInstalacionCompletada) : instalacionExistente.timeStamps.fechaInstalacionCompletada,
        fechaCancelacion: body.timeStamps.fechaCancelacion ? new Date(body.timeStamps.fechaCancelacion) : instalacionExistente.timeStamps.fechaCancelacion
      }
    }

    // Actualizar citaDetalle si está presente
    if (body.citaDetalle) {
      updateData.citaDetalle = {
        fechaPropuesta: body.citaDetalle.fechaPropuesta? new Date(body.citaDetalle.fechaPropuesta) : instalacionExistente.citaDetalle?.fechaPropuesta || null,
        confirmacionUsuario: body.citaDetalle.confirmacionUsuario ?? instalacionExistente.citaDetalle?.confirmacionUsuario ?? false,
        fechaConfirmacion: body.citaDetalle.fechaConfirmacion ? new Date(body.citaDetalle.fechaConfirmacion) : instalacionExistente.citaDetalle?.fechaConfirmacion || null
      }
    }

    // Realizar la actualización en MongoDB
    const result = await collection.updateOne(
      { folio: body.folio },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Instalación no encontrada'
      })
    }

    // Obtener el documento actualizado
    const instalacionActualizada = await collection.findOne({ folio: body.folio })

    return {
      success: true,
      message: 'Instalación actualizada correctamente',
      data: instalacionActualizada,
      modified: result.modifiedCount > 0
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Error actualizando instalación:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar instalación'
    })
  }
})
