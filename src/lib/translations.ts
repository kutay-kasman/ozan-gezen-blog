// Translations - Turkish only
export const translations = {
    tr: {
        // Site
        siteName: "Ozan Gezen Blog",
        siteTagline: "Anlamak ve Anlamlandırmak Üzerine",

        // Home Hero
        heroTitle: "",
        heroSubtitle:
            "Bilmek, anlamak ve anlamlandırmak için öğrendiklerimi paylaştığım blog sayfama hoş geldiniz.",

        // Navigation
        navArticles: "Yazılar",
        navAbout: "Hakkında",

        // Posts
        noArticlesTitle: "Henüz yazı yok",
        noArticlesText: "Henüz içerik yok. Yeni yazılar için yakında tekrar uğrayın.",
        readArticle: "Yazıyı oku",

        // Footer
        footerCopy: "Tüm hakları saklıdır.",
        footerMotto: "Görünenden Fazlası",

        // Admin
        adminDashboard: "Yönetici Paneli",
        adminArticles: "Yazılar",
        adminArticlesTotal: "yazı toplamda",
        adminNewArticle: "Yeni Yazı",
        adminNoArticles: "Henüz yazı yok",
        adminCreateFirst: "Başlamak için ilk yazınızı oluşturun.",
        adminCreateArticle: "Yazı Oluştur",
        adminLastEdited: "Son düzenleme",
        adminViewSite: "Siteyi Gör",
        adminSignOut: "Çıkış Yap",

        // Editor
        editorNew: "Yeni Yazı",
        editorEdit: "Yazıyı Düzenle",
        editorPublished: "Yayınlandı",
        editorDraft: "Taslak",
        editorSaveDraft: "Taslak Kaydet",
        editorPublish: "Yayınla",
        editorSaving: "Kaydediliyor...",
        editorDelete: "Sil",
        editorTitlePlaceholder: "Yazı başlığı",
        editorSlugLabel: "URL:",
        editorSlugPlaceholder: "yazi-url",
        editorExcerptLabel: "Özet",
        editorExcerptPlaceholder: "Yazının kısa açıklaması (ana sayfada gösterilir)",
        editorCoverLabel: "Kapak Görseli",
        editorCoverPlaceholder: "https://ornek.com/gorsel.jpg",
        editorUploadImage: "Görsel Yükle",
        editorUploading: "Yükleniyor...",
        editorOrEnterUrl: "veya URL girin:",
        editorContentLabel: "İçerik",
        editorStartWriting: "Yazınızı yazmaya başlayın...",
        editorImagePrompt: "Görsel URL girin:",

        // Login
        loginTitle: "Yönetici Girişi",
        loginSubtitle: "Devam etmek için bilgilerinizi girin",
        loginUsername: "Kullanıcı Adı",
        loginUsernamePlaceholder: "Kullanıcı adı girin",
        loginPassword: "Şifre",
        loginPasswordPlaceholder: "Şifre girin",
        loginButton: "Giriş Yap",
        loginLoading: "Giriş yapılıyor...",
        loginProtected: "Korumalı alan. Yalnızca yetkili personel.",
        loginError: "Geçersiz kimlik bilgileri",

        // Post Page
        backToArticles: "Yazılara dön",
        thanksReading: "Okuduğunuz için teşekkürler.",

        // About
        aboutTitle: "Hakkımda",
        aboutBioPlaceholder: "Kendiniz hakkında bir şeyler yazın...",
        aboutPhotoLabel: "Profil Fotoğrafı",
        aboutSaveSuccess: "Hakkımda bilgisi başarıyla kaydedildi!",
        aboutNoInfo: "Henüz bilgi mevcut değil.",

        // Comments
        commentsTitle: "Yorumlar",
        commentsName: "Adınız",
        commentsNamePlaceholder: "Adınızı girin",
        commentsContent: "Yorumunuz",
        commentsContentPlaceholder: "Yorumunuzu yazın...",
        commentsSubmit: "Yorum Gönder",
        commentsSubmitting: "Gönderiliyor...",
        commentsEmpty: "Henüz yorum yok. İlk yorumu siz yapın!",
    },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.tr;
