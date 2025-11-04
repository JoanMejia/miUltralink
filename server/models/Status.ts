import { ObjectId } from 'mongodb'

export interface Status {
  _id?: string | ObjectId,
  idStatus: number,
  descripcion: string,
  descripcionCamelCase: string
}

export const StatusSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object'
    }
  }
}