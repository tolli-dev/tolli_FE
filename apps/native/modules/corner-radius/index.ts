import { requireNativeModule } from "expo-modules-core";

const CornerRadius = requireNativeModule("CornerRadius");

export function getCornerRadius(): Promise<number> {
  return CornerRadius.getCornerRadius();
}
