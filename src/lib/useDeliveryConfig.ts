"use client";

import { useEffect, useState } from "react";

export type DeliveryConfig = { deliveryFee: number; freeDeliveryOver: number };

// Code-level defaults; overridden by the admin-set values from /api/delivery-config.
export const DEFAULT_DELIVERY: DeliveryConfig = { deliveryFee: 2.49, freeDeliveryOver: 20 };

/** Reads the admin-configured delivery rule (Finance → Taxes & Delivery Fees). */
export function useDeliveryConfig(): DeliveryConfig {
  const [config, setConfig] = useState<DeliveryConfig>(DEFAULT_DELIVERY);

  useEffect(() => {
    let active = true;
    fetch("/api/delivery-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data && typeof data.deliveryFee === "number") setConfig(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return config;
}
