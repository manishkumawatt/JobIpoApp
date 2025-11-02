import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {SafeAreaView} from 'react-native-safe-area-context';
import {generateReferralMessage} from '../../utils/referralUtils';
import imagePath from '../../theme/imagePath';

const {width} = Dimensions.get('window');

const FromShare = ({navigation}) => {
  const [totalPoints, setTotalPoints] = useState(500);
  const [referralCode, setReferralCode] = useState('');

  // Conversion rate: 20 Jobipo Points = ₹1
  const POINTS_TO_RUPEE = 20;
  const realAmount = totalPoints / POINTS_TO_RUPEE;

  useEffect(() => {
    loadPointsData();
    loadReferralCode();
  }, []);

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

  const loadReferralCode = async () => {
    try {
      const code =
        (await AsyncStorage.getItem('user_referral_code')) ||
        (await AsyncStorage.getItem('uniqueCode')) ||
        'REF123456';
      setReferralCode(code);
    } catch (error) {
      console.error('Failed to load referral code:', error);
      setReferralCode('REF123456');
    }
  };

  const handleConvert = () => {
    if (totalPoints < POINTS_TO_RUPEE) {
      Alert.alert(
        'Insufficient Points',
        `You need at least ${POINTS_TO_RUPEE} points to convert to ₹1.\nYour current balance: ${totalPoints} points.`,
        [{text: 'OK'}],
      );
      return;
    }

    const redeemableAmount = Math.floor(totalPoints / POINTS_TO_RUPEE);
    Alert.alert(
      'Convert to Real Amount',
      `Do you want to convert ${redeemableAmount * POINTS_TO_RUPEE} points to ₹${redeemableAmount}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Convert',
          onPress: () => {
            const pointsUsed = redeemableAmount * POINTS_TO_RUPEE;
            const newTotalPoints = totalPoints - pointsUsed;
            setTotalPoints(newTotalPoints);
            AsyncStorage.setItem('user_points', newTotalPoints.toString());
            Alert.alert(
              'Success!',
              `Successfully converted to ₹${redeemableAmount}`,
            );
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      const userName =
        (await AsyncStorage.getItem('referrer_name')) ||
        (await AsyncStorage.getItem('fullName')) ||
        'Friend';

      const message = generateReferralMessage(referralCode, userName);
      const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.jobipoapp';
      const appStoreLink = 'https://apps.apple.com/app/jobipo/id123456789';
      const appLink = Platform.OS === 'ios' ? appStoreLink : playStoreLink;
      const webLink = 'https://www.jobipo.com/';

      // Logo image URL
      const logoImageUrl =
        'https://jobipo.com/jobipo.com/public/uploads/users/1761470815-8a0fa72b-2b5b-948d-418d-0736ddcd37c1.jpg';

      const shareMessage = `${message}\n\nDownload the app: ${appLink}\nOr visit: ${webLink}`;

      // Try to download and share image, with fallback to text-only
      try {
        const {config, fs} = ReactNativeBlobUtil;
        const {dirs} = fs;
        const imageDir =
          Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
        const imagePath = `${imageDir}/jobipo_logo_${Date.now()}.jpg`;

        // Download image
        const response = await config({
          fileCache: true,
          path: imagePath,
        }).fetch('GET', logoImageUrl);

        const imageUri =
          Platform.OS === 'ios' ? response.path() : `file://${response.path()}`;

        // Try sharing with image (image as main, message as caption/subject)
        try {
          await Share.open({
            title: 'Refer & Earn with Jobipo',
            message: shareMessage, // Message will appear as caption
            url: imageUri, // Image as attachment
            type: 'image/jpeg',
            showAppsToView: true,
          });

          // Clean up after successful share
          setTimeout(() => {
            try {
              if (fs.exists(imagePath)) {
                fs.unlink(imagePath);
              }
            } catch (cleanupError) {
              console.log('Cleanup error:', cleanupError);
            }
          }, 5000);
          return; // Successfully shared with image
        } catch (imageShareError) {
          // If image sharing fails, try text-only with image URL
          console.log(
            'Image share failed, falling back to text:',
            imageShareError,
          );

          // Clean up downloaded image
          try {
            if (fs.exists(imagePath)) {
              fs.unlink(imagePath);
            }
          } catch (cleanupError) {
            console.log('Cleanup error:', cleanupError);
          }

          // Fallback: Share text with image URL included
          await Share.open({
            message: `${shareMessage}\n\n${logoImageUrl}`,
            title: 'Refer & Earn with Jobipo',
            url: appLink,
          });
          return;
        }
      } catch (downloadError) {
        // If image download fails, share text-only with image URL
        console.log('Image download failed, sharing text only:', downloadError);
        await Share.open({
          message: `${shareMessage}\n\n${logoImageUrl}`,
          title: 'Refer & Earn with Jobipo',
          url: appLink,
        });
        return;
      }
    } catch (error) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share. Please try again.');
        console.error('Share error:', error);
      }
    }
  };

  // Render coins in a container (like piggy bank with gullal effect)
  const renderCoins = () => {
    const coinCount = Math.min(Math.floor(totalPoints / 5), 50); // More coins for better visual
    const coins = [];

    // Create random positions for coins (gullal style - scattered)
    for (let i = 0; i < coinCount; i++) {
      const angle = (i * 137.5) % 360; // Golden angle for natural distribution
      const radius = 30 + (i % 3) * 15; // Varying distances
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
      const rotation = angle + i * 30;
      const size = 25 + (i % 3) * 5; // Varying sizes

      coins.push(
        <View
          key={i}
          style={[
            styles.coin,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              left: `${Math.max(5, Math.min(95, x))}%`,
              top: `${Math.max(5, Math.min(95, y))}%`,
              transform: [{rotate: `${rotation}deg`}],
            },
          ]}>
          <View
            style={[
              styles.coinInner,
              {width: size - 6, height: size - 6, borderRadius: (size - 6) / 2},
            ]}>
            <Text style={[styles.coinText, {fontSize: size * 0.25}]}>JP</Text>
          </View>
        </View>,
      );
    }

    return <View style={styles.coinsContainer}>{coins}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBrand}>Jobipo</Text>
          <Text style={styles.headerTitle}>GOLD POINTS</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Invite your friends</Text>
            <Text style={styles.subTitle}>and win scratch card</Text>
          </View>

          {/* Conversion Info */}
          <View style={styles.conversionSection}>
            {/* <Text style={styles.conversionText}>
              Every <Text style={styles.highlight}>₹100 spent</Text> earns you
            </Text>
            <Text style={styles.conversionAmount}>
              <Text style={styles.conversionNumber}>20</Text> Jobipo Points
            </Text> */}
            <Text style={styles.conversionRate}>
              20 Jobipo Points = ₹1 Real Amount
            </Text>
          </View>
          <Image
            source={imagePath.money_saving}
            style={{width: 150, height: 150, marginBottom: 20}}
            resizeMode="contain"
          />
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceLeft}>
              <View style={styles.balanceIconContainer}>
                <MaterialIcons
                  name="monetization-on"
                  size={32}
                  color="#FFD700"
                />
              </View>
              <View style={styles.balanceTextContainer}>
                <Text style={styles.balanceValue}>{totalPoints}</Text>
                <Text style={styles.balanceLabel}>Your Point Balance</Text>
              </View>
            </View>

            <View style={styles.separator}>
              <Text style={styles.equalsSign}>=</Text>
            </View>

            <View style={styles.balanceRight}>
              <View style={styles.balanceIconContainer}>
                <MaterialIcons
                  name="account-balance"
                  size={32}
                  color="#FF6B35"
                />
              </View>
              <View style={styles.balanceTextContainer}>
                <Text style={styles.balanceValue}>
                  ₹{realAmount.toFixed(2)}
                </Text>
                <Text style={styles.balanceLabel}>Real Amount</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.convertButton, {backgroundColor: '#FF8D53'}]}
              onPress={() => {
                navigation.navigate('PointsWallet');
              }}>
              <Text style={styles.convertButtonText}>Your scratch card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.convertButton}
              onPress={handleConvert}>
              <Text style={styles.convertButtonText}>
                Convert to Real Amount
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.referButton} onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="#fff" />
              <View style={styles.referButtonContent}>
                <Text style={styles.referButtonText}>Refer & Earn</Text>
                <Text style={styles.referCodeText}>Code: {referralCode}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.stepsContainer}>
              {/* Header */}
              <View style={styles.stepsHeader}>
                <View style={styles.rupeeIconCircle}>
                  <Text style={styles.rupeeIcon}>₹</Text>
                </View>
                <Text style={styles.stepsTitle}>Steps to Easy Earnings</Text>
              </View>

              {/* Steps List */}
              <View style={styles.stepsList}>
                {/* Connecting Line */}
                <View style={styles.connectingLine} />

                {/* Step 1 */}
                <View style={styles.stepItem}>
                  <View style={styles.stepIconContainer}>
                    <View style={styles.stepIconBox}>
                      <MaterialIcons
                        name="chat-bubble-outline"
                        size={24}
                        color="#2196F3"
                      />
                      <MaterialIcons
                        name="arrow-forward"
                        size={16}
                        color="#FFD700"
                        style={styles.stepArrow}
                      />
                    </View>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      Share your referral link
                    </Text>
                    <Text style={styles.stepDescription}>
                      Share link with friends and ask them to sign up on Jobipo
                    </Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.stepItem}>
                  <View style={styles.stepIconContainer}>
                    <View style={styles.stepIconBox}>
                      <MaterialIcons
                        name="account-balance-wallet"
                        size={24}
                        color="#2196F3"
                      />
                      <View style={styles.rupeeBadge}>
                        <Text style={styles.rupeeBadgeText}>₹</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      Earn ₹500 on your friend's sale
                    </Text>
                    <Text style={styles.stepDescription}>
                      When your friend makes total eligible earnings worth ₹500
                      within the first 3 months, you earn ₹500
                    </Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={[styles.stepItem, styles.lastStepItem]}>
                  <View style={styles.stepIconContainer}>
                    <View style={styles.stepIconBox}>
                      <MaterialIcons
                        name="card-giftcard"
                        size={24}
                        color="#2196F3"
                      />
                    </View>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      Unlock ₹1500 extra on 5 referrals
                    </Text>
                    <Text style={styles.stepDescription}>
                      Get ₹1500 extra every time you make 5 successful referrals
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8D53',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DBA514',
    letterSpacing: 1,
  },
  helpButton: {
    padding: 5,
  },
  helpText: {
    fontSize: 14,
    color: '#FF8D53',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  conversionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  conversionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  conversionAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  conversionNumber: {
    fontSize: 32,
    color: '#FFD700',
  },
  conversionRate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  piggyBankContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piggyBank: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 3,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  coinsContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  coin: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  coinInner: {
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  coinsOverflow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: [{translateX: -50}],
    flexDirection: 'row',
    gap: 5,
  },
  coinSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  balanceCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  balanceIconContainer: {
    marginRight: 12,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    width: 1,
    height: 60,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalsSign: {
    fontSize: 20,
    color: '#999',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 5,
  },
  totalPointsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalPointsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPointsLabel: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  actionButtons: {
    width: '100%',
    gap: 15,
    marginTop: 20,
  },
  convertButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  referButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#28a745',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  referButtonContent: {
    alignItems: 'center',
  },
  referButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  referCodeText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  stepsContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rupeeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rupeeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stepsList: {
    position: 'relative',
    paddingLeft: 20,
  },
  // connectingLine: {
  //   position: 'absolute',
  //   left: 48,
  //   top: 28,
  //   height: '100%',
  //   width: 2,
  //   backgroundColor: '#e0e0e0',
  // },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },
  lastStepItem: {
    marginBottom: 0,
  },
  stepIconContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  stepIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepArrow: {
    position: 'absolute',
    right: 4,
    bottom: 4,
  },
  rupeeBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rupeeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  disclaimerBox: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  disclaimerAsterisk: {
    color: '#dc3545',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FromShare;
