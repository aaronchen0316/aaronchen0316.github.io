import { useEffect, useMemo, useRef, useState } from 'react'
import { formatPaperReference, normalizeAssistantText } from '../chat/chatFormatting'
import { chatConfig } from '../content/siteContent'

function normalizeApiUrl(value) {
  return value?.trim().replace(/\/$/, '')
}

function resolveApiUrl() {
  const configuredUrl = normalizeApiUrl(import.meta.env.VITE_CHAT_API_URL)
  if (configuredUrl) {
    return configuredUrl
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
    }
  }

  return ''
}

const API_URL = resolveApiUrl()
const HAS_CONFIGURED_API_URL = Boolean(normalizeApiUrl(import.meta.env.VITE_CHAT_API_URL))

function makeMessageId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function makeMessage(role, content) {
  return {
    id: makeMessageId(),
    role,
    content,
    sources: [],
  }
}

function formatChatError(error) {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Chat backend unreachable. Check the deployed API URL, HTTPS, and allowed origins.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Chat request failed. Check backend config.'
}

function createInitialMessages() {
  return [
    makeMessage(
      'assistant',
      "Hi. I'm Aaron's AI research assistant. Ask about research, papers, projects, or technical background.",
    ),
  ]
}

function buildNextHistory(messages) {
  return messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map(({ role, content }) => ({ role, content }))
}

function renderMessage(message, isLoading) {
  const referenceLine = message.role === 'assistant' ? formatPaperReference(message.sources) : null

  return (
    <article key={message.id} className={`chat-message ${message.role}`}>
      <p>{message.content || (isLoading && message.role === 'assistant' ? 'Thinking...' : '')}</p>
      {referenceLine ? <p className="chat-reference">{referenceLine}</p> : null}
    </article>
  )
}

async function streamAssistantReply({ apiUrl, query, history, onToken, onDone }) {
  const response = await fetch(`${apiUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ query, history }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed with status ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      const dataLine = event
        .split('\n')
        .find((line) => line.startsWith('data:'))

      if (!dataLine) {
        continue
      }

      const payload = JSON.parse(dataLine.slice(5).trim())

      if (payload.type === 'token') {
        onToken(payload.content)
      } else if (payload.type === 'done') {
        onDone(payload.sources ?? [])
      } else if (payload.type === 'error') {
        throw new Error(payload.message)
      }
    }
  }
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [messages, setMessages] = useState(() => createInitialMessages())
  const messageViewportRef = useRef(null)

  const apiStatus = useMemo(() => {
    if (HAS_CONFIGURED_API_URL) {
      return 'Live API'
    }

    if (API_URL) {
      return 'Local API'
    }

    return 'Chat offline'
  }, [])

  useEffect(() => {
    const viewport = messageViewportRef.current
    if (!viewport) {
      return
    }

    viewport.scrollTop = viewport.scrollHeight
  }, [messages])

  function resetChat() {
    setIsOpen(false)
    setInput('')
    setIsLoading(false)
    setHasInteracted(false)
    setMessages(createInitialMessages())
  }

  async function handleSubmit(nextQuestion) {
    const query = (nextQuestion ?? input).trim()
    if (!query || isLoading) {
      return
    }

    setHasInteracted(true)

    const userMessage = makeMessage('user', query)
    const assistantMessage = makeMessage('assistant', '')
    const nextHistory = buildNextHistory([...messages, userMessage])

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')

    if (!API_URL) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, content: chatConfig.fallbackMessage }
            : message,
        ),
      )
      return
    }

    setIsLoading(true)

    try {
      await streamAssistantReply({
        apiUrl: API_URL,
        query,
        history: nextHistory,
        onToken: (chunk) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: `${message.content}${chunk}` }
                : message,
            ),
          )
        },
        onDone: (sources) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id
                ? {
                    ...message,
                    content: normalizeAssistantText(message.content),
                    sources,
                  }
                : message,
            ),
          )
        },
      })
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: formatChatError(error),
              }
            : message,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`chat-widget ${isOpen ? 'is-open' : ''}`}>
      {isOpen ? (
        <section className="chat-panel" aria-label="Ask about Aaron">
          <header className="chat-header">
            <div className="chat-brand">
              <div className="chat-badge" aria-hidden="true">
                AC
              </div>
              <div>
                <strong>{chatConfig.title}</strong>
                <p>{chatConfig.subtitle}</p>
              </div>
            </div>
            <button type="button" className="chat-close" aria-label="Close chat" onClick={resetChat}>
              X
            </button>
          </header>

          <div className="chat-status">{apiStatus}</div>

          <div ref={messageViewportRef} className="chat-messages">
            {messages.map((message) => renderMessage(message, isLoading))}
          </div>

          {!hasInteracted ? (
            <div className="chat-suggestions">
              <span className="chat-suggestions-label">Try asking:</span>
              {chatConfig.starterQuestions.map((question) => (
                <button key={question} type="button" onClick={() => handleSubmit(question)}>
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault()
              void handleSubmit()
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about research, papers, or projects"
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="chat-launcher"
        aria-label={isOpen ? 'Close chat widget' : 'Open chat widget'}
        onClick={() => {
          if (isOpen) {
            resetChat()
            return
          }

          setIsOpen(true)
        }}
      >
        {isOpen ? 'X' : 'Ask'}
      </button>
    </div>
  )
}

export default ChatWidget
