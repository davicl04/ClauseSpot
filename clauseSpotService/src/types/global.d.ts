declare global {
  type PassportUser = {
    id_usuario: string
    perfil: Array<string>
    id_perfis?: string
    perfis?: string
  }
  declare module 'express-serve-static-core' {
    interface Request {
      user?: PassportUser
    }
  }
}
