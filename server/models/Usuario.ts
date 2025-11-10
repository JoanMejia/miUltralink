import { ObjectId } from 'mongodb'

// export interface Usuario {
//   _id?: string |ObjectId,
//   nombre: string,
//   folio: string,
//   apellidos: string,
//   rol:string,
//   telefono: string,
//   correo: string
// }

export const UserSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'correo'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre del usuario - requerido'
        },
        correo: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Email válido - requerido'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Fecha de creación'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Fecha de actualización'
        }
      }
    }
  }
}



export interface Usuario {
  // _id?: string |ObjectId,
  folio: string
  nombre: string,
  correo?:string
  telefono: string,
  direccion: {
    calle: string,
    numero: string,
    codigoPostal?: string
    ciudad?: string,
    estado?: string,
  }
}