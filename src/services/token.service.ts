export const tokenService = {
    // In a real implementation with HttpOnly + Secure Cookies, 
    // the client script CANNOT access the Access Token.
    // It would only handle a CSRF token or nothing at all (browser handles cookies).

    // For this "Serverless/Mock" stage, we must use LocalStorage 
    // because we don't have a real server to set headers.
    // However, we abstract it here so switching to Cookies is 1 file change.

    getToken(): string | null {
        return localStorage.getItem('auth_access_token');
    },

    setToken(token: string): void {
        localStorage.setItem('auth_access_token', token);
    },

    removeToken(): void {
        localStorage.removeItem('auth_access_token');
    },

    // Method to check if token is structurally valid (basic structure check)
    isValidStructure(token: string): boolean {
        return typeof token === 'string' && token.length > 10;
    }
};
