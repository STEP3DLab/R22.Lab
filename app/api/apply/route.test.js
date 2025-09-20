import { describe, expect, it } from 'vitest'
import { POST } from './route'

const endpoint = 'http://localhost/api/apply'

function createRequest(body) {
  return new Request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/apply', () => {
  it('returns success for valid payload', async () => {
    const response = await POST(
      createRequest({
        name: 'Тестовый Пользователь',
        email: 'user@example.com',
        phone: '+7 999 123-45-67',
        comment: 'Хочу присоединиться',
        consent: true,
      }),
    )

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.message).toBe('Заявка принята')
  })

  it('rejects invalid payload', async () => {
    const response = await POST(
      createRequest({
        name: '',
        email: 'wrong',
        phone: '123',
        consent: false,
      }),
    )

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.success).toBe(false)
    expect(json.error).toBe('Проверьте введённые данные')
    expect(json.details).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      consent: expect.any(String),
    })
  })
})
