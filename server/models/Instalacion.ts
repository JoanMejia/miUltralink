import { ObjectId } from 'mongodb'
import { Usuario } from './Usuario'

// export interface Instalacion {
//   _id?: string | ObjectId,
//   folio: string,
//   calificacion: string,
//   descripcion: string,
//   direccion:string,
//   fechaSolicitud: Date,
//   observaciones: string,
//   ciudad: string,
//   estado: string,
//   codigoPostal: string,
//   status: string
// }

export const InstalacionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object'
    }
  }
}



export interface Instalacion {
  // _id?: string | ObjectId,
  folio: string,
  // usuarioId: string,
  tecnicoId?:string,
  plan: string,
  statusAtual: string,
  pasos:{
    solicitado: boolean,
    pendienteAsignacion: boolean,
    pendienteConfirmacion: boolean,
    citaConfirmada: boolean,
    enProgresoInstalacion: boolean,
    instalacionConpletada: boolean,
    cancelado: boolean
  },
  timeStamps: {
    fechaSolicitado: Date,
    fechapendienteasignacion?:Date | null,
    fechaPendienteConfirmacion?: Date | null,
    fechaCitaConfirmada?: Date | null,
    fechaEnProgresoInstalacion?: Date | null,
    fechaInstalacionCompletada?: Date | null,
    fechaCancelacion?: Date | null
  },
  citaDetalle?:{
    fechaPropuesta: Date | null,
    confirmacionUsuario: boolean,
    fechaConfirmacion?: Date | null
  },
  numeroModem?: string,
  notas?: string,
  calificacion?: number,
  feedback?: string
}