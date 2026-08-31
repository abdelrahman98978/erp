/**
 * WebAuthn Real Hardware Biometric Service
 * Manages native Touch ID / Face ID / Windows Hello / Android Biometrics
 * for Khalid Al-Sulaim Holding Group ERP.
 */

export interface BiometricAuthResult {
  success: boolean;
  isRealHardware: boolean;
  credentialId?: string;
  authenticatorType?: 'windows-hello' | 'touch-id' | 'face-id' | 'generic-biometric';
  errorMessage?: string;
  canceled?: boolean;
}

/**
 * Check if the browser and operating system support WebAuthn
 */
export const checkWebAuthnSupport = async (): Promise<{ supported: boolean; hasHardware: boolean }> => {
  if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
    return { supported: false, hasHardware: false };
  }

  try {
    const hasHardware = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return { supported: true, hasHardware: Boolean(hasHardware) };
  } catch (error) {
    return { supported: true, hasHardware: false };
  }
};

/**
 * Convert string to Uint8Array buffer
 */
const strToBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

/**
 * Convert ArrayBuffer to Base64
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Trigger Real Hardware Biometric Authentication (Windows Hello / Touch ID / Face ID)
 */
export const performRealBiometricAuth = async (
  username: string,
  systemName: string,
  type: 'fingerprint' | 'face'
): Promise<BiometricAuthResult> => {
  const support = await checkWebAuthnSupport();

  if (!support.supported) {
    return {
      success: false,
      isRealHardware: false,
      errorMessage: 'متصفحك الحالي لا يدعم بروتوكول المصادقة البيومترية WebAuthn.'
    };
  }

  // Generate cryptographically secure random challenge
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  // Hostname check
  const hostname = window.location.hostname || 'localhost';

  // Check if we have an existing registered credential ID for this user/system
  const savedCredKey = `alsulaim_webauthn_cred_${username}_${systemName}`;
  const savedCredId = localStorage.getItem(savedCredKey);

  try {
    if (savedCredId) {
      // Step 1: Try assertion (get existing credential)
      const credIdBytes = Uint8Array.from(atob(savedCredId), c => c.charCodeAt(0));
      
      const getOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge as unknown as BufferSource,
        timeout: 60000,
        rpId: hostname === 'localhost' ? 'localhost' : hostname,
        userVerification: 'preferred',
        allowCredentials: [
          {
            type: 'public-key',
            id: credIdBytes as unknown as BufferSource,
            transports: ['internal']
          }
        ]
      };

      const assertion = await navigator.credentials.get({
        publicKey: getOptions
      }) as PublicKeyCredential;

      if (assertion) {
        return {
          success: true,
          isRealHardware: true,
          credentialId: assertion.id,
          authenticatorType: type === 'fingerprint' ? 'touch-id' : 'face-id'
        };
      }
    }

    // Step 2: If no saved credential or assertion failed, create a new platform credential
    const userId = strToBuffer(username || 'alsulaim_user');
    
    const creationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge as unknown as BufferSource,
      rp: {
        name: `مجموعة خالد السليم ERP - ${systemName}`,
        id: hostname === 'localhost' ? 'localhost' : hostname
      },
      user: {
        id: userId as unknown as BufferSource,
        name: username || 'admin@alsulaim.sa',
        displayName: `${username} (${systemName})`
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false
      },
      timeout: 60000,
      attestation: 'none'
    };

    const newCredential = await navigator.credentials.create({
      publicKey: creationOptions
    }) as PublicKeyCredential;

    if (newCredential) {
      const rawIdB64 = bufferToBase64(newCredential.rawId);
      localStorage.setItem(savedCredKey, rawIdB64);

      return {
        success: true,
        isRealHardware: true,
        credentialId: newCredential.id,
        authenticatorType: type === 'fingerprint' ? 'touch-id' : 'face-id'
      };
    }

    return {
      success: false,
      isRealHardware: true,
      errorMessage: 'لم يتم استلام مصادقة صالحة من الجهاز.'
    };
  } catch (err: any) {
    console.warn('WebAuthn hardware authentication notice:', err);

    // Handle user cancellation specifically
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      return {
        success: false,
        isRealHardware: true,
        canceled: true,
        errorMessage: 'تم إلغاء نافذة المصادقة البيومترية من قبلك على جهازك.'
      };
    }

    if (err.name === 'InvalidStateError') {
      return {
        success: false,
        isRealHardware: true,
        errorMessage: 'جهاز المصادقة البيومترية قيد الاستخدام في جلسة أخرى.'
      };
    }

    return {
      success: false,
      isRealHardware: false,
      errorMessage: err.message || 'تعذر استدعاء مستشعر البصمة على جهازك.'
    };
  }
};
