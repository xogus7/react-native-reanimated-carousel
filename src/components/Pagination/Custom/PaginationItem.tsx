import type { PropsWithChildren } from "react";
import React from "react";
import type { ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import type { DefaultStyle } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type DotStyle = Omit<ViewStyle, "width" | "height"> & {
  width?: number
  height?: number
};

export const PaginationItem: React.FC<
PropsWithChildren<{
  index: number
  count: number
  size?: number
  animValue: SharedValue<number>
  horizontal?: boolean
  dotStyle?: DotStyle
  activeDotStyle?: DotStyle
  customReanimatedStyle?: (
    progress: number,
    index: number,
    length: number,
  ) => DefaultStyle
}>
> = (props) => {
  const defaultDotSize = 10;
  const {
    animValue,
    dotStyle,
    activeDotStyle,
    index,
    count,
    size,
    horizontal,
    children,
    customReanimatedStyle,
  } = props;
  const customReanimatedStyleRef = useSharedValue<DefaultStyle>({});
  const handleCustomAnimation = (progress: number) => {
    customReanimatedStyleRef.value = customReanimatedStyle?.(progress, index, count) ?? {};
  }

  useDerivedValue(() => {
    runOnJS(handleCustomAnimation)(animValue?.value);
  });

  const animStyle = useAnimatedStyle(() => {
    const {
      width = size || defaultDotSize,
      height = size || defaultDotSize,
      borderRadius,
      backgroundColor = "#FFF",
      ...restDotStyle
    } = dotStyle ?? {};
    const {
      width: activeWidth = width,
      height: activeHeight = height,
      borderRadius: activeBorderRadius,
      backgroundColor: activeBackgroundColor = "#000",
      ...restActiveDotStyle
    } = activeDotStyle ?? {};
    let val = Math.abs(animValue?.value - index);
    if (index === 0 && animValue?.value > count - 1) {
      val = Math.abs(animValue?.value - count);
    }
    const inputRange = [0, 1, 2];
    const restStyle = (val === 0 ? restActiveDotStyle : restDotStyle) ?? {};

    return {
        width: interpolate(
            val,
            inputRange,
            [activeWidth, width, width],
            Extrapolation.CLAMP,
        ),
        height: interpolate(
            val,
            inputRange,
            [activeHeight, height, height],
            Extrapolation.CLAMP,
        ),
        borderRadius: interpolate(
          val,
          inputRange,
          [activeBorderRadius, borderRadius, borderRadius],
          Extrapolation.CLAMP,
        ),
        backgroundColor: interpolateColor(
            val,
            inputRange,
            [activeBackgroundColor, backgroundColor, backgroundColor],
        ),
        ...restStyle,
        ...(customReanimatedStyleRef.value ?? {}),
        transform: [
          ...restStyle?.transform ?? [],
          ...customReanimatedStyleRef.value?.transform ?? [],
        ]
    };
  }, [animValue, index, count, horizontal, dotStyle, activeDotStyle, customReanimatedStyle]);

  return (
    <Animated.View
      style={[
          {
            overflow: "hidden",
            transform: [
                {
                    rotateZ: horizontal ? "90deg" : "0deg",
                },
            ],
          },
          dotStyle,
          animStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};