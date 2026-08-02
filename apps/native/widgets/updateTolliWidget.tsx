import { isStudyCompletedToday } from "../utils/studyStatus";
import { requestWidgetUpdate } from "react-native-android-widget";
import { AndroidImageWidget } from "./AndroidImageWidget";

export async function updateTolliWidget() {
  const completed = await isStudyCompletedToday();
  requestWidgetUpdate({
    widgetName: "AndroidImage",
    renderWidget: () => <AndroidImageWidget completed={completed} />,
  });
}
