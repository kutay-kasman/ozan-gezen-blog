import { translations, Language, TranslationKey } from '../translations';

describe('translations', () => {
    describe('structure', () => {
        it('should have both en and tr languages', () => {
            expect(translations).toHaveProperty('en');
            expect(translations).toHaveProperty('tr');
        });

        it('should have the same keys in both languages', () => {
            const enKeys = Object.keys(translations.en);
            const trKeys = Object.keys(translations.tr);

            expect(enKeys.sort()).toEqual(trKeys.sort());
        });

        it('should not have empty values in English translations', () => {
            const enEntries = Object.entries(translations.en);

            enEntries.forEach(([key, value]) => {
                expect(value).toBeTruthy();
                expect(typeof value).toBe('string');
                expect(value.trim().length).toBeGreaterThan(0);
            });
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
        it('should have correct site name in both languages', () => {
            expect(translations.en.siteName).toContain('Ozan Gezen');
            expect(translations.tr.siteName).toContain('Ozan Gezen');
        });

        it('should have language switch options', () => {
            expect(translations.en.languageEn).toBe('English');
            expect(translations.en.languageTr).toBe('Türkçe');
            expect(translations.tr.languageEn).toBe('English');
            expect(translations.tr.languageTr).toBe('Türkçe');
        });

        it('should have admin-related translations', () => {
            const adminKeys: TranslationKey[] = [
                'adminDashboard',
                'adminArticles',
                'adminNewArticle',
                'adminSignOut',
            ];

            adminKeys.forEach((key) => {
                expect(translations.en[key]).toBeTruthy();
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
                expect(translations.en[key]).toBeTruthy();
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
                expect(translations.en[key]).toBeTruthy();
                expect(translations.tr[key]).toBeTruthy();
            });
        });
    });

    describe('type exports', () => {
        it('should export Language type correctly', () => {
            const enLang: Language = 'en';
            const trLang: Language = 'tr';

            expect(enLang).toBe('en');
            expect(trLang).toBe('tr');
        });

        it('should export TranslationKey type correctly', () => {
            const key: TranslationKey = 'siteName';
            expect(translations.en[key]).toBeTruthy();
        });
    });
});
