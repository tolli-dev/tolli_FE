import { isStudyCompletedToday } from "../utils/studyStatus";
import { requestWidgetUpdate } from "react-native-android-widget";
import { AndroidImageWidget } from "./AndroidImageWidget";
import { getTolliImageSize } from "./getTolliImageSize";

export async function updateTolliWidget() {
  const completed = await isStudyCompletedToday();
  await requestWidgetUpdate({
    widgetName: "AndroidImage",
    renderWidget: ({ width, height }) => (
      <AndroidImageWidget
        completed={completed}
        imageSize={getTolliImageSize(width, height)}
      />
    ),
  });
}
