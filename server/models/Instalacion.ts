import { ObjectId } from 'mongodb'

export interface Instalacion {
  _id?: string | ObjectId,
  folio: string,
  calificacion: string,
  descripcion: string,
  direccion:string,
  fechaInstalacion: string,
  observaciones: string,
  ciudad: string,
  estado: string,
  codigoPostal: string,
  status: string
}

export const InstalacionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object'
    }
  }
}