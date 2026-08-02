import { FlexWidget, ImageWidget } from "react-native-android-widget";

export function AndroidImageWidget({
  completed,
  imageSize,
}: {
  completed: boolean;
  imageSize: number;
}) {
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
        image={
          completed
            ? require("../assets/happyTolli.webp")
            : require("../assets/hungryTolli.webp")
        }
        imageWidth={imageSize}
        imageHeight={imageSize}
      />
    </FlexWidget>
  );
}
