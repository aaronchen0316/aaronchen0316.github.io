function stripMarkdown(text) {
  return text
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function normalizeAssistantText(text) {
  return stripMarkdown(text)
}

export function humanizeSourceTitle(sourceName) {
  return sourceName.replace(/\.[^.]+$/, '').trim()
}

export function formatPaperReference(sources) {
  const topSource = sources[0]
  if (!topSource || topSource.source_kind !== 'paper') {
    return null
  }

  return `To know more, please see ${humanizeSourceTitle(topSource.source)}.`
}
