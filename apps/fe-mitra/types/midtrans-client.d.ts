declare module 'midtrans-client' {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string })
    createTransaction(parameter: any): Promise<{ token: string; redirect_url: string }>
  }
}
