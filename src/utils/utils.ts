export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
