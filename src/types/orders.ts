import type { BaseCustomerRecord, DomesticCustomerRecord, InternationalCustomerRecord } from './customers'

export type OrderStatus = '待审核' | '已审核' | '退款中'

export interface BaseOrderRecord extends BaseCustomerRecord {
  status: OrderStatus
}

export interface DomesticOrderRecord extends DomesticCustomerRecord, BaseOrderRecord {}

export interface InternationalOrderRecord extends InternationalCustomerRecord, BaseOrderRecord {}
