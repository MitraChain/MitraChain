declare module 'midtrans-client' {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string })
    createTransaction(parameter: any): Promise<{ token: string; redirect_url: string }>
  }

  export class CoreApi {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string })
    charge(parameter: any): Promise<any>
    checkTransaction(orderId: string): Promise<any>
  }
}
