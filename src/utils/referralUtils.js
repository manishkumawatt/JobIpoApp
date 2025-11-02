import AsyncStorage from '@react-native-async-storage/async-storage';

// Referral system configuration
export const REFERRAL_CONFIG = {
  POINT_VALUE: 0.05, // 1 point = ₹0.05
  MIN_REDEEM_POINTS: 2000, // Minimum points needed to redeem
  REDEEM_MULTIPLE: 2000, // Points must be in multiples of 2000
  MAX_REFERRALS_PER_DAY: 10,
  POINT_DISTRIBUTION: {
    TYPE_A: {min: 20, max: 50, probability: 0.45}, // Small reward
    TYPE_B: {min: 60, max: 150, probability: 0.3}, // Medium reward
    TYPE_C: {min: 200, max: 400, probability: 0.2}, // Lucky reward
    TYPE_D: {min: 500, max: 1000, probability: 0.05}, // Jackpot
  },
};

// Generate random points based on distribution
export const generateRandomPoints = () => {
  const random = Math.random();
  const {TYPE_A, TYPE_B, TYPE_C, TYPE_D} = REFERRAL_CONFIG.POINT_DISTRIBUTION;

  if (random < TYPE_A.probability) {
    return (
      Math.floor(Math.random() * (TYPE_A.max - TYPE_A.min + 1)) + TYPE_A.min
    );
  } else if (random < TYPE_A.probability + TYPE_B.probability) {
    return (
      Math.floor(Math.random() * (TYPE_B.max - TYPE_B.min + 1)) + TYPE_B.min
    );
  } else if (
    random <
    TYPE_A.probability + TYPE_B.probability + TYPE_C.probability
  ) {
    return (
      Math.floor(Math.random() * (TYPE_C.max - TYPE_C.min + 1)) + TYPE_C.min
    );
  } else {
    return (
      Math.floor(Math.random() * (TYPE_D.max - TYPE_D.min + 1)) + TYPE_D.min
    );
  }
};

// Calculate points value in rupees
export const calculatePointsValue = points => {
  return points * REFERRAL_CONFIG.POINT_VALUE;
};

// Check if points are redeemable
export const isRedeemable = points => {
  return points >= REFERRAL_CONFIG.MIN_REDEEM_POINTS;
};

// Calculate maximum redeemable amount
export const calculateMaxRedeemable = points => {
  const redeemablePoints =
    Math.floor(points / REFERRAL_CONFIG.REDEEM_MULTIPLE) *
    REFERRAL_CONFIG.REDEEM_MULTIPLE;
  return calculatePointsValue(redeemablePoints);
};

// Calculate remaining points after redeem
export const calculateRemainingPoints = (points, redeemAmount) => {
  const pointsToUse = Math.floor(redeemAmount / REFERRAL_CONFIG.POINT_VALUE);
  return points - pointsToUse;
};

// Validate referral
export const validateReferral = async referralData => {
  try {
    const {
      referrerId,
      refereeId,
      refereePhone,
      refereeEmail,
      deviceId,
      ipAddress,
    } = referralData;

    // Check if user exists
    if (!referrerId || !refereeId) {
      return {valid: false, error: 'Invalid user data'};
    }

    // Check daily referral limit
    const todayReferrals = await getTodayReferrals(referrerId);
    if (todayReferrals >= REFERRAL_CONFIG.MAX_REFERRALS_PER_DAY) {
      return {valid: false, error: 'Daily referral limit reached'};
    }

    // Check for duplicate referral
    const isDuplicate = await checkDuplicateReferral(referrerId, refereeId);
    if (isDuplicate) {
      return {valid: false, error: 'Duplicate referral detected'};
    }

    // Check for self-referral
    if (referrerId === refereeId) {
      return {valid: false, error: 'Self-referral not allowed'};
    }

    // Check device/IP restrictions (basic validation)
    const deviceReferrals = await getDeviceReferrals(deviceId);
    if (deviceReferrals > 3) {
      return {valid: false, error: 'Too many referrals from this device'};
    }

    return {valid: true};
  } catch (error) {
    console.error('Referral validation error:', error);
    return {valid: false, error: 'Validation failed'};
  }
};

// Get today's referrals count
export const getTodayReferrals = async userId => {
  try {
    const today = new Date().toDateString();
    const referrals = await AsyncStorage.getItem(
      `referrals_${userId}_${today}`,
    );
    return referrals ? JSON.parse(referrals).length : 0;
  } catch (error) {
    console.error('Error getting today referrals:', error);
    return 0;
  }
};

// Check for duplicate referral
export const checkDuplicateReferral = async (referrerId, refereeId) => {
  try {
    const referrals = await AsyncStorage.getItem(`referrals_${referrerId}`);
    if (!referrals) return false;

    const referralList = JSON.parse(referrals);
    return referralList.some(ref => ref.refereeId === refereeId);
  } catch (error) {
    console.error('Error checking duplicate referral:', error);
    return false;
  }
};

// Get device referrals count
export const getDeviceReferrals = async deviceId => {
  try {
    const referrals = await AsyncStorage.getItem(
      `device_referrals_${deviceId}`,
    );
    return referrals ? JSON.parse(referrals).length : 0;
  } catch (error) {
    console.error('Error getting device referrals:', error);
    return 0;
  }
};

// Save referral record
export const saveReferralRecord = async referralData => {
  try {
    const {referrerId, refereeId, points, timestamp, deviceId} = referralData;

    // Save to referrer's record
    const referrerKey = `referrals_${referrerId}`;
    const existingReferrals = await AsyncStorage.getItem(referrerKey);
    const referrals = existingReferrals ? JSON.parse(existingReferrals) : [];

    referrals.push({
      refereeId,
      points,
      timestamp,
      deviceId,
    });

    await AsyncStorage.setItem(referrerKey, JSON.stringify(referrals));

    // Save to today's referrals
    const today = new Date().toDateString();
    const todayKey = `referrals_${referrerId}_${today}`;
    const todayReferrals = await AsyncStorage.getItem(todayKey);
    const todayList = todayReferrals ? JSON.parse(todayReferrals) : [];

    todayList.push({
      refereeId,
      points,
      timestamp,
    });

    await AsyncStorage.setItem(todayKey, JSON.stringify(todayList));

    // Save to device referrals
    const deviceKey = `device_referrals_${deviceId}`;
    const deviceReferrals = await AsyncStorage.getItem(deviceKey);
    const deviceList = deviceReferrals ? JSON.parse(deviceReferrals) : [];

    deviceList.push({
      referrerId,
      refereeId,
      timestamp,
    });

    await AsyncStorage.setItem(deviceKey, JSON.stringify(deviceList));

    return true;
  } catch (error) {
    console.error('Error saving referral record:', error);
    return false;
  }
};

// Get user's total points
export const getUserPoints = async userId => {
  try {
    const points = await AsyncStorage.getItem(`user_points_${userId}`);
    return points ? parseInt(points) : 0;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
};

// Update user's points
export const updateUserPoints = async (userId, points) => {
  try {
    const currentPoints = await getUserPoints(userId);
    const newPoints = currentPoints + points;
    await AsyncStorage.setItem(`user_points_${userId}`, newPoints.toString());
    return newPoints;
  } catch (error) {
    console.error('Error updating user points:', error);
    return 0;
  }
};

// Redeem points
export const redeemPoints = async (userId, redeemAmount) => {
  try {
    const currentPoints = await getUserPoints(userId);
    const pointsToUse = Math.floor(redeemAmount / REFERRAL_CONFIG.POINT_VALUE);

    if (pointsToUse > currentPoints) {
      return {success: false, error: 'Insufficient points'};
    }

    if (pointsToUse % REFERRAL_CONFIG.REDEEM_MULTIPLE !== 0) {
      return {success: false, error: 'Points must be in multiples of 2000'};
    }

    const remainingPoints = currentPoints - pointsToUse;
    await AsyncStorage.setItem(
      `user_points_${userId}`,
      remainingPoints.toString(),
    );

    // Save redemption record
    const redemptionKey = `redemptions_${userId}`;
    const existingRedemptions = await AsyncStorage.getItem(redemptionKey);
    const redemptions = existingRedemptions
      ? JSON.parse(existingRedemptions)
      : [];

    redemptions.push({
      amount: redeemAmount,
      pointsUsed: pointsToUse,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(redemptionKey, JSON.stringify(redemptions));

    return {success: true, remainingPoints};
  } catch (error) {
    console.error('Error redeeming points:', error);
    return {success: false, error: 'Redemption failed'};
  }
};

// Get referral statistics
export const getReferralStats = async userId => {
  try {
    const referrals = await AsyncStorage.getItem(`referrals_${userId}`);
    const referralList = referrals ? JSON.parse(referrals) : [];

    const totalReferrals = referralList.length;
    const totalPoints = referralList.reduce((sum, ref) => sum + ref.points, 0);
    const todayReferrals = await getTodayReferrals(userId);

    return {
      totalReferrals,
      totalPoints,
      todayReferrals,
      averagePointsPerReferral:
        totalReferrals > 0 ? totalPoints / totalReferrals : 0,
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return {
      totalReferrals: 0,
      totalPoints: 0,
      todayReferrals: 0,
      averagePointsPerReferral: 0,
    };
  }
};

// Generate referral message
export const generateReferralMessage = (referralCode, userName) => {
  const messages = [
    `🎁 ${userName} has invited you to join Jobipo App! Referral Code: ${referralCode} - Download and win scratch cards!`,
    `💰 Earn money with Jobipo App! ${userName}'s Referral Code: ${referralCode} - Join now and earn ₹5 per referral!`,
    `🚀 Grow your business with Jobipo! Referral Code: ${referralCode} - Join with ${userName} and get rewards!`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};

// Validate phone number format
export const validatePhoneNumber = phone => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate email format
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get device ID (simplified version)
export const getDeviceId = () => {
  // In a real app, you would use a proper device ID library
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
