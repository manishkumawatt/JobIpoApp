import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Colors from '../theme/colors';

const ToolTip = props => {
  return (
    <Tooltip
      backgroundColor="transparent"
      contentStyle={[
        styles.tool_view,
        {
          top: props.top ? props.top : 0,         
          left: props.left ? props.left : 0,
          right: props.right ? props.right : 0,
          height:props.height ? props.height : 35,
          width:props.width,
          borderRadius: props.borderRadius ? props.borderRadius : 7,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.primary.WHITE,
            borderWidth:1,
            borderColor:"#00000009"
        },
      ]}
      arrowSize={styles.arrow_Size}
      isVisible={props.isVisible}
      content={props.content}
      placement="top"
      onClose={props.onClose}>
      <Text style={styles.toolTipText}>.</Text>
    </Tooltip>
  );
};

export default ToolTip;

const styles = StyleSheet.create({
  tool_view: {
    position: 'absolute',
   
  },
  toolTipText: {
    color: 'transparent',
  },
  arrow_Size: {
    height: 0,
    width: 0,
  },
});
