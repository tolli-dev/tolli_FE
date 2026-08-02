import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { AndroidImageWidget } from "./AndroidImageWidget";
import { isStudyCompletedToday } from "../utils/studyStatus";

const nameToWidget = {
  AndroidImage: AndroidImageWidget,
};

export async function androidWidgetTaskHandler(props: WidgetTaskHandlerProps) {
  const completed = await isStudyCompletedToday();
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  if (!Widget) return;

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      props.renderWidget(<Widget completed={completed} />);
      break;
    case "WIDGET_DELETED":
      break;
    case "WIDGET_CLICK":
      break;
    default:
      break;
  }
}
