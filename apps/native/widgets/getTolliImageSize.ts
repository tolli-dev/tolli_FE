// 위젯 한 변 대비 톨리 이미지가 차지할 비율
// 정사각형 유지
const IMAGE_SIZE_RATIO = 0.7;

export function getTolliImageSize(width: number, height: number): number {
  return Math.floor(Math.min(width, height) * IMAGE_SIZE_RATIO);
}
