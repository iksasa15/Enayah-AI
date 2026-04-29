import SwiftUI
#if canImport(UIKit) && os(iOS)
import UIKit
#endif

/// خط التطبيق المعتمد: **IBM Plex Sans Arabic**.
/// ملفات الـ TTF تُنسخ إلى **جذر** حزمة التطبيق؛ `FontInfo.plist` يسجّل أسماء الملفات فقط (مثل `IBMPlexSansArabic-Regular.ttf`).
enum AppFont {

    /// `false` يعيد كل النصوص لخط النظام عبر `AppTheme.Typography`.
    static let isEnabled: Bool = true

    static let adoptedDisplayName = "IBM Plex Sans Arabic"

    /// أسماء PostScript كما تظهر في الملفات (لـ `Font.custom(_:size:)`).
    enum PlexSansArabic {
        static let thin = "IBMPlexSansArabic-Thin"
        static let extraLight = "IBMPlexSansArabic-ExtraLight"
        static let light = "IBMPlexSansArabic-Light"
        static let regular = "IBMPlexSansArabic-Regular"
        static let medium = "IBMPlexSansArabic-Medium"
        static let semibold = "IBMPlexSansArabic-SemiBold"
        static let bold = "IBMPlexSansArabic-Bold"
    }

    static func postScriptName(for weight: Font.Weight) -> String {
        switch weight {
        case .ultraLight: return PlexSansArabic.extraLight
        case .thin: return PlexSansArabic.thin
        case .light: return PlexSansArabic.light
        case .regular: return PlexSansArabic.regular
        case .medium: return PlexSansArabic.medium
        case .semibold: return PlexSansArabic.semibold
        case .bold: return PlexSansArabic.bold
        case .heavy, .black: return PlexSansArabic.bold
        default: return PlexSansArabic.regular
        }
    }

    #if canImport(UIKit) && os(iOS)
    /// عناوين `NavigationStack` وواجهات UIKit التي لا تمر عبر SwiftUI `.font`.
    static func configureUIKitChromeIfNeeded() {
        guard isEnabled else { return }
        let titleFont = UIFont(name: PlexSansArabic.semibold, size: 17)
            ?? .systemFont(ofSize: 17, weight: .semibold)
        let largeFont = UIFont(name: PlexSansArabic.bold, size: 34)
            ?? .systemFont(ofSize: 34, weight: .bold)
        let nav = UINavigationBar.appearance()
        nav.titleTextAttributes = [.font: titleFont]
        nav.largeTitleTextAttributes = [.font: largeFont]
    }
    #endif
}
