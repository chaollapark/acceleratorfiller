"use client";

import { usePostHog } from "posthog-js/react";

type Props = Record<string, any>;

export function useAnalytics() {
  const posthog = usePostHog();

  const safeCapture = (event: string, properties?: Props) => {
    if (posthog) {
      posthog.capture(event, properties);
    } else if (process.env.NODE_ENV !== "production") {
      // Fallback stub in dev if PostHog isn't wired up yet
      // (saves you from runtime errors while you procrastinate setup)
      console.log(`[Analytics] ${event}`, properties);
    }
  };

  const trackButtonClick = (buttonName: string, properties?: Props) =>
    safeCapture("button_clicked", { button_name: buttonName, ...properties });

  const trackFormSubmit = (formName: string, properties?: Props) =>
    safeCapture("form_submitted", { form_name: formName, ...properties });

  const trackFileUpload = (fileType: string, fileSize: number, fileName: string) =>
    safeCapture("file_uploaded", {
      file_type: fileType,
      file_size_mb: Math.round((fileSize / 1024 / 1024) * 100) / 100,
      file_name: fileName,
    });

  const trackCheckoutStart = (tier: string, price: number, hasUpload: boolean) =>
    safeCapture("checkout_started", { tier, price, has_upload: hasUpload });

  const trackPageView = (pageName: string, properties?: Props) =>
    safeCapture("page_viewed", { page_name: pageName, ...properties });

  return {
    trackButtonClick,
    trackFormSubmit,
    trackFileUpload,
    trackCheckoutStart,
    trackPageView,
  };
}
