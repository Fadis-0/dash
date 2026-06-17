import React from "react";
import logoImage from "../splash-logo.jpeg";
import {
  Download,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  MessageSquare,
  CheckCircle,
  ChevronRight
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-tk-background font-body" dir="rtl">
      {/* Navigation Bar */}
      <nav className="bg-white border-b-2 border-tk-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-row">
          <button
            onClick={onLoginClick}
            className="px-6 py-2.5 bg-tk-blue border-2 border-tk-blueDark text-white font-bold text-sm rounded-xl button-neo shadow-neoBlue flex items-center gap-2 hover:translate-y-[-2px] transition-transform"
          >
            <span>تسجيل الدخول</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-tk-green flex items-center justify-center overflow-hidden">
              <img src={logoImage} className="w-full h-full object-cover" alt="Talky Kids Logo" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-tk-text leading-tight">Talky Kids</h1>
              <p className="text-xs text-tk-textSecondary font-semibold">منصة الكلام واللغة للأطفال</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-right order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-tk-greenLight border border-tk-green rounded-full text-tk-greenDark text-sm font-bold">
                  🎉 منصة متكاملة لتطوير مهارات النطق والتخاطب
                </div>
                <h2 className="text-5xl md:text-6xl font-display font-bold text-tk-text leading-tight">
                  حسّن مهارات <span className="text-tk-green">اللغة</span> للأطفال
                </h2>
                <p className="text-lg text-tk-textSecondary font-medium leading-relaxed">
                  Talky Kids هي منصة شاملة تجمع بين الألعاب التعليمية الممتعة والتتبع الاحترافي لتطور الأطفال. 
                  موجهة للأخصائيين والمعالجين لسهولة متابعة تقدم كل طفل.
                </p>
              </div>

              <button
                onClick={onLoginClick}
                className="px-8 py-4 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-base rounded-xl button-neo shadow-neoGreen flex items-center gap-3 hover:translate-y-[-2px] transition-transform w-fit"
              >
                <span>ابدأ الآن - تسجيل الدخول</span>
                <ChevronRight size={20} className="rotate-180" />
              </button>

              <a
                href="https://play.google.com/store/apps/details?id=com.talkykids"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-tk-blue border-2 border-tk-blueDark text-white font-bold text-base rounded-xl button-neo shadow-neoBlue flex items-center gap-3 hover:translate-y-[-2px] transition-transform w-fit"
              >
                <Download size={20} />
                <span>حمّل التطبيق الآن</span>
              </a>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-tk-green flex-shrink-0" size={20} />
                  <span className="text-sm font-semibold text-tk-text">تتبع تقدم شامل</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-tk-green flex-shrink-0" size={20} />
                  <span className="text-sm font-semibold text-tk-text">تحليلات متقدمة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-tk-green flex-shrink-0" size={20} />
                  <span className="text-sm font-semibold text-tk-text">ألعاب تفاعلية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-tk-green flex-shrink-0" size={20} />
                  <span className="text-sm font-semibold text-tk-text">سهل الاستخدام</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-full order-1 lg:order-2 flex items-center justify-center">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-tk-greenLight via-tk-blueLight to-tk-purpleLight rounded-3xl opacity-40"></div>
                <div className="absolute inset-8 bg-white border-3 border-tk-green rounded-3xl shadow-neo flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Sparkles className="text-tk-orange mx-auto animate-bounce" size={48} />
                    <h3 className="text-2xl font-display font-bold text-tk-text">منصة Talky Kids</h3>
                    <p className="text-tk-textSecondary font-semibold text-sm">
                      متابعة تقدم الأطفال بسهولة وفعالية
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-tk-greenLight text-tk-greenDark rounded-full text-xs font-bold">لعبة الحروف</span>
                      <span className="px-3 py-1 bg-tk-blueLight text-tk-blue rounded-full text-xs font-bold">التنفس</span>
                      <span className="px-3 py-1 bg-tk-orangeLight text-tk-orange rounded-full text-xs font-bold">الألوان</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y-2 border-tk-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-tk-text">
              المميزات الرئيسية
            </h2>
            <p className="text-lg text-tk-textSecondary max-w-2xl mx-auto">
              منصة متكاملة توفر كل ما تحتاجه لإدارة وتتبع تطور الأطفال بكفاءة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-blue">
              <div className="w-14 h-14 rounded-xl bg-tk-blueLight text-tk-blue flex items-center justify-center mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">إدارة سهلة للمرضى</h3>
              <p className="text-tk-textSecondary font-medium">
                أضف وأدير الأطفال بسهولة، وتابع تقدمهم في الوقت الفعلي مع إمكانية ربط أولياء الأمور
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-green">
              <div className="w-14 h-14 rounded-xl bg-tk-greenLight text-tk-green flex items-center justify-center mb-4">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">تحليلات متقدمة</h3>
              <p className="text-tk-textSecondary font-medium">
                احصل على رؤى معمقة عن تقدم كل طفل مع رسوم بيانية شاملة وتقارير مفصلة
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-orange">
              <div className="w-14 h-14 rounded-xl bg-tk-orangeLight text-tk-orange flex items-center justify-center mb-4">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">تصحيح التمارين</h3>
              <p className="text-tk-textSecondary font-medium">
                استمع للتسجيلات الصوتية للأطفال وقدم تصحيحات فورية لتحسين أدائهم
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-purple">
              <div className="w-14 h-14 rounded-xl bg-tk-purpleLight text-tk-purple flex items-center justify-center mb-4">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">تقارير شاملة</h3>
              <p className="text-tk-textSecondary font-medium">
                استخرج تقارير مفصلة عن تقدم المرضى لمشاركتها مع الأهالي والمتابعين
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-red">
              <div className="w-14 h-14 rounded-xl bg-tk-redLight text-tk-red flex items-center justify-center mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">آمن وموثوق</h3>
              <p className="text-tk-textSecondary font-medium">
                بيانات محمية بأعلى مستويات الأمان مع نسخ احتياطي تلقائي وتشفير قوي
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-8 shadow-neo hover:shadow-lg transition-shadow hover:border-tk-blue">
              <div className="w-14 h-14 rounded-xl bg-tk-blueLight text-tk-blue flex items-center justify-center mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-tk-text mb-3">تجربة مستخدم ممتازة</h3>
              <p className="text-tk-textSecondary font-medium">
                واجهة سهلة وبديهية مع دعم العربية الكامل، متوافقة مع جميع الأجهزة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-tk-text">
              كيف يعمل النظام؟
            </h2>
            <p className="text-lg text-tk-textSecondary max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للبدء في متابعة تقدم الأطفال
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white border-2 border-tk-border rounded-2xl p-8 shadow-neo text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-tk-greenLight text-tk-green flex items-center justify-center text-3xl font-bold mx-auto border-2 border-tk-green">
                  1
                </div>
                <h3 className="text-xl font-bold text-tk-text">إنشاء الحساب</h3>
                <p className="text-tk-textSecondary font-medium">
                  قم بإنشاء حسابك كأخصائي نطق واملأ بيانات عيادتك
                </p>
              </div>
              <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                <ChevronRight className="text-tk-green rotate-180" size={32} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white border-2 border-tk-border rounded-2xl p-8 shadow-neo text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-tk-blueLight text-tk-blue flex items-center justify-center text-3xl font-bold mx-auto border-2 border-tk-blue">
                  2
                </div>
                <h3 className="text-xl font-bold text-tk-text">أضف الأطفال</h3>
                <p className="text-tk-textSecondary font-medium">
                  قم بتسجيل الأطفال وربطهم بحساباتهم أو اتصل بأولياء الأمور
                </p>
              </div>
              <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                <ChevronRight className="text-tk-blue rotate-180" size={32} />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white border-2 border-tk-border rounded-2xl p-8 shadow-neo text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-tk-orangeLight text-tk-orange flex items-center justify-center text-3xl font-bold mx-auto border-2 border-tk-orange">
                  3
                </div>
                <h3 className="text-xl font-bold text-tk-text">ابدأ المتابعة</h3>
                <p className="text-tk-textSecondary font-medium">
                  تابع تقدم الأطفال والتسجيلات الصوتية وقدم التصحيحات
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-white py-20 border-y-2 border-tk-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-tk-greenLight to-tk-blueLight border-2 border-tk-green rounded-3xl p-12 md:p-16 shadow-neo text-center space-y-8">
            <div className="space-y-4">
              <Download className="text-tk-green mx-auto" size={48} />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-tk-text">
                تطبيق Talky Kids
              </h2>
              <p className="text-lg text-tk-textSecondary max-w-2xl mx-auto">
                حمّل تطبيق Talky Kids للأطفال على جهازك الذكي واستمتع بألعاب تعليمية ممتعة 
                لتحسين مهارات الكلام واللغة
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <a
                href="https://play.google.com/store/apps/details?id=com.talkykids"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-tk-green border-2 border-tk-greenDark text-white font-bold rounded-xl button-neo shadow-neoGreen flex items-center gap-2 hover:translate-y-[-2px] transition-transform"
              >
                <Download size={18} />
                <span>تحميل على Android</span>
              </a>
            </div>

            <div className="pt-4 border-t-2 border-tk-green space-y-2 text-sm text-tk-textSecondary font-medium">
              <p>📱 متوافق مع أجهزة Android</p>
              <p>🎮 ألعاب تفاعلية وممتعة للأطفال</p>
              <p>📊 تقدم مراقب وآمن</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-tk-green">+10K</div>
              <p className="text-tk-textSecondary font-medium">طفل مستفيد</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-tk-blue">+500</div>
              <p className="text-tk-textSecondary font-medium">أخصائي نطق</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-tk-orange">4.8★</div>
              <p className="text-tk-textSecondary font-medium">تقييم التطبيق</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-tk-greenLight border-y-2 border-tk-green py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tk-text">
            هل أنت مستعد للبدء؟
          </h2>
          <p className="text-lg text-tk-textSecondary max-w-2xl mx-auto">
            انضم إلى مئات أخصائيي النطق الذين يثقون بـ Talky Kids
          </p>
          <button
            onClick={onLoginClick}
            className="px-8 py-4 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-base rounded-xl button-neo shadow-neoGreen flex items-center gap-3 hover:translate-y-[-2px] transition-transform w-fit mx-auto"
          >
            <span>تسجيل الدخول الآن</span>
            <ChevronRight size={20} className="rotate-180" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-tk-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-tk-green flex items-center justify-center overflow-hidden">
                  <img src={logoImage} className="w-full h-full object-cover" alt="Talky Kids Logo" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-tk-text">Talky Kids</h3>
                  <p className="text-xs text-tk-textSecondary">منصة النطق واللغة</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-tk-text">المنصة</h4>
              <ul className="space-y-2 text-sm text-tk-textSecondary font-medium">
                <li><a href="#" className="hover:text-tk-green">لوحة التحكم</a></li>
                <li><a href="#" className="hover:text-tk-green">المميزات</a></li>
                <li><a href="#" className="hover:text-tk-green">التسعير</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-tk-text">الشركة</h4>
              <ul className="space-y-2 text-sm text-tk-textSecondary font-medium">
                <li><a href="#" className="hover:text-tk-green">من نحن</a></li>
                <li><a href="#" className="hover:text-tk-green">المدونة</a></li>
                <li><a href="#" className="hover:text-tk-green">التواصل</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-tk-text">قانوني</h4>
              <ul className="space-y-2 text-sm text-tk-textSecondary font-medium">
                <li><a href="#" className="hover:text-tk-green">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-tk-green">شروط الخدمة</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-tk-border pt-8 text-center text-sm text-tk-textSecondary font-medium">
            <p>&copy; 2024 Talky Kids. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
