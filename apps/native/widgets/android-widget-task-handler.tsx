import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { AndroidImageWidget } from "./AndroidImageWidget";
import { isStudyCompletedToday } from "../utils/studyStatus";
import { getTolliImageSize } from "./getTolliImageSize";

const nameToWidget = {
  AndroidImage: AndroidImageWidget,
};

export async function androidWidgetTaskHandler(props: WidgetTaskHandlerProps) {
  const completed = await isStudyCompletedToday();
  const { widgetName, width, height } = props.widgetInfo;
  const Widget = nameToWidget[widgetName as keyof typeof nameToWidget];

  if (!Widget) return;

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      props.renderWidget(
        <Widget
          completed={completed}
          imageSize={getTolliImageSize(width, height)}
        />,
      );
      break;
    case "WIDGET_DELETED":
      break;
    case "WIDGET_CLICK":
      break;
    default:
      break;
  }
}
