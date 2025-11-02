declare module 'react-native-image-slider' {
  import { Component } from 'react';
  import { ImageStyle, StyleProp, ViewStyle } from 'react-native';

  interface ImageSliderProps {
    images: string[];
    customSlide?: (index: number, item: string) => JSX.Element;
    customButtons?: (position: number, move: (index: number) => void, item: string[]) => JSX.Element;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    onPositionChanged?: (position: number) => void;
  }

  export default class ImageSlider extends Component<ImageSliderProps> {}
}
