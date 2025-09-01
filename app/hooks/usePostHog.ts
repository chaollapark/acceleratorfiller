import { usePostHog } from 'posthog-js/react'

export function useAnalytics() {
  const posthog = usePostHog()

  const trackButtonClick = (buttonName: string, properties?: Record<string, any>) => {
    posthog?.capture('button_clicked', {
      button_name: buttonName,
      ...properties
    })
  }

  const trackFormSubmit = (formName: string, properties?: Record<string, any>) => {
    posthog?.capture('form_submitted', {
      form_name: formName,
      ...properties
    })
  }

  const trackFileUpload = (fileType: string, fileSize: number, fileName: string) => {
    posthog?.capture('file_uploaded', {
      file_type: fileType,
      file_size_mb: Math.round(fileSize / 1024 / 1024 * 100) / 100,
      file_name: fileName
    })
  }

  const trackCheckoutStart = (tier: string, price: number, hasUpload: boolean) => {
    posthog?.capture('checkout_started', {
      tier,
      price,
      has_upload: hasUpload
    })
  }

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    posthog?.capture('page_viewed', {
      page_name: pageName,
      ...properties
    })
  }

  return {
    trackButtonClick,
    trackFormSubmit,
    trackFileUpload,
    trackCheckoutStart,
    trackPageView
  }
}
