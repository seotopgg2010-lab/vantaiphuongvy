import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'

const dictionaries = {
  vi: () => import('./dictionaries/vi.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries
export const locales: Locale[] = ['vi']
export const defaultLocale: Locale = 'vi'

// Legacy, unmounted components are retained temporarily while their Supabase admin dependencies are retired.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Awaited<ReturnType<typeof dictionaries.vi>> & Record<string, any>

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale?: string) => {
  const l = locale || await lang()
  if (!hasLocale(l)) notFound()
  return dictionaries[l]()
}
