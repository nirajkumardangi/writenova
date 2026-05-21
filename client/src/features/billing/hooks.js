import { useState } from "react";
import { checkoutSession } from "./api";

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await checkoutSession();
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}
