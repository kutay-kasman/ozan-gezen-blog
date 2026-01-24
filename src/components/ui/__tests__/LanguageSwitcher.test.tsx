import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { LanguageProvider } from '@/lib/LanguageContext';

// Wrapper to provide language context
const renderWithProvider = (component: React.ReactNode) => {
    return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('LanguageSwitcher', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (localStorage.getItem as jest.Mock).mockReturnValue(null);
    });

    describe('rendering', () => {
        it('should render the language switcher button', () => {
            renderWithProvider(<LanguageSwitcher />);

            // Should show EN by default (hidden on small screens, visible on sm+)
            expect(screen.getByText('EN')).toBeInTheDocument();
        });

        it('should render dropdown options', () => {
            renderWithProvider(<LanguageSwitcher />);

            expect(screen.getByText('English')).toBeInTheDocument();
            expect(screen.getByText('Türkçe')).toBeInTheDocument();
        });
    });

    describe('language switching', () => {
        it('should switch to Turkish when TR button is clicked', async () => {
            const user = userEvent.setup();
            renderWithProvider(<LanguageSwitcher />);

            // Click on Türkçe option
            await user.click(screen.getByText('Türkçe'));

            // Should now show TR
            expect(screen.getByText('TR')).toBeInTheDocument();
            expect(localStorage.setItem).toHaveBeenCalledWith('language', 'tr');
        });

        it('should switch to English when EN button is clicked', async () => {
            const user = userEvent.setup();
            (localStorage.getItem as jest.Mock).mockReturnValue('tr');

            renderWithProvider(<LanguageSwitcher />);

            // Click on English option
            await user.click(screen.getByText('English'));

            expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
        });
    });

    describe('accessibility', () => {
        it('should have interactive buttons', () => {
            renderWithProvider(<LanguageSwitcher />);

            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
