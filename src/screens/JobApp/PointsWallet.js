import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScratchCard} from 'rn-scratch-card';
import Share from 'react-native-share';
import imagePath from '../../theme/imagePath';
import {SafeAreaView} from 'react-native-safe-area-context';
import {generateReferralMessage} from '../../utils/referralUtils';

const PointsWallet = ({navigation}) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [revealedPoints, setRevealedPoints] = useState(0);
  const [isScratching, setIsScratching] = useState(true);
  const scratchCompletedRef = React.useRef(false);
  const [showRewardDetails, setShowRewardDetails] = useState(null);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

  const pointsValue = totalPoints * 0.05; // 1 point = ₹0.05
  const isRedeemable = totalPoints >= 2000;
  const maxRedeemable = Math.floor(totalPoints / 2000) * 100; // Only multiples of ₹100
  const remainingPoints = totalPoints % 2000;

  useEffect(() => {
    if (isRedeemable) {
      setRedeemAmount(maxRedeemable);
    }
  }, [isRedeemable, maxRedeemable]);

  // Load points data, recent activity and rewards
  useEffect(() => {
    loadPointsData();
    loadRecentActivity();
    loadRewards();
  }, []);

  // Load points from AsyncStorage
  const loadPointsData = async () => {
    try {
      const pointsData = await AsyncStorage.getItem('user_points');
      if (pointsData) {
        setTotalPoints(parseInt(pointsData));
      }
    } catch (error) {
      console.error('Failed to load points data:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activityData = await AsyncStorage.getItem('referral_activity');
      if (activityData) {
        const activities = JSON.parse(activityData);
        // Sort by timestamp (newest first) and limit to 10
        const sortedActivities = activities
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10);
        setRecentActivity(sortedActivities);
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  // Load rewards from API
  const loadRewards = async () => {
    try {
      setIsLoadingRewards(true);
      const userID = await AsyncStorage.getItem('UserID');
      if (!userID) {
        console.warn('User ID not found in AsyncStorage');
        setRewards([]);
        return;
      }

      const requestData = {
        userID: userID,
      };
      console.log('requestData-=-=-=--=', requestData);
      const response = await fetch('https://jobipo.com/api/point-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('Point Dashboard API Response:', responseData);

      if (responseData && responseData.logout != 1) {
        // Parse the response - adjust based on actual API response structure
        const rewardsData = responseData?.data?.scratch_cards;

        setRewards(rewardsData);
      } else {
        console.error('API Error:', responseData);
        setRewards([]);
      }
    } catch (error) {
      console.error('Failed to load rewards from API:', error);
      setRewards([]);
    } finally {
      setIsLoadingRewards(false);
    }
  };

  // Save rewards to AsyncStorage
  const saveRewards = async updatedRewards => {
    try {
      await AsyncStorage.setItem(
        'user_rewards',
        JSON.stringify(updatedRewards),
      );
      // setRewards(updatedRewards);
    } catch (error) {
      console.error('Failed to save rewards:', error);
    }
  };

  // Generate random points
  const getRandomPoints = () => {
    const random = Math.random();
    if (random < 0.45) {
      return Math.floor(Math.random() * 31) + 20; // 20-50 points
    } else if (random < 0.75) {
      return Math.floor(Math.random() * 91) + 60; // 60-150 points
    } else if (random < 0.95) {
      return Math.floor(Math.random() * 201) + 200; // 200-400 points
    } else {
      return Math.floor(Math.random() * 501) + 500; // 500-1000 points
    }
  };

  // Get celebration based on points
  const getCelebration = points => {
    if (points >= 500) {
      return {
        emojis: '🎉🎊🎁🏆💰',
        color: '#FFD700',
        message: 'JACKPOT!',
        bgColor: '#FF6B35',
      };
    } else if (points >= 200) {
      return {
        emojis: '🎉🎁🏆⭐',
        color: '#FFA500',
        message: 'Amazing!',
        bgColor: '#FF6B35',
      };
    } else if (points >= 60) {
      return {
        emojis: '🎉🎁⭐',
        color: '#90EE90',
        message: 'Great!',
        bgColor: '#FF6B35',
      };
    } else {
      return {
        emojis: '🎉⭐',
        color: '#87CEEB',
        message: 'Good!',
        bgColor: '#FF6B35',
      };
    }
  };

  // Get expiration date (30 days from now)
  const getExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle reward card click
  const handleRewardClick = reward => {
    if (!reward.isScratched) {
      setSelectedReward(reward);
      const points = getRandomPoints(); // Generate points when modal opens
      setRevealedPoints(points);
      setIsScratching(true);
      scratchCompletedRef.current = false; // Reset the completion flag
      setShowScratchModal(true);
    }
  };

  // Handle scratch completion
  const handleScratchComplete = val => {
    console.log('Scratch event:', val);

    // Check if already completed to prevent multiple calls
    if (scratchCompletedRef.current) {
      return;
    }

    // Mark as completed
    scratchCompletedRef.current = true;

    const points = revealedPoints; // Use the pre-generated points
    setIsScratching(false); // Stop scratching animation

    // Wait a bit to show the revealed points, then close
    setTimeout(async () => {
      const updatedRewards = rewards.filter(
        reward => reward.id !== selectedReward.id,
      );
      saveRewards(updatedRewards);
      addActivity('bonus', points, 'Reward Card Bonus');

      // Update total points
      const newTotalPoints = totalPoints + points;
      setTotalPoints(newTotalPoints);
      AsyncStorage.setItem('user_points', newTotalPoints.toString());

      setShowScratchModal(false);

      // Get referral code info (you can fetch this from AsyncStorage or API)
      const referralCode =
        (await AsyncStorage.getItem('user_referral_code')) || 'REF123456';
      const referrerName =
        (await AsyncStorage.getItem('referrer_name')) || 'John Doe';

      setShowRewardDetails({
        points: points.toString(),
        expirationDate: getExpirationDate(),
        referralCode: referralCode,
        referrerName: referrerName,
      });
    }, 2000); // Show for 2 seconds
  };

  const addActivity = async (type, points, description) => {
    try {
      const newActivity = {
        id: Date.now().toString(),
        type,
        points,
        description,
        timestamp: new Date().toISOString(),
      };

      const existingActivities =
        await AsyncStorage.getItem('referral_activity');
      const activities = existingActivities
        ? JSON.parse(existingActivities)
        : [];

      const updatedActivities = [newActivity, ...activities].slice(0, 50); // Keep only last 50 activities
      await AsyncStorage.setItem(
        'referral_activity',
        JSON.stringify(updatedActivities),
      );

      setRecentActivity(updatedActivities.slice(0, 10));
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const formatTimeAgo = timestamp => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return activityTime.toLocaleDateString();
  };

  const getActivityIcon = type => {
    switch (type) {
      case 'referral':
        return 'card-giftcard';
      case 'redemption':
        return 'account-balance-wallet';
      case 'bonus':
        return 'stars';
      default:
        return 'card-giftcard';
    }
  };

  const getActivityColor = type => {
    switch (type) {
      case 'referral':
        return '#28a745';
      case 'redemption':
        return '#FF6B35';
      case 'bonus':
        return '#ffc107';
      default:
        return '#28a745';
    }
  };

  const handleRedeem = () => {
    if (!isRedeemable) {
      Alert.alert(
        'Insufficient Points',
        `At least 2000 Points required to redeem.\nYou have ${totalPoints} Points.`,
        [{text: 'OK'}],
      );
      return;
    }

    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    const pointsToUse = Math.floor(redeemAmount / 0.05); // Convert ₹ to points

    Alert.alert(
      'Confirm Redemption',
      `Do you want to redeem ₹${redeemAmount} using ${pointsToUse} Points?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () => {
            // Update total points
            const newTotalPoints = totalPoints - pointsToUse;
            setTotalPoints(newTotalPoints);
            AsyncStorage.setItem('user_points', newTotalPoints.toString());

            addActivity(
              'redemption',
              -pointsToUse,
              `Redeemed ₹${redeemAmount}`,
            );
            setShowRedeemModal(false);
            Alert.alert('Success!', `Successfully redeemed ₹${redeemAmount}`);
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      // Get referral code and user name from AsyncStorage
      const referralCode =
        (await AsyncStorage.getItem('user_referral_code')) ||
        (await AsyncStorage.getItem('uniqueCode')) ||
        'REF123456';
      const userName =
        (await AsyncStorage.getItem('referrer_name')) ||
        (await AsyncStorage.getItem('fullName')) ||
        'Friend';

      // Generate referral message
      const message = generateReferralMessage(referralCode, userName);

      // App store links
      const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.jobipoapp';
      const appStoreLink = 'https://apps.apple.com/app/jobipo/id123456789'; // Update with actual App Store link
      const appLink = Platform.OS === 'ios' ? appStoreLink : playStoreLink;
      const webLink = 'https://www.jobipo.com/';

      // Combine message with links
      const shareMessage = `${message}\n\nDownload the app: ${appLink}\nOr visit: ${webLink}`;

      // Open share options
      await Share.open({
        message: shareMessage,
        title: 'Refer & Earn with Jobipo',
        url: appLink, // For platforms that support URL sharing
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share. Please try again.');
        console.error('Share error:', error);
      }
    }
  };

  const getProgressPercentage = () => {
    return Math.min((totalPoints / 2000) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage < 50) return '#FF6B35';
    if (percentage < 80) return '#FFA500';
    return '#28a745';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💰 Points Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.content}>
          {/* Points Display */}
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsLabel}>Your Points</Text>
            <Text style={styles.pointsValue}>
              {totalPoints.toLocaleString()}
            </Text>
            <Text style={styles.pointsValueText}>
              Value: ₹{pointsValue.toFixed(2)}
            </Text>
          </View>

          {/* Progress Bar
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>
                  Progress for Redemption ({totalPoints}/2000)
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${getProgressPercentage()}%`,
                        backgroundColor: getProgressColor(),
                      },
                    ]}
                  />
                </View>
              </View> */}

          {/* Your Rewards Section */}
          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>Your Rewards</Text>

            <FlatList
              data={rewards}
              numColumns={2}
              keyExtractor={item =>
                item.id?.toString() || `reward-${item.points}`
              }
              renderItem={({item: reward}) => (
                console.log('reward-=-=-=--=', reward),
                (
                  <TouchableOpacity
                    style={[
                      styles.rewardCard,
                      reward.isScratched && styles.rewardCardScratched,
                      // reward.type === 'ad' && styles.rewardCardAd,
                    ]}
                    onPress={() => handleRewardClick(reward)}
                    disabled={reward.isScratched}>
                    {/* New Badge */}
                    {!reward.isScratched && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                      </View>
                    )}

                    {/* Unscratched Card - Blue with pattern */}
                    {!reward.isScratched && (
                      <View style={styles.scratchCardPattern}>
                        <View style={styles.patternIcons}>
                          <Image
                            source={imagePath.scratch}
                            style={{
                              width: Dimensions.get('window').width / 2 - 30,
                              height: 140,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      </View>
                    )}

                    {/* Scratched Card - Revealed */}
                    {reward.isScratched && (
                      <View style={styles.scratchedCardContent}>
                        <Text style={styles.scratchedPoints}>
                          {reward.points}
                        </Text>
                        <Text style={styles.pointsLabelSmall}>Points</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              )}
              contentContainerStyle={styles.rewardsGrid}
              columnWrapperStyle={styles.rewardsRow}
              scrollEnabled={false}
              ListEmptyComponent={
                isLoadingRewards ? (
                  <View style={styles.emptyRewardsContainer}>
                    <ActivityIndicator size="small" color="#0d4574" />
                    <Text style={styles.emptyRewardsText}>
                      Loading rewards...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyRewardsContainer}>
                    <Text style={styles.emptyRewardsText}>
                      No rewards available
                    </Text>
                  </View>
                )
              }
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.referButton, {opacity: 1}]}
              onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Refer & Earn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.redeemButton,
                {opacity: isRedeemable ? 1 : 0.5},
              ]}
              onPress={handleRedeem}
              disabled={!isRedeemable}>
              <MaterialIcons
                name="account-balance-wallet"
                size={20}
                color="#fff"
              />
              <Text style={styles.actionButtonText}>
                {isRedeemable ? 'Redeem' : 'Not Ready'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            {recentActivity.length > 0 ? (
              <FlatList
                data={recentActivity}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View style={styles.activityItem}>
                    <MaterialIcons
                      name={getActivityIcon(item.type)}
                      size={20}
                      color={getActivityColor(item.type)}
                    />
                    <Text style={styles.activityText}>
                      {item.description}
                      {item.points > 0
                        ? ` +${item.points}`
                        : ` ${item.points}`}{' '}
                      Points
                    </Text>
                    <Text style={styles.activityTime}>
                      {formatTimeAgo(item.timestamp)}
                    </Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noActivityContainer}>
                <MaterialIcons name="history" size={40} color="#ccc" />
                <Text style={styles.noActivityText}>No recent activity</Text>
                <Text style={styles.noActivitySubText}>
                  Start referring friends to see your activity here!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Redeem Modal */}
      <Modal visible={showRedeemModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.redeemModal}>
            <Text style={styles.redeemTitle}>Redeem Points</Text>

            <View style={styles.redeemInfo}>
              <Text style={styles.redeemLabel}>
                Available Points: {totalPoints}
              </Text>
              <Text style={styles.redeemLabel}>
                Max Redeemable: ₹{maxRedeemable}
              </Text>
              <Text style={styles.redeemLabel}>
                Remaining after redeem: {remainingPoints}
              </Text>
            </View>

            <View style={styles.redeemButtons}>
              <TouchableOpacity
                style={styles.redeemOption}
                onPress={() => setRedeemAmount(100)}>
                <Text style={styles.redeemOptionText}>₹100 (2000 Points)</Text>
              </TouchableOpacity>

              {maxRedeemable >= 200 && (
                <TouchableOpacity
                  style={styles.redeemOption}
                  onPress={() => setRedeemAmount(200)}>
                  <Text style={styles.redeemOptionText}>
                    ₹200 (4000 Points)
                  </Text>
                </TouchableOpacity>
              )}

              {maxRedeemable >= 300 && (
                <TouchableOpacity
                  style={styles.redeemOption}
                  onPress={() => setRedeemAmount(300)}>
                  <Text style={styles.redeemOptionText}>
                    ₹300 (6000 Points)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.redeemActions}>
              <TouchableOpacity
                style={[styles.redeemActionButton, styles.cancelButton]}
                onPress={() => setShowRedeemModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.redeemActionButton, styles.confirmButton]}
                onPress={confirmRedeem}>
                <Text style={styles.confirmButtonText}>
                  Redeem ₹{redeemAmount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Scratch Card Modal */}
      {showScratchModal && selectedReward && (
        <View style={styles.scratchModalOverlay}>
          <View style={styles.scratchModalContainer}>
            <View style={styles.scratchModalHeader}>
              <Text style={styles.scratchModalTitle}>NEW REWARD</Text>
              <TouchableOpacity onPress={() => setShowScratchModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Large Scratch Card */}
            <View style={styles.largeScratchCardContainer}>
              <View
                style={{
                  backgroundColor: 'red',
                  width: '100%',
                  height: 280,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}>
                {(() => {
                  const celebration = getCelebration(revealedPoints);
                  console.log('celebration', celebration);
                  return (
                    <View
                      style={[
                        styles.pointsRevealContainer,
                        {backgroundColor: celebration.bgColor},
                        styles.largeScratchCard,
                      ]}>
                      <Text style={styles.celebrationEmojis}>
                        {celebration.emojis}
                      </Text>
                      <Text style={styles.celebrationMessage}>
                        {celebration.message}
                      </Text>
                      <Text
                        style={[
                          styles.revealedPointsText,
                          {color: celebration.color},
                        ]}>
                        {revealedPoints}
                      </Text>
                      <Text style={styles.pointsLabelText}>Points Won!</Text>
                      {/* <View style={styles.pointsValueContainer}>
                        <Text style={styles.pointsValueReveal}>
                          ₹{(revealedPoints * 0.05).toFixed(2)}
                        </Text>
                      </View> */}
                    </View>
                  );
                })()}
              </View>
              <ScratchCard
                source={imagePath.scratch}
                brushWidth={50}
                minimumPercentScratched={60}
                onScratch={handleScratchComplete}
                style={styles.largeScratchCard}>
                <View style={{flex: 1}} />
              </ScratchCard>
            </View>

            {/* <Text style={styles.voucherText}>Voucher</Text> */}
          </View>
        </View>
      )}
      {showRewardDetails && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.rewardModal}>
              {/* Header */}
              <View style={styles.rewardModalHeader}>
                <Text style={styles.rewardModalTitle}>Reward Details</Text>
                <TouchableOpacity
                  onPress={() => setShowRewardDetails(null)}
                  style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Points Display */}
              <View style={styles.rewardPointsContainer}>
                <Text style={styles.rewardPointsValue}>
                  {showRewardDetails.points}
                </Text>
                <Text style={styles.rewardPointsLabel}>Points</Text>
                <Text style={styles.rewardPointsRupee}>
                  ₹{(parseInt(showRewardDetails.points) * 0.05).toFixed(2)}
                </Text>
              </View>

              {/* Referral Information */}
              <View style={styles.rewardInfoSection}>
                <View style={styles.rewardInfoRow}>
                  <MaterialIcons name="person" size={20} color="#666" />
                  <View style={styles.rewardInfoContent}>
                    <Text style={styles.rewardInfoLabel}>Referred by</Text>
                    <Text style={styles.rewardInfoValue}>
                      {showRewardDetails.referrerName}
                    </Text>
                  </View>
                </View>

                <View style={styles.rewardInfoRow}>
                  <MaterialIcons name="code" size={20} color="#666" />
                  <View style={styles.rewardInfoContent}>
                    <Text style={styles.rewardInfoLabel}>Referral Code</Text>
                    <Text style={styles.rewardInfoValue}>
                      {showRewardDetails.referralCode}
                    </Text>
                  </View>
                </View>

                <View style={styles.rewardInfoRow}>
                  <MaterialIcons name="event" size={20} color="#666" />
                  <View style={styles.rewardInfoContent}>
                    <Text style={styles.rewardInfoLabel}>Valid until</Text>
                    <Text style={styles.rewardInfoValue}>
                      {showRewardDetails.expirationDate}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.rewardModalButton}
                onPress={() => setShowRewardDetails(null)}>
                <Text style={styles.rewardModalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  walletContainer: {
    // width: '90%',
    // maxHeight: '80%',
    // backgroundColor: '#fff',
    // borderRadius: 20,
    // elevation: 10,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 4},
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34, // Same width as back button to center the title
  },
  content: {
    padding: 20,
  },
  pointsDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  pointsValueText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  referralInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  referralStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  referButton: {
    backgroundColor: '#28a745',
  },
  redeemButton: {
    backgroundColor: '#FF6B35',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activityContainer: {
    marginTop: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  noActivityContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noActivityText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  noActivitySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  redeemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  redeemInfo: {
    marginBottom: 20,
  },
  redeemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  redeemButtons: {
    marginBottom: 20,
  },
  redeemOption: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  redeemOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  redeemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  redeemActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Rewards Section Styles
  rewardsContainer: {
    marginBottom: 30,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rewardsGrid: {
    paddingBottom: 10,
  },
  rewardsRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rewardCard: {
    width: '48%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyRewardsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyRewardsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  rewardCardScratched: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rewardCardAd: {
    backgroundColor: '#fff',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scratchCardPattern: {
    flex: 1,
    // backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  patternIcon: {
    fontSize: 30,
    color: '#87CEEB',
    opacity: 0.7,
  },
  adCardContent: {
    padding: 10,
    alignItems: 'center',
  },
  adTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  adSubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  adValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  scratchedCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  expiredText: {
    fontSize: 10,
    color: '#999',
    marginBottom: 8,
  },
  scratchedPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  pointsLabelSmall: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  // Scratch Modal Styles
  scratchModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scratchModalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  scratchModalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scratchModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  largeScratchCardContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  largeScratchCard: {
    width: '100%',
    height: 280,
  },
  scratchCardBlue: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternIconsLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  patternIconLarge: {
    fontSize: 40,
    color: '#87CEEB',
    opacity: 0.7,
  },
  adCardLarge: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 15,
  },
  adCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  adCardBottom: {
    alignItems: 'center',
  },
  adCardMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  adCardSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  voucherText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scratchButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  scratchButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsRevealContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  celebrationEmojis: {
    fontSize: 30,
    marginBottom: 10,
  },
  celebrationMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  revealedPointsText: {
    fontSize: 40,
    fontWeight: 'bold',
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
  // Reward Modal Styles (Google Play Style)
  rewardModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  rewardModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rewardModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  rewardPointsContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  rewardPointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  rewardPointsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  rewardPointsRupee: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
  },
  rewardInfoSection: {
    padding: 20,
  },
  rewardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardInfoContent: {
    marginLeft: 12,
    flex: 1,
  },
  rewardInfoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  rewardInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  rewardModalButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
    borderRadius: 8,
  },
  rewardModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PointsWallet;
