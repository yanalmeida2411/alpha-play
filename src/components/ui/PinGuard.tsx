"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clearPinAction } from "@/src/actions/profileAction";

export default function PinGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const isParentArea =
      pathname.includes("/dashboard") || pathname.includes("/settings");

    if (!isParentArea) {
      clearPinAction();
    }
  }, [pathname]);

  return null;
}
