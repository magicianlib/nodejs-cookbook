import type { ScaledPart } from '@/types/account'

export function useMoneyFormat() {
  function formatScaledAmount(num: number, locale: string): ScaledPart[] {
    const isCn = !locale || locale === 'zh-CN' || locale === 'zh-TW'
    const [intStr, decRaw] = num.toFixed(2).split('.')
    const fraction = '.' + decRaw
    const intNum = parseInt(intStr, 10)
    return isCn ? fmtCn(intNum, fraction) : fmtWestern(intNum, fraction)
  }

  function fmtCn(n: number, f: string): ScaledPart[] {
    if (n < 10000) {
      return [
        { type: 'digits', value: n.toLocaleString('en-US') },
        { type: 'fraction', value: f },
      ]
    }
    const yi = Math.floor(n / 100000000)
    const rem = n % 100000000
    const wan = Math.floor(rem / 10000)
    const ge = rem % 10000
    const parts: ScaledPart[] = []

    if (yi > 0) {
      parts.push({ type: 'digits', value: yi.toLocaleString('en-US') })
      parts.push({ type: 'scale', value: '亿' })
    }
    if (wan > 0) {
      const wanStr = yi > 0 ? String(wan).padStart(4, '0') : wan.toLocaleString('en-US')
      parts.push({ type: 'digits', value: wanStr })
      parts.push({ type: 'scale', value: '万' })
    }
    if (ge > 0) {
      const geStr = (yi > 0 || wan > 0) ? String(ge).padStart(4, '0') : ge.toLocaleString('en-US')
      parts.push({ type: 'digits', value: geStr })
    }
    parts.push({ type: 'fraction', value: f })
    return parts
  }

  function fmtWestern(n: number, f: string): ScaledPart[] {
    if (n < 1000) {
      return [
        { type: 'digits', value: n.toLocaleString('en-US') },
        { type: 'fraction', value: f },
      ]
    }
    const b = Math.floor(n / 1e9)
    const r1 = n % 1e9
    const m = Math.floor(r1 / 1e6)
    const r2 = r1 % 1e6
    const k = Math.floor(r2 / 1e3)
    const ge = r2 % 1e3
    const parts: ScaledPart[] = []

    if (b > 0) {
      parts.push({ type: 'digits', value: b.toLocaleString('en-US') })
      parts.push({ type: 'scale', value: 'B' })
    }
    if (m > 0) {
      const mStr = b > 0 ? String(m).padStart(3, '0') : m.toLocaleString('en-US')
      parts.push({ type: 'digits', value: mStr })
      parts.push({ type: 'scale', value: 'M' })
    }
    if (k > 0) {
      const kStr = (b > 0 || m > 0) ? String(k).padStart(3, '0') : k.toLocaleString('en-US')
      parts.push({ type: 'digits', value: kStr })
      parts.push({ type: 'scale', value: 'K' })
    }
    if (ge > 0) {
      const geStr = (b > 0 || m > 0 || k > 0) ? String(ge).padStart(3, '0') : ge.toLocaleString('en-US')
      parts.push({ type: 'digits', value: geStr })
    }
    parts.push({ type: 'fraction', value: f })
    return parts
  }

  function formatMoney(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return {
    formatScaledAmount,
    formatMoney,
  }
}
