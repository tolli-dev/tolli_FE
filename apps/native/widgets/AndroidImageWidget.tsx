import { FlexWidget, ImageWidget } from "react-native-android-widget";

export function AndroidImageWidget() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageWidget
        image={require("../assets/happyTolli.webp")}
        imageWidth={88}
        imageHeight={88}
      />
    </FlexWidget>
  );
}
