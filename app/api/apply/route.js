const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?\d[\d\s().-]{9,}$/

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validatePayload(payload) {
  const errors = {}
  const name = normalizeString(payload?.name)
  const email = normalizeString(payload?.email)
  const phone = normalizeString(payload?.phone)
  const comment = normalizeString(payload?.comment)
  const consent = payload?.consent === true

  if (!name) errors.name = 'Укажите ФИО'
  if (!email || !EMAIL_REGEX.test(email)) errors.email = 'Укажите корректный email'
  if (!phone || !PHONE_REGEX.test(phone)) errors.phone = 'Укажите телефон в международном формате'
  if (!consent) errors.consent = 'Необходимо согласие на обработку данных'

  return {
    isValid: Object.keys(errors).length === 0,
    data: { name, email, phone, comment, consent },
    errors,
  }
}

async function persistApplication(data) {
  // Имитация сохранения заявки: в реальном приложении здесь будет
  // вызов CRM, почтового сервиса или другой интеграции.
  console.info('[apply] Новая заявка', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    comment: data.comment,
  })
}

export async function POST(request) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Метод не поддерживается' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let payload
  try {
    payload = await request.json()
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Некорректное тело запроса' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { isValid, data, errors } = validatePayload(payload)
  if (!isValid) {
    return new Response(
      JSON.stringify({ success: false, error: 'Проверьте введённые данные', details: errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    await persistApplication(data)
  } catch (error) {
    console.error('[apply] Ошибка сохранения', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Не удалось сохранить заявку' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Заявка принята' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

export const _private = { validatePayload, persistApplication }
