
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

// Create an empty Toaster component that doesn't try to access the non-existent toasts
export function Toaster() {
  return (
    <ToastProvider>
      {/* No toasts are rendered since we removed toast functionality */}
      <ToastViewport />
    </ToastProvider>
  )
}
