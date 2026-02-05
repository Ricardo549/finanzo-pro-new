import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
    test('should load the login page', async ({ page }) => {
        await page.goto('/login');

        // Check for title or key element
        await expect(page).toHaveTitle(/Finanzo/);

        // Check for login inputs
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();

        const passwordInput = page.locator('input[type="password"]');
        await expect(passwordInput).toBeVisible();

        // Check for submit button
        const submitButton = page.getByRole('button', { name: /Acessar Painel/i });
        await expect(submitButton).toBeVisible();
    });

    test('should show register link', async ({ page }) => {
        await page.goto('/login');
        // Check for the specific text in the "No account?" button
        await expect(page.getByText(/Não tem conta\? Comece Grátis/i)).toBeVisible();
    });
});
