import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const ScratchCardComponent = ({
  isVisible,
  onClose,
  onPointsEarned,
  totalPoints,
  isRedeemable,
}) => {
  const [isScratched, setIsScratched] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPoints, setScratchPoints] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Point distribution system as per requirements
  const getRandomPoints = () => {
    const random = Math.random();

    if (random < 0.45) {
      // Type A: 20-50 points (45% probability)
      return Math.floor(Math.random() * 31) + 20;
    } else if (random < 0.75) {
      // Type B: 60-150 points (30% probability)
      return Math.floor(Math.random() * 91) + 60;
    } else if (random < 0.95) {
      // Type C: 200-400 points (20% probability)
      return Math.floor(Math.random() * 201) + 200;
    } else {
      // Type D: 500-1000 points (5% probability)
      return Math.floor(Math.random() * 501) + 500;
    }
  };

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      setIsScratched(false);
      setShowResult(false);
      setEarnedPoints(0);
      setScratchPoints([]);
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleReset = () => {
    setIsScratched(false);
    setShowResult(false);
    setEarnedPoints(0);
    setIsScratching(false);
    setScratchPoints([]);
  };

  const getPointsMessage = () => {
    if (earnedPoints >= 500) {
      return '🎉 Jackpot! Amazing!';
    } else if (earnedPoints >= 200) {
      return '🔥 Wow! You are lucky!';
    } else if (earnedPoints >= 100) {
      return '👍 Good! Congratulations!';
    } else {
      return '😊 Good start!';
    }
  };

  // Button-based scratch functionality
  const handleScratchButton = () => {
    if (!isScratched) {
      setIsScratching(true);

      // Simulate scratching progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setScratchPoints(prev => [
          ...prev,
          {
            x: Math.random() * 200 + 50,
            y: Math.random() * 100 + 50,
          },
        ]);

        if (progress >= 100) {
          clearInterval(interval);
          const points = getRandomPoints();
          setEarnedPoints(points);
          setIsScratched(true);
          setIsScratching(false);
          setTimeout(() => {
            setShowResult(true);
            onPointsEarned(points);
          }, 600);
        }
      }, 100);
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <View style={styles.scratchCard}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎁 Scratch Card</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          {!isScratched ? (
            <View style={styles.scratchArea}>
              <View style={styles.scratchCardContainer}>
                {/* Underlying reward area */}
                <View style={styles.scratchSurface}>
                  <Text style={styles.scratchText}>🎁 Scratch & Win!</Text>
                  <Text style={styles.scratchSubText}>
                    {isScratching
                      ? `Scratching... ${Math.min(scratchPoints.length * 10, 100)}%`
                      : 'Click to scratch and reveal'}
                  </Text>
                  <MaterialIcons
                    name={isScratching ? 'auto-fix-high' : 'touch-app'}
                    size={40}
                    color="#fff"
                  />
                  {isScratching && (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(scratchPoints.length * 10, 100)}%`,
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>

                {/* Gray overlay */}
                {!isScratched && (
                  <View style={styles.overlaySurface}>
                    {scratchPoints.map((p, i) => (
                      <View
                        key={i}
                        style={{
                          position: 'absolute',
                          left: p.x - 15,
                          top: p.y - 15,
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: 'transparent',
                          borderWidth: 15,
                          borderColor: 'rgba(0,0,0,0)',
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Scratch Button */}
              {!isScratched && (
                <TouchableOpacity
                  style={styles.scratchButton}
                  onPress={handleScratchButton}
                  disabled={isScratching}>
                  <Text style={styles.scratchButtonText}>
                    {isScratching ? 'Scratching...' : '🎯 Scratch Now!'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.resultArea}>
              <Text style={styles.congratsText}>Congratulations! 🎉</Text>
              <Text style={styles.pointsText}>{earnedPoints} Points</Text>
              <Text style={styles.messageText}>{getPointsMessage()}</Text>

              <View style={styles.pointsInfo}>
                <Text style={styles.totalPointsText}>
                  Total Points: {totalPoints + earnedPoints}
                </Text>
                <Text style={styles.valueText}>
                  Value: ₹{((totalPoints + earnedPoints) * 0.05).toFixed(2)}
                </Text>

                {!isRedeemable && (
                  <Text style={styles.thresholdText}>
                    2000 Points needed to redeem
                  </Text>
                )}

                {isRedeemable && (
                  <Text style={styles.redeemableText}>
                    ✅ You can now redeem ₹
                    {Math.floor((totalPoints + earnedPoints) / 2000) * 100} !
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleClose}>
            <Text style={styles.primaryButtonText}>
              {isScratched ? 'OK' : 'Later'}
            </Text>
          </TouchableOpacity>

          {isScratched && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => {
                  // Navigate to wallet or referral page
                  Alert.alert('Info', 'Go to your Points Wallet');
                }}>
                <Text style={styles.secondaryButtonText}>View Wallet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton]}
                onPress={handleReset}>
                <Text style={styles.resetButtonText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scratchCard: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  cardContent: {
    padding: 20,
    minHeight: 200,
    justifyContent: 'center',
  },
  scratchArea: {
    alignItems: 'center',
  },
  //   scratchCardContainer: {
  //     width: 200,
  //     height: 120,
  //     borderRadius: 15,
  //     marginBottom: 20,
  //   },
  //   scratchSurface: {
  //     width: 200,
  //     height: 120,
  //     borderRadius: 15,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: '#FFA500',
  //     borderWidth: 2,
  //     borderColor: '#FFD700',
  //     shadowColor: '#000',
  //     shadowOffset: {width: 0, height: 2},
  //     shadowOpacity: 0.3,
  //     shadowRadius: 4,
  //     elevation: 5,
  //   },
  scratchText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scratchSubText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  scratchButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scratchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultArea: {
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  pointsInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  totalPointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  thresholdText: {
    fontSize: 12,
    color: '#FF6B35',
    textAlign: 'center',
  },
  redeemableText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#28a745',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scratchCardContainer: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  scratchSurface: {
    flex: 1,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlaySurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#666',
    borderRadius: 10,
  },
  progressBar: {
    width: 150,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default ScratchCardComponent;
