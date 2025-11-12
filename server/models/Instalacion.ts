import { ObjectId } from 'mongodb'
import { Usuario } from './Usuario'
import { Schema, model, Document } from "mongoose";

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

// export const InstalacionSchema = {
//   validator: {
//     $jsonSchema: {
//       bsonType: 'object'
//     }
//   }
// }

const InstalacionSchema = new Schema<Instalacion>({
  folio: { type: String, required: true },
  plan: { type: String, required: true },
  statusAtual: { type: String, required: true },
   pasos:{
    solicitado: { type: String, required: true },
    pendienteAsignacion: { type: String, required: true },
    pendienteConfirmacion: { type: String, required: true },
    citaConfirmada: { type: String, required: true },
    enProgresoInstalacion: { type: String, required: true },
    instalacionConpletada: { type: String, required: true },
    cancelado: { type: String, required: true }
  },
  timeStamps: {
    fechaSolicitado: { type: Date, required: true }
  },
  citaDetalle:{
    fechaPropuesta: { type: Date, required: false },
    confirmacionUsuario: { type: String, required: true },
    fechaConfirmacion:{ type: Date, required: false }
  }
});


// uso de esquema
// const InstalacionModelo = model<Instalacion>("Instalacion", InstalacionSchema);



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