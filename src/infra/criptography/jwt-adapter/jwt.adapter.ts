import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {} // the same as declarating the vars on top of the class and assigning to it in the constructor

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (accessToken: string): Promise<string> {
    const value: any = await jwt.verify(accessToken, this.secret)
    return value
  }
}
