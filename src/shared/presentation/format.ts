/** Número con decimales fijos ('1.1-1' → formatNumber(n, 1, 1)). */
export function formatNumber(value: number, minFraction = 0, maxFraction = minFraction): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  })
}

/** Segundos → HH:MM:SS */
export function formatTime(s: number): string {
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}

/** Hora HH:mm:ss; guiones si no hay fecha válida. */
export function formatClock(d: Date | null): string {
  if (!d || Number.isNaN(d.getTime())) return '--:--:--'
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
