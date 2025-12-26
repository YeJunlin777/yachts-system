export interface BaseCustomerRecord {
  id: number
  orderNo: string
  customerName: string
  gender: string
  serviceName: string
  amount: number
  orderTime: string
  touristCount: number
  touristNames: string[]
  paymentTime: string
  auditor: string
  auditTime: string
  updatedAt: string
}

export interface DomesticCustomerRecord extends BaseCustomerRecord {
  country: string
}

export interface InternationalCustomerRecord extends BaseCustomerRecord {
  province: string
  city: string
}
