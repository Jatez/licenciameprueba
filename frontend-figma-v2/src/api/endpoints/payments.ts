/**
 * Payments API endpoints — Wompi integration.
 */

import { http } from "@/api/http";

export interface InitiatePaymentResponse {
  checkout_url: string;
  reference: string;
}

/**
 * Initiate a Wompi payment for a given package template.
 * Returns { checkout_url, reference }
 */
export async function initiatePayment(templateId: string): Promise<InitiatePaymentResponse> {
  const { data } = await http.post<InitiatePaymentResponse>("/payments/initiate", {
    package_template_id: templateId,
  });
  return data;
}

/**
 * Download the invoice PDF for a given payment reference.
 * Triggers a file download in the browser.
 */
export async function downloadInvoice(reference: string): Promise<void> {
  const response = await http.get(`/payments/${reference}/invoice`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `factura-${reference}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}
