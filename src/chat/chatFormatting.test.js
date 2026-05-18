import assert from 'node:assert/strict'
import test from 'node:test'

import { formatPaperReference, humanizeSourceTitle, normalizeAssistantText } from './chatFormatting.js'

test('normalizeAssistantText removes simple markdown list markers', () => {
  const text = '3. **Higher predictive accuracy**\n- Better signal'

  assert.equal(normalizeAssistantText(text), 'Higher predictive accuracy\nBetter signal')
})

test('formatPaperReference uses only top paper source', () => {
  const sources = [
    { source: 'Diffusion-Limited Crystal Growth of Gallium Nitride Using Active Machine Learning.pdf', source_kind: 'paper' },
    { source: 'overview.md', source_kind: 'profile' },
  ]

  assert.equal(
    formatPaperReference(sources),
    'To know more, please see Diffusion-Limited Crystal Growth of Gallium Nitride Using Active Machine Learning.',
  )
})

test('formatPaperReference omits non-paper top source', () => {
  const sources = [{ source: 'overview.md', source_kind: 'profile' }]

  assert.equal(formatPaperReference(sources), null)
})

test('humanizeSourceTitle strips file extension only', () => {
  assert.equal(humanizeSourceTitle('Aaron Chen Overview.md'), 'Aaron Chen Overview')
})
