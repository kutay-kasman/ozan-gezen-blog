import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../LanguageContext';

// Test component that uses the hook
function TestComponent() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div>
            <span data-testid="language">{language}</span>
            <span data-testid="translation">{t('siteName')}</span>
            <button onClick={() => setLanguage('tr')} data-testid="switch-to-tr">
                Switch to TR
            </button>
            <button onClick={() => setLanguage('en')} data-testid="switch-to-en">
                Switch to EN
            </button>
        </div>
    );
}

describe('LanguageContext', () => {
    beforeEach(() => {
        // Clear localStorage mock
        jest.clearAllMocks();
        (localStorage.getItem as jest.Mock).mockReturnValue(null);
    });

    describe('LanguageProvider', () => {
        it('should render children correctly', () => {
            render(
                <LanguageProvider>
                    <div data-testid="child">Child content</div>
                </LanguageProvider>
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('should provide default language as en', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('language')).toHaveTextContent('en');
        });

        it('should load saved language from localStorage', async () => {
            (localStorage.getItem as jest.Mock).mockReturnValue('tr');

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            // Wait for useEffect to run
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 0));
            });

            expect(screen.getByTestId('language')).toHaveTextContent('tr');
        });
    });

    describe('useLanguage hook', () => {
        it('should throw error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            expect(() => {
                render(<TestComponent />);
            }).toThrow('useLanguage must be used within a LanguageProvider');

            consoleSpy.mockRestore();
        });

        it('should return correct translation for current language', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('translation')).toHaveTextContent("Ozan Gezen's Finance Blog");
        });
    });

    describe('language switching', () => {
        it('should switch language and save to localStorage', async () => {
            const user = userEvent.setup();

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            // Wait for initial mount
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 0));
            });

            // Switch to Turkish
            await user.click(screen.getByTestId('switch-to-tr'));

            expect(screen.getByTestId('language')).toHaveTextContent('tr');
            expect(localStorage.setItem).toHaveBeenCalledWith('language', 'tr');
        });

        it('should update translations when language changes', async () => {
            const user = userEvent.setup();

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 0));
            });

            // Start with English
            expect(screen.getByTestId('translation')).toHaveTextContent("Ozan Gezen's Finance Blog");

            // Switch to Turkish
            await user.click(screen.getByTestId('switch-to-tr'));

            expect(screen.getByTestId('translation')).toHaveTextContent("Ozan Gezen'in Finans Blogu");
        });
    });
});
