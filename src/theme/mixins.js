import { Dimensions, PixelRatio } from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

const guidelineBaseWidth = 375;

export const scaleSize = size => (WINDOW_WIDTH / guidelineBaseWidth) * size;
const fontScale = PixelRatio.getFontScale();
export const getFontSize = size => size / fontScale;
export const scaleFont = size => size * PixelRatio.getFontScale();


function dimensions(top, right = top, bottom = top, left = right, property) {
    let styles = {};

    styles[`${property}Top`] = top;
    styles[`${property}Right`] = right;
    styles[`${property}Bottom`] = bottom;
    styles[`${property}Left`] = left;

    return styles;
}
export const responsiveWidth = width => {
    return (Dimensions.get('window').width * width) / WINDOW_WIDTH;
  };
  
  export const responsiveHeight = height => {
    return (Dimensions.get('window').height * height) / WINDOW_HEIGHT;
  };
export function margin({top=0, right=0, bottom=0, left=0}) {
    return dimensions(top, right, bottom, left, 'margin');
}

export function padding({top=0, right=0, bottom=0, left=0}) {
    return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(color = '#000', offset = { height: 2, width: 2 }, radius = 8, opacity = 0.5) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}
