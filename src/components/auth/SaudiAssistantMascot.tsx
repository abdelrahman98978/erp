import React from 'react';
import { SystemPortalOption } from '../../pages/LoginPage';

interface SaudiAssistantMascotProps {
  selectedPortal: SystemPortalOption;
  isRtl?: boolean;
}

const getPortalGreeting = (portalId: string, nameAr: string): { title: string; desc: string; badge: string } => {
  switch (portalId) {
    case 'kas':
      return {
        title: 'مرحباً بك في بوابة شركة كاس!',
        desc: 'منظومة المنافسات وجداول الكميات الذكية BOQ وسحابة اعتماد معزولة كلياً ومحمية بأعلى معايير الحوكمة.',
        badge: 'بيئة عمل معزولة 100%'
      };
    case 'shelter':
      return {
        title: 'أهلاً بك في بوابة مراكز الإيواء!',
        desc: 'نظام إدارة وتسكين الكوادر والنزيلات مع التتبع الصحي والغذائي والامتثال الكامل لوزارة الموارد البشرية HRSD.',
        badge: 'ترخيص HRSD معتمد'
      };
    case 'saf':
      return {
        title: 'أهلاً بك في شركة الصفا الماسي!',
        desc: 'بوابة عقود استقدام الأفراد، إصدار التأشيرات الفورية، الربط مع منصة مساند، وبوالص التأمين الشاملة.',
        badge: 'ترخيص مساند RC01'
      };
    case 'yaq':
      return {
        title: 'مرحباً بك في شركة الياقوت الشرقية!',
        desc: 'بوابة عقود التأجير والتشغيل المرن للكوادر المهنية والعمالة المنزلية وخدمات قطاع الأعمال.',
        badge: 'ترخيص مساند RC02'
      };
    case 'top':
      return {
        title: 'مرحباً بك في توب تالنت الدولية!',
        desc: 'المنظومة الذكية لفرز وإدارة السير الذاتية ATS والربط المباشر مع شبكة وكالات التوظيف المعتمدة عالمياً.',
        badge: 'نظام ATS المتقدم'
      };
    case 'client':
      return {
        title: 'مرحباً بك في بوابة الخدمة الذاتية!',
        desc: 'يمكنك متابعة حالة طلباتك وعقود الاستقدام والرحلات وسداد الفواتير المشفرة ZATCA بسهولة وأمان.',
        badge: 'خدمة المستفيدين 24/7'
      };
    case 'agent':
      return {
        title: 'أهلاً بشركائنا الدوليين والوكلاء!',
        desc: 'بوابة رفع السير الذاتية بالدفعة وتفييز إنجاز ومطابقة الحسابات المالية اللحظية عبر القنوات الآمنة.',
        badge: 'بوابة الشركاء المعتمدين'
      };
    case 'ecommerce':
      return {
        title: 'مرحباً بك في بوابة المتاجر الإلكترونية!',
        desc: 'إدارة وتزامن المبيعات وقنوات الدفع الإلكتروني وربط منصات سلة وزد وشوبيفاي مع أنظمة SMACC.',
        badge: 'تزامن Webhook فوري'
      };
    case 'admin':
      return {
        title: 'مرحباً بك في مركز القيادة والسيطرة!',
        desc: 'لوحة التحكم الفائق والحوكمة المركزية الشاملة لكافة شركات المجموعة والرقابة على العمليات المالية والـ IAM.',
        badge: 'صلاحيات الإدارة العليا'
      };
    default:
      return {
        title: `أهلاً بك في ${nameAr}!`,
        desc: 'أنا "فارس"، مرشدك الرقمي الذكي لمجموعة خالد السليم ERP. أدخل بياناتك أو استعن بي لتوجيهك المباشر.',
        badge: 'المرشد الرقمي المعتمد'
      };
  }
};

export const SaudiAssistantMascot: React.FC<SaudiAssistantMascotProps> = ({
  selectedPortal,
  isRtl = true
}) => {
  const greeting = getPortalGreeting(selectedPortal.id, selectedPortal.nameAr);

  const handleOpenChat = () => {
    window.dispatchEvent(
      new CustomEvent('open-faris-assistant', {
        detail: {
          query: `مرحباً فارس، أحتاج مساعدة في الدخول إلى ${selectedPortal.nameAr}`
        }
      })
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-end select-none pointer-events-auto">
      {/* Speech Bubble / Dynamic Greeting Card */}
      <div 
        key={selectedPortal.id}
        className="speech-bubble-anim relative z-30 max-w-[320px] mb-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200 shadow-xl text-right cursor-pointer hover:border-amber-400 transition-colors"
        style={{
          boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)'
        }}
        onClick={handleOpenChat}
      >
        {/* Pointer Triangle */}
        <div 
          className="absolute -bottom-2 w-3.5 h-3.5 bg-white border-b border-l border-zinc-200 rotate-[-45deg]"
          style={{
            [isRtl ? 'right' : 'left']: '48px',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.03)'
          }}
        />

        {/* Header with Live Status Dot */}
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-zinc-100">
          <div className="flex items-center gap-1.5">
            <span className="live-pulse-dot" />
            <span className="text-[11px] font-extrabold text-zinc-900 flex items-center gap-1">
              <span>فارس • المرشد الرقمي</span>
            </span>
          </div>

          <span 
            className="text-[9.5px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
            style={{ background: selectedPortal.themeColor }}
          >
            {greeting.badge}
          </span>
        </div>

        {/* Greeting Title */}
        <h4 className="text-[13px] font-bold text-zinc-900 mb-1 leading-snug">
          {greeting.title}
        </h4>

        {/* Greeting Description */}
        <p className="text-[11px] text-zinc-600 leading-relaxed m-0">
          {greeting.desc}
        </p>

        {/* Interactive Chat Prompt Button */}
        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10.5px]">
          <span className="font-bold text-amber-700 flex items-center gap-1">
            <span>تحدث مع فارس</span>
            <span>←</span>
          </span>
          <span className="text-zinc-400">انقر للبدء</span>
        </div>
      </div>

      {/* 3D Mascot Character with Smooth Float and Ground Shadow */}
      <div 
        className="relative z-20 flex flex-col items-center cursor-pointer group"
        onClick={handleOpenChat}
        title="انقر للتحدث مع فارس"
      >
        <div className="mascot-float relative transition-transform group-hover:scale-105">
          <img
            src="/mascot.png"
            alt="فارس - المرشد الرقمي الذكي لمجموعة خالد السليم"
            className="w-auto h-[360px] sm:h-[400px] lg:h-[430px] object-contain drop-shadow-xl"
            loading="eager"
            decoding="async"
            style={{
              filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.18))',
              transform: isRtl ? 'none' : 'scaleX(-1)'
            }}
          />
        </div>

        {/* Soft Ambient Ground Shadow */}
        <div 
          className="mascot-shadow w-44 h-4 rounded-full -mt-2.5"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.08) 55%, transparent 75%)'
          }}
        />
      </div>
    </div>
  );
};
