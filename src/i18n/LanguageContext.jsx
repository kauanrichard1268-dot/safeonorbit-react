// Sistema de idiomas do site.
// - LanguageProvider: guarda o idioma atual e o entrega para todos os componentes.
// - useI18n(): hook que qualquer componente usa para pegar a função t() de tradução.
import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import translations from './translations.js'

export const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-US', dir: 'ltr' },
  { code: 'ar', label: 'العربية', locale: 'ar-u-nu-latn', dir: 'rtl' }, // árabe: direita → esquerda
  { code: 'es', label: 'Español', locale: 'es-ES', dir: 'ltr' },
  { code: 'fr', label: 'Français', locale: 'fr-FR', dir: 'ltr' },
  { code: 'pt', label: 'Português', locale: 'pt-BR', dir: 'ltr' },
]

const STORAGE_KEY = 'safeonorbit-language'
const I18nContext = createContext(null)

// Lê o idioma salvo no navegador (se houver); senão, começa em inglês.
function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGUAGES.some(l => l.code === saved)) return saved
  } catch { /* navegador sem acesso ao localStorage */ }
  return 'en'
}

// Busca uma chave como 'hero.copy' dentro do objeto de traduções.
function lookup(dict, key) {
  return key.split('.').reduce((obj, part) => obj?.[part], dict)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage)
  const info = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  // t('chave', { variavel: valor }) → texto traduzido.
  // Se o valor de alguma variável for um elemento React (ex.: <strong>), devolve uma lista de elementos.
  const t = useCallback((key, vars) => {
    const text = lookup(translations[lang], key) ?? lookup(translations.en, key) ?? key
    if (!vars) return text
    const parts = text.split(/\{(\w+)\}/g) // posições ímpares = nomes das variáveis
    const onlyText = Object.values(vars).every(v => typeof v === 'string' || typeof v === 'number')
    if (onlyText) return parts.map((p, i) => (i % 2 ? vars[p] ?? `{${p}}` : p)).join('')
    return parts.map((p, i) => <Fragment key={i}>{i % 2 ? vars[p] : p}</Fragment>)
  }, [lang])

  // Ao trocar de idioma: ajusta <html lang dir>, o título da aba e salva a escolha.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = info.dir
    document.title = t('meta.title')
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignora */ }
  }, [lang, info.dir, t])

  const value = useMemo(
    () => ({ lang, setLang, locale: info.locale, dir: info.dir, t }),
    [lang, info, t]
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n() precisa estar dentro de <LanguageProvider>')
  return ctx
}
