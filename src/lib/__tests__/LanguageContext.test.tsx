import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

function TestComponent() {
    const { language, t } = useLanguage();

    return (
        <div>
            <span data-testid="language">{language}</span>
            <span data-testid="translation">{t('siteName')}</span>
        </div>
    );
}

describe('LanguageContext', () => {
    describe('LanguageProvider', () => {
        it('should render children', () => {
            render(
                <LanguageProvider>
                    <div data-testid="child">test</div>
                </LanguageProvider>
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('should provide Turkish language', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('language')).toHaveTextContent('tr');
        });

        it('should return correct Turkish translations', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('translation')).toHaveTextContent('Ozan Gezen Blog');
        });
    });

    describe('useLanguage hook', () => {
        it('should throw error when used outside LanguageProvider', () => {
            const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
            expect(() => {
                render(<TestComponent />);
            }).toThrow('useLanguage must be used within a LanguageProvider');
            spy.mockRestore();
        });
    });
});
