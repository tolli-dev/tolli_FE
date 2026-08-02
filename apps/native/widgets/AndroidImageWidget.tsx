import { FlexWidget, ImageWidget } from "react-native-android-widget";

export function AndroidImageWidget({ completed }: { completed: boolean }) {
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
        imageWidth={88}
        imageHeight={88}
      />
    </FlexWidget>
  );
}
