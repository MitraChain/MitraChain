import { MaskitoOptions, maskitoTransform } from '@maskito/core'
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from '@maskito/kit'
import { RefCallback } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export const withMaskitoRegister = (
  registerResult: UseFormRegisterReturn,
  maskitoRef: RefCallback<HTMLElement | null>,
): UseFormRegisterReturn & { onInput: UseFormRegisterReturn['onChange'] } => {
  const ref: RefCallback<HTMLElement | null> = (node): void => {
    registerResult.ref(node)
    maskitoRef(node)
  }

  return {
    ...registerResult,
    ref,
    onInput: registerResult.onChange,
  }
}

export const rupiahMaskOptions: MaskitoOptions = maskitoNumberOptionsGenerator({
  precision: 0,
  decimalSeparator: ',',
  thousandSeparator: '.',
  prefix: 'Rp',
})

export function parseRupiahMaskToNumber(str: string) {
  return maskitoParseNumber(str, ',')
}

export function transformNumberToRupiahMask(num: number | undefined) {
  if (num === undefined) return ''
  return maskitoTransform(String(num), rupiahMaskOptions)
}
