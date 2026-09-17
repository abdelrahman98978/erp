/**
 * KHALID GROUP ERP — MUSANED LIFECYCLE & WORKFLOW ENGINE
 * Blueprint: scripts/extracted_v2_plan.txt & Saudi Domestic Worker Recruitment Regulations
 * Handles End-to-End Recruitment Workflow, Official Musaned Stages, Legal Refund Calculators, and Webhooks.
 */

export type MusanedContractStage =
  | 'new_order'                 // طلب استقدام جديد
  | 'candidate_selected'        // تم اختيار السيرة الذاتية
  | 'musaned_contract_issued'   // تم إنشاء العقد على مساند وبانتظار السداد
  | 'client_paid'               // سداد العميل الموثق عبر وسيط مساند
  | 'agency_delegated'          // تفويض المكتب الخارجي (إنجاز / MOFA)
  | 'medical_passed'            // اجتياز الفحص الطبي للعمالة
  | 'visa_stamped'              // تفييز الجواز من السفارة السعودية
  | 'flight_booked'             // إصدار تذكرة الطيران وتحديد موعد الوصول
  | 'airport_arrived'           // وصول مطار المملكة والاستقبال الميداني
  | 'probation_active'          // سريان فترة التجربة النظامية (90 يوماً)
  | 'completed'                 // اكتمال العقد بنجاح
  | 'disputed'                  // نزاع أو شكوى مرفوعة
  | 'cancelled_refund_pending'  // ملغي وبانتظار التسوية والاسترداد
  | 'cancelled_refunded';       // تم الإلغاء ورد المستحقات

export interface MusanedContractMetadata {
  musanedContractNumber: string;
  visaNumber: string;
  workerPassport: string;
  workerName: string;
  clientNationalId: string;
  clientName: string;
  companyId: string;
  recruitmentFee: number; // المبلغ الإجمالي
  vatAmount: number;      // الضريبة 15%
  insuranceFee?: number;  // وثيقة التأمين على العقد
  signedDate: string;     // تاريخ توقيع العقد
  maxSlaDays: number;     // الحد الأقصى للاستقدام (90 يوماً)
  daysElapsed: number;
}

export interface RefundCalculationResult {
  eligibleForRefund: boolean;
  totalPaid: number;
  adminFeeDeduction: number;
  externalCostsDeduction: number;
  netRefundAmount: number;
  refundPercentage: number;
  legalReasonAr: string;
  requiresAccountingApproval: boolean;
}

export interface MusanedWebhookPayload {
  eventId: string;
  eventType: 
    | 'CONTRACT_CREATED'
    | 'PAYMENT_RECEIVED'
    | 'DELEGATION_COMPLETED'
    | 'VISA_ISSUED'
    | 'FLIGHT_CONFIRMED'
    | 'WORKER_ARRIVED'
    | 'COMPLAINT_OPENED'
    | 'CONTRACT_CANCELLED';
  musanedContractNumber: string;
  timestamp: string;
  details: Record<string, any>;
}

class MusanedLifecycleEngine {
  /**
   * Calculates legal refund according to Ministry of Human Resources (MHRSD) rules
   */
  public calculateLegalRefund(
    meta: MusanedContractMetadata,
    cancellationParty: 'client' | 'office' | 'worker_refusal',
    cancelReason: string
  ): RefundCalculationResult {
    const total = meta.recruitmentFee;

    // 1. Office fault or worker medical failure / refusal abroad
    if (cancellationParty === 'office' || cancellationParty === 'worker_refusal') {
      return {
        eligibleForRefund: true,
        totalPaid: total,
        adminFeeDeduction: 0,
        externalCostsDeduction: 0,
        netRefundAmount: total,
        refundPercentage: 100,
        legalReasonAr: 'استرداد كامل بنسبة 100% لعدم التزام المكتب أو رفض/عدم لياقة العاملة في بلد الإرسال.',
        requiresAccountingApproval: true,
      };
    }

    // 2. Client cancellation
    if (meta.daysElapsed <= 5) {
      // Within cooling off period (typically 5 days after contract creation)
      return {
        eligibleForRefund: true,
        totalPaid: total,
        adminFeeDeduction: 0,
        externalCostsDeduction: 0,
        netRefundAmount: total,
        refundPercentage: 100,
        legalReasonAr: 'إلغاء خلال مهلة التراجع النظامية الأولى (استرداد كامل دون استقطاع).',
        requiresAccountingApproval: true,
      };
    }

    if (meta.daysElapsed <= 30) {
      // Within 30 days of contract
      const deduction = total * 0.05; // 5% legal administrative deduction
      return {
        eligibleForRefund: true,
        totalPaid: total,
        adminFeeDeduction: deduction,
        externalCostsDeduction: 0,
        netRefundAmount: total - deduction,
        refundPercentage: 95,
        legalReasonAr: 'إلغاء برغبة العميل خلال أول 30 يوماً (استقطاع مصاريف إدارية بنسبة 5% كحد أقصى).',
        requiresAccountingApproval: true,
      };
    }

    // After 30 days and before arrival
    if (meta.daysElapsed > 30 && meta.daysElapsed <= meta.maxSlaDays) {
      const deduction = total * 0.20; // Up to 20% legal recovery if visas/delegations processed
      return {
        eligibleForRefund: true,
        totalPaid: total,
        adminFeeDeduction: deduction,
        externalCostsDeduction: meta.insuranceFee || 500,
        netRefundAmount: Math.max(0, total - deduction - (meta.insuranceFee || 500)),
        refundPercentage: 80,
        legalReasonAr: 'إلغاء برغبة العميل بعد مرور 30 يوماً من العقد وبعد تفويض الوكالة والتفييز.',
        requiresAccountingApproval: true,
      };
    }

    // Delayed beyond SLA
    if (meta.daysElapsed > meta.maxSlaDays) {
      return {
        eligibleForRefund: true,
        totalPaid: total,
        adminFeeDeduction: 0,
        externalCostsDeduction: 0,
        netRefundAmount: total,
        refundPercentage: 100,
        legalReasonAr: 'تجاوز المدة القصوى المحددة للاستقدام (90 يوماً) يحق للعميل استرداد كامل المبلغ مع التعويض.',
        requiresAccountingApproval: true,
      };
    }

    return {
      eligibleForRefund: false,
      totalPaid: total,
      adminFeeDeduction: 0,
      externalCostsDeduction: 0,
      netRefundAmount: 0,
      refundPercentage: 0,
      legalReasonAr: `لا يمكن حساب الاسترداد آلياً: ${cancelReason}`,
      requiresAccountingApproval: true,
    };
  }

  /**
   * Processes an incoming verified Webhook from Musaned
   */
  public processMusanedWebhook(payload: MusanedWebhookPayload): {
    nextStage: MusanedContractStage;
    auditAction: string;
    notificationTitle: string;
    notificationBody: string;
  } {
    switch (payload.eventType) {
      case 'CONTRACT_CREATED':
        return {
          nextStage: 'musaned_contract_issued',
          auditAction: 'MUSANED_CONTRACT_GENERATED',
          notificationTitle: 'عقد مساند جديد',
          notificationBody: `تم إنشاء عقد مساند رقم ${payload.musanedContractNumber} وبانتظار سداد العميل.`,
        };
      case 'PAYMENT_RECEIVED':
        return {
          nextStage: 'client_paid',
          auditAction: 'MUSANED_PAYMENT_CAPTURED',
          notificationTitle: 'سداد رسوم الاستقدام',
          notificationBody: `تم تأكيد سداد العقد رقم ${payload.musanedContractNumber} عبر محفظة مساند.`,
        };
      case 'DELEGATION_COMPLETED':
        return {
          nextStage: 'agency_delegated',
          auditAction: 'MOFA_DELEGATION_APPROVED',
          notificationTitle: 'اكتمال التفويض الإلكتروني',
          notificationBody: `تم ربط التفويض بالوكالة الخارجية بنجاح على منصة إنجاز.`,
        };
      case 'VISA_ISSUED':
        return {
          nextStage: 'visa_stamped',
          auditAction: 'VISA_STAMPED_EMBASSY',
          notificationTitle: 'صدور التأشيرة والتفييز',
          notificationBody: `تم تفييز الجواز للعمالة في السفارة السعودية بالخارج.`,
        };
      case 'FLIGHT_CONFIRMED':
        return {
          nextStage: 'flight_booked',
          auditAction: 'FLIGHT_TICKET_ISSUED',
          notificationTitle: 'حجز تذكرة السفر',
          notificationBody: `تم تأكيد موعد وصول الرحلة إلى مطار المملكة.`,
        };
      case 'WORKER_ARRIVED':
        return {
          nextStage: 'airport_arrived',
          auditAction: 'WORKER_AIRPORT_RECEPTION',
          notificationTitle: 'وصول العمالة إلى المطار',
          notificationBody: `وصلت العمالة وتم الاستقبال ونقلها إلى دار الإيواء / تسليمها للعميل.`,
        };
      case 'COMPLAINT_OPENED':
        return {
          nextStage: 'disputed',
          auditAction: 'MUSANED_DISPUTE_INITIATED',
          notificationTitle: 'شكوى جديدة على مساند',
          notificationBody: `وردت شكوى عبر منصة مساند للعقد ${payload.musanedContractNumber}.`,
        };
      case 'CONTRACT_CANCELLED':
        return {
          nextStage: 'cancelled_refund_pending',
          auditAction: 'MUSANED_CONTRACT_CANCELLED',
          notificationTitle: 'إلغاء عقد مساند',
          notificationBody: `تم إلغاء العقد وتحويل الملف إلى قسم المالية لإصدار إشعار دائن وتسوية الاسترداد.`,
        };
      default:
        return {
          nextStage: 'new_order',
          auditAction: 'UNKNOWN_MUSANED_EVENT',
          notificationTitle: 'إشعار مساند',
          notificationBody: `تحديث من منصة مساند للعقد ${payload.musanedContractNumber}`,
        };
    }
  }
}

export const musanedLifecycleEngine = new MusanedLifecycleEngine();
