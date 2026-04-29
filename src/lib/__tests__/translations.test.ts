import { translations, Language, TranslationKey } from '../translations';

describe('translations', () => {
    describe('structure', () => {
        it('should have tr language', () => {
            expect(translations).toHaveProperty('tr');
        });

        it('should not have empty values in Turkish translations', () => {
            const trEntries = Object.entries(translations.tr);

            trEntries.forEach(([key, value]) => {
                expect(value).toBeTruthy();
                expect(typeof value).toBe('string');
                expect(value.trim().length).toBeGreaterThan(0);
            });
        });
    });

    describe('specific translations', () => {
        it('should have correct site name', () => {
            expect(translations.tr.siteName).toContain('Ozan Gezen');
        });

        it('should have admin-related translations', () => {
            const adminKeys: TranslationKey[] = [
                'adminDashboard',
                'adminArticles',
                'adminNewArticle',
                'adminSignOut',
            ];

            adminKeys.forEach((key) => {
                expect(translations.tr[key]).toBeTruthy();
            });
        });

        it('should have editor-related translations', () => {
            const editorKeys: TranslationKey[] = [
                'editorNew',
                'editorEdit',
                'editorPublished',
                'editorDraft',
                'editorSaveDraft',
                'editorPublish',
            ];

            editorKeys.forEach((key) => {
                expect(translations.tr[key]).toBeTruthy();
            });
        });

        it('should have login-related translations', () => {
            const loginKeys: TranslationKey[] = [
                'loginTitle',
                'loginUsername',
                'loginPassword',
                'loginButton',
                'loginError',
            ];

            loginKeys.forEach((key) => {
                expect(translations.tr[key]).toBeTruthy();
            });
        });
    });

    describe('type exports', () => {
        it('should export Language type correctly', () => {
            const trLang: Language = 'tr';
            expect(trLang).toBe('tr');
        });

        it('should export TranslationKey type correctly', () => {
            const key: TranslationKey = 'siteName';
            expect(translations.tr[key]).toBeTruthy();
        });
    });
});
