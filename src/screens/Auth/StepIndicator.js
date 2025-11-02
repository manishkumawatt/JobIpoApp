import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const StepIndicatorBase = ({currentStep = 1, filledSteps = []}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                filledSteps.includes(step)
                  ? styles.activeCircle
                  : currentStep === step
                    ? styles.borderOnly
                    : styles.inactiveCircle,
              ]}>
              <Text
                style={[
                  styles.stepText,
                  filledSteps.includes(step)
                    ? styles.activeText
                    : currentStep === step
                      ? styles.borderOnlyText
                      : styles.inactiveText,
                ]}>
                {step}
              </Text>
            </View>
          </View>
          {index < 2 && (
            <View
              style={[
                styles.line,
                filledSteps.includes(step + 1)
                  ? styles.completedLine
                  : currentStep > step
                    ? styles.activeLine
                    : styles.inactiveLine,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// Exported Variants

export const StepIndicator1 = () => (
  <StepIndicatorBase currentStep={1} filledSteps={[]} />
);

export const StepIndicator2 = () => (
  <StepIndicatorBase currentStep={2} filledSteps={[1]} />
);

export const StepIndicator3 = () => (
  <StepIndicatorBase currentStep={3} filledSteps={[1, 2]} />
);

export const StepIndicator4 = () => (
  <StepIndicatorBase currentStep={3} filledSteps={[1, 2, 3]} />
);

// Styles

const CIRCLE_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 1,
  },
  activeCircle: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
  },
  borderOnly: {
    backgroundColor: '#F5F4FD',
    borderColor: '#FF8D53',
  },
  borderOnlyText: {
    color: '#585858',
    fontWeight: '400',
    fontSize: 16,
  },
  inactiveCircle: {
    backgroundColor: '#F5F4FD',
    borderColor: '#585858',
  },
  stepText: {
    color: '#585858',
    fontWeight: '400',
    fontSize: 16,
  },
  activeText: {
    color: '#fff',
  },
  borderText: {
    color: '#FF8D53',
  },
  inactiveText: {
    color: '#585858',
  },
  line: {
    height: 1,
    width: 80,
    marginHorizontal: -1,
    zIndex: 0,
  },
  completedLine: {
    backgroundColor: '#FF8D53',
  },
  activeLine: {
    backgroundColor: '#FF8D53',
  },
  inactiveLine: {
    backgroundColor: '#585858',
  },
});
