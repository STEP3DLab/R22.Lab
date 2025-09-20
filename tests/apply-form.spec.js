// @ts-check
const { test, expect } = require('@playwright/test')

const fillForm = async (page) => {
  await page.goto('/')
  await page.getByLabel('ФИО').fill('Тестовый Пользователь')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Телефон').fill('+7 999 123-45-67')
  await page.getByLabel('Ваш запрос').fill('Готов присоединиться к программе')
  await page.getByRole('checkbox', { name: /соглас/i }).check()
}

test.describe('Apply form', () => {
  test('submits application successfully', async ({ page }) => {
    await fillForm(page)
    const responsePromise = page.waitForResponse('**/api/apply')
    await page.getByRole('button', { name: 'Отправить заявку' }).click()
    const response = await responsePromise
    expect(response.ok()).toBeTruthy()
    await expect(page.getByText('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')).toBeVisible()
  })

  test('shows error message if server fails', async ({ page }) => {
    await page.route('**/api/apply', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Сервис временно недоступен' }),
      })
    })

    await fillForm(page)
    await page.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page.getByText(/Не удалось отправить заявку/)).toBeVisible()
    await page.unroute('**/api/apply')
  })
})
