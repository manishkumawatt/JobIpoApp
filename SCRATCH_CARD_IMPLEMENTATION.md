# ScratchCard Implementation Guide

## Current Issue

The user wants to show rewarded points when scratching the card, similar to Paytm's scratch card behavior.

## Solution Required

Replace the content inside the ScratchCard (lines 552-573) with a points reveal display:

```jsx
<View style={styles.pointsRevealContainer}>
  <Text style={styles.congratulationsText}>🎉 Congratulations! 🎉</Text>
  <Text style={styles.revealedPointsText}>{revealedPoints}</Text>
  <Text style={styles.pointsLabelText}>Points Won!</Text>
  <View style={styles.pointsValueContainer}>
    <Text style={styles.pointsValueReveal}>
      ₹{(revealedPoints * 0.05).toFixed(2)}
    </Text>
  </View>
</View>
```

## Required Styles to Add

Add these styles to the StyleSheet:

```jsx
pointsRevealContainer: {
  flex: 1,
  backgroundColor: '#FF6B35',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
congratulationsText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 15,
  textAlign: 'center',
},
revealedPointsText: {
  fontSize: 72,
  fontWeight: 'bold',
  color: '#FFD700',
  marginVertical: 10,
  textShadowColor: '#000',
  textShadowOffset: {width: 2, height: 2},
  textShadowRadius: 4,
},
pointsLabelText: {
  fontSize: 20,
  fontWeight: '600',
  color: '#fff',
  marginBottom: 10,
},
pointsValueContainer: {
  backgroundColor: '#fff',
  paddingHorizontal: 30,
  paddingVertical: 10,
  borderRadius: 25,
  marginTop: 10,
},
pointsValueReveal: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FF6B35',
},
```

## How It Works

1. When user clicks a reward card, `revealedPoints` is pre-generated
2. User scratches the card
3. When 60% is scratched, the points are revealed underneath
4. After 3 seconds, the modal closes and points are added to the account
5. A congratulatory message is shown

## Status

The implementation is ready except for the UI change in the ScratchCard content area (lines 552-573).
