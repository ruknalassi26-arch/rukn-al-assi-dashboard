// ==============================================================================
// core/utils/toast.ts
// Centralized Toast notification system using Sonner
// Encapsulates toast rendering and automatic error formatting
// ==============================================================================
import { toast as sonnerToast } from "sonner";
import { getFriendlyErrorMessage, translateErrorMessage } from "./error";

const TOAST_DICTIONARY: Record<string, { ar: string; ku: string }> = {
  "Company information updated successfully": {
    ar: "تم تحديث معلومات الشركة بنجاح",
    ku: "زانیارییەکانی کۆمپانیا بە سەرکەوتوویی نوێکرانەوە",
  },
  "Saved successfully": {
    ar: "تم الحفظ بنجاح",
    ku: "بە سەرکەوتوویی پاشەکەوتکرا",
  },
  "Operation Failed": {
    ar: "فشلت العملية",
    ku: "کردارەکە سەرکەوتوو نەبوو",
  },
  "Image uploaded successfully": {
    ar: "تم رفع الصورة بنجاح",
    ku: "وێنەکە بە سەرکەوتوویی بارکرا",
  },
  "Project created successfully": {
    ar: "تم إنشاء المشروع بنجاح",
    ku: "پڕۆژەکە بە سەرکەوتوویی دروستکرا",
  },
  "Project updated successfully": {
    ar: "تم تحديث المشروع بنجاح",
    ku: "پڕۆژەکە بە سەرکەوتوویی نوێکرایەوە",
  },
  "Project deleted successfully": {
    ar: "تم حذف المشروع بنجاح",
    ku: "پڕۆژەکە بە سەرکەوتوویی سڕایەوە",
  },
  "Selected projects deleted successfully": {
    ar: "تم حذف المشاريع المحددة بنجاح",
    ku: "پڕۆژە هەڵبژێردراوەکان بە سەرکەوتوویی سڕانەوە",
  },
  "RFQ request deleted successfully": {
    ar: "تم حذف طلب التسعير بنجاح",
    ku: "داواکاری نرخ بە سەرکەوتوویی سڕایەوە",
  },
  "Team member created successfully": {
    ar: "تم إضافة عضو الفريق بنجاح",
    ku: "ئەندامی تیم بە سەرکەوتوویی زیادکرا",
  },
  "Team member updated successfully": {
    ar: "تم تحديث عضو الفريق بنجاح",
    ku: "ئەندامی تیم بە سەرکەوتوویی نوێکرایەوە",
  },
  "Team member deleted successfully": {
    ar: "تم حذف عضو الفريق بنجاح",
    ku: "ئەندامی تیم بە سەرکەوتوویی سڕایەوە",
  },
  "Website settings updated successfully": {
    ar: "تم تحديث إعدادات الموقع بنجاح",
    ku: "ڕێکخستنەکانی ماڵپەڕ بە سەرکەوتوویی نوێکرانەوە",
  },
  "Service created successfully": {
    ar: "تم إنشاء الخدمة بنجاح",
    ku: "خزمەتگوزاری بە سەرکەوتوویی دروستکرا",
  },
  "Service updated successfully": {
    ar: "تم تحديث الخدمة بنجاح",
    ku: "خزمەتگوزاری بە سەرکەوتوویی نوێکرایەوە",
  },
  "Service deleted successfully": {
    ar: "تم حذف الخدمة بنجاح",
    ku: "خزمەتگوزاری بە سەرکەوتوویی سڕایەوە",
  },
  "Profile updated successfully": {
    ar: "تم تحديث الملف الشخصي بنجاح",
    ku: "پڕۆفایل بە سەرکەوتوویی نوێکرایەوە",
  },
  "Password changed successfully": {
    ar: "تم تغيير كلمة المرور بنجاح",
    ku: "وشەی نهێنی بە سەرکەوتوویی گۆڕدرا",
  },
  "User created successfully! Setup email triggered.": {
    ar: "تم إنشاء المستخدم بنجاح! تم إرسال بريد الإعداد.",
    ku: "بەکارهێنەر بە سەرکەوتوویی دروستکرا! ئیمەیڵی ئامادەکردن نێردرا.",
  },
  "User updated successfully!": {
    ar: "تم تحديث المستخدم بنجاح!",
    ku: "بەکارهێنەر بە سەرکەوتوویی نوێکرایەوە!",
  },
  "Role created successfully!": {
    ar: "تم إنشاء الدور بنجاح!",
    ku: "ڕۆڵ بە سەرکەوتوویی دروستکرا!",
  },
  "Role updated successfully!": {
    ar: "تم تحديث الدور بنجاح!",
    ku: "ڕۆڵ بە سەرکەوتوویی نوێکرایەوە!",
  },
  "Role deleted.": {
    ar: "تم حذف الدور.",
    ku: "ڕۆڵ سڕایەوە.",
  },
  "Product created successfully": {
    ar: "تم إنشاء المنتج بنجاح",
    ku: "بەرهەم بە سەرکەوتوویی دروستکرا",
  },
  "Product updated successfully": {
    ar: "تم تحديث المنتج بنجاح",
    ku: "بەرهەم بە سەرکەوتوویی نوێکرایەوە",
  },
  "Product deleted successfully": {
    ar: "تم حذف المنتج بنجاح",
    ku: "بەرهەم بە سەرکەوتوویی سڕایەوە",
  },
  "All notifications marked as read": {
    ar: "تم تحديد جميع الإشعارات كمقروءة",
    ku: "سەرجەم ئاگادارییەکان وەک خویندراوە نیشانکران",
  },
  "Notification deleted": {
    ar: "تم حذف الإشعار",
    ku: "ئاگادارییەکە سڕایەوە",
  },
  "Hero slide created successfully": {
    ar: "تم إنشاء شريحة الهيرو بنجاح",
    ku: "سلایدی سەرەکی بە سەرکەوتوویی دروستکرا",
  },
  "Hero slide updated successfully": {
    ar: "تم تحديث شريحة الهيرو بنجاح",
    ku: "سلایدی سەرەکی بە سەرکەوتوویی نوێکرایەوە",
  },
  "Hero slide deleted successfully": {
    ar: "تم حذف شريحة الهيرو بنجاح",
    ku: "سلایدی سەرەکی بە سەرکەوتوویی سڕایەوە",
  },
  "Hero slides reordered successfully": {
    ar: "تم إعادة ترتيب شرائح الهيرو بنجاح",
    ku: "ڕیزبەندی سلایدەکان بە سەرکەوتوویی گۆڕدرا",
  },
  "About section updated successfully": {
    ar: "تم تحديث قسم من نحن بنجاح",
    ku: "بەشی دەربارە بە سەرکەوتوویی نوێکرایەوە",
  },
  "Statistic added successfully": {
    ar: "تم إضافة الإحصائية بنجاح",
    ku: "ئامار بە سەرکەوتوویی زیادکرا",
  },
  "Statistic updated successfully": {
    ar: "تم تحديث الإحصائية بنجاح",
    ku: "ئامار بە سەرکەوتوویی نوێکرایەوە",
  },
  "Statistic deleted successfully": {
    ar: "تم حذف الإحصائية بنجاح",
    ku: "ئامار بە سەرکەوتوویی سڕایەوە",
  },
  "Branch created successfully": {
    ar: "تم إنشاء الفرع بنجاح",
    ku: "لقەکە بە سەرکەوتوویی دروستکرا",
  },
  "Branch updated successfully": {
    ar: "تم تحديث الفرع بنجاح",
    ku: "لقەکە بە سەرکەوتوویی نوێکرایەوە",
  },
  "Branch deleted successfully": {
    ar: "تم حذف الفرع بنجاح",
    ku: "لقەکە بە سەرکەوتوویی سڕایەوە",
  },
  "Certificate created successfully": {
    ar: "تم إضافة الشهادة بنجاح",
    ku: "بڕوانامەکە بە سەرکەوتوویی زیادکرا",
  },
  "Certificate updated successfully": {
    ar: "تم تحديث الشهادة بنجاح",
    ku: "بڕوانامەکە بە سەرکەوتوویی نوێکرایەوە",
  },
  "Certificate deleted successfully": {
    ar: "تم حذف الشهادة بنجاح",
    ku: "بڕوانامەکە بە سەرکەوتوویی سڕایەوە",
  },
  "Category created successfully": {
    ar: "تم إنشاء التصنيف بنجاح",
    ku: "پۆلێنەکە بە سەرکەوتوویی دروستکرا",
  },
  "Category updated successfully": {
    ar: "تم تحديث التصنيف بنجاح",
    ku: "پۆلێنەکە بە سەرکەوتوویی نوێکرایەوە",
  },
  "Category deleted successfully": {
    ar: "تم حذف التصنيف بنجاح",
    ku: "پۆلێنەکە بە سەرکەوتوویی سڕایەوە",
  },
};

function translateToastMessage(msg: string): string {
  if (typeof window === "undefined") return msg;
  const lang = document.documentElement.lang || "en";
  if (lang === "ar") {
    if (TOAST_DICTIONARY[msg]?.ar) return TOAST_DICTIONARY[msg].ar;
    return translateErrorMessage(msg, "ar");
  }
  if (lang === "ku" || lang === "ckb") {
    if (TOAST_DICTIONARY[msg]?.ku) return TOAST_DICTIONARY[msg].ku;
    return translateErrorMessage(msg, "ckb");
  }
  return translateErrorMessage(msg, "en");
}

export const toast = {
  /** Display a success toast message */
  success(message: string, description?: string) {
    return sonnerToast.success(translateToastMessage(message), {
      description: description ? translateToastMessage(description) : undefined,
      duration: 4000,
    });
  },

  /** Display an error toast with user-friendly formatting */
  error(error: unknown, fallbackMessage?: string) {
    let translatedMessage: string;
    if (typeof error === "string") {
      translatedMessage = translateToastMessage(error);
    } else if (error instanceof Error) {
      translatedMessage = translateToastMessage(error.message);
    } else {
      const rawUserMessage = getFriendlyErrorMessage(error, "ToastNotification");
      translatedMessage = translateToastMessage(rawUserMessage);
    }

    if (fallbackMessage) {
      return sonnerToast.error(translateToastMessage(fallbackMessage), {
        description: translatedMessage,
        duration: 5000,
      });
    }

    return sonnerToast.error(translatedMessage, {
      duration: 5000,
    });
  },

  /** Display an informational toast */
  info(message: string, description?: string) {
    return sonnerToast.info(translateToastMessage(message), {
      description: description ? translateToastMessage(description) : undefined,
      duration: 4000,
    });
  },

  /** Display a warning toast */
  warning(message: string, description?: string) {
    return sonnerToast.warning(translateToastMessage(message), {
      description: description ? translateToastMessage(description) : undefined,
      duration: 4500,
    });
  },

  /** Wrap an async promise with pending, success, and error toast states */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) {
    return sonnerToast.promise(promise, {
      loading: translateToastMessage(messages.loading),
      success: (data) => {
        const res = typeof messages.success === "function" ? messages.success(data) : messages.success;
        return translateToastMessage(res);
      },
      error: (err) => {
        if (typeof messages.error === "function") {
          return messages.error(err);
        }
        return translateToastMessage(getFriendlyErrorMessage(err, "ToastPromise"));
      },
    });
  },

  /** Dismiss a specific toast or all toasts */
  dismiss(toastId?: string | number) {
    sonnerToast.dismiss(toastId);
  },
};
