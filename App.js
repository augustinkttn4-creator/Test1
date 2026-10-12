import 'react-native-url-polyfill/auto';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  Modal, 
  Platform, 
  Dimensions, 
  Image, 
  Linking 
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SUPABASE_URL = 'https://gyxpqydqmjzbjqyuucst.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F500OZGnH0UK82hi1a2N_w_FLCSAT0v';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DRIVER_NAME = 'मुकेश कुमार';
const DRIVER_PHONE = '9876543210';
const DRIVER_RATING = 4.9;

const KNOWN_PLACES = {
  'न्यू मार्केट, भोपाल': { lat: 23.2315, lng: 77.4018 },
  'एमपी नगर ज़ोन 1, भोपाल': { lat: 23.2332, lng: 77.4343 },
  '10 नंबर स्टॉप, भोपाल': { lat: 23.2180, lng: 77.4260 },
  'अयोध्या बाईपास': { lat: 23.2680, lng: 77.4650 }
};

const DEFAULT_LAT = 23.2332;
const DEFAULT_LNG = 77.4343;

// ⚡ संपूर्ण द्विभाषी शब्दकोश
const STRINGS = {
  HI: {
    goOnline: 'ऑनलाइन जाएं',
    goOffline: 'गो ऑफलाइन',
    startAccepting: 'राइड रिक्वेस्ट स्वीकार करना शुरू करें',
    walletBalance: 'ड्राइवर वॉलेट बैलेंस',
    withdrawWallet: 'विड्रॉल / वॉलेट ➔',
    vehicleDetails: 'गाड़ी विवरण:',
    passStatus: 'पास स्थिति:',
    activePassText: 'सक्रिय (28 दिन शेष)',
    operatorMode: '🏢 ऑपरेटर',
    driverMode: '👨‍✈️ ड्राइवर',
    lastRide: 'अंतिम राइड',
    todayEarn: 'आज की कमाई',
    totalRide: 'कुल राइड्स',
    totalKm: 'कुल किमी',
    acceptRide: 'राइड स्वीकार करें',
    reviewDetails: 'राइड स्वीकार करने से पहले विवरण की समीक्षा करें।',
    pickupLocation: 'पिकअप स्थान',
    dropLocation: 'ड्रॉप स्थान',
    away: 'दूर',
    trip: 'यात्रा',
    estimatedTime: 'अनुमानित समय',
    fareEstimate: 'किराया अनुमान',
    rideType: 'राइड प्रकार',
    decline: '✕ अस्वीकार',
    accept: '✓ स्वीकार करें',
    waitingPrefix: 'प्रतीक्षा',
    menuTitle: 'मेन्यू',
    serviceManager: 'सर्विस मैनेजर (Service Manager)',
    serviceManagerSub: 'कैब एसी, नॉन-एसी, सेडान ऑन/ऑफ करें',
    subscriptionHistory: 'सब्स्क्रिप्शन पास और हिस्ट्री',
    subscriptionHistorySub: 'सक्रिय 0% पास व पिछले सभी पास का इतिहास',
    carDocs: 'कार के सभी दस्तावेज़',
    carDocsSub: 'DL, RC, इंश्योरेंस, फिटनेस, परमिट, PUC',
    operatorFleet: 'ऑपरेटर / फ्लीट मोड',
    operatorFleetSub: 'वर्तमान मोड बदलें',
    driverSupport: '24x7 ड्राइवर सपोर्ट',
    driverSupportSub: 'टोल-फ्री हेल्पलाइन (1800-123-4567)',
    appSettings: 'ऐप सेटिंग्स व भाषा',
    appSettingsSub: 'हिंदी / English भाषा चुनें',
    logout: 'लॉगआउट (Logout)',
    logoutSub: 'ड्राइवर खाते से बाहर निकलें',
    closeMenu: '✕ मेन्यू बंद करें',
    allOrders: 'सभी ऑर्डर्स',
    completedOrders: 'पूर्ण ऑर्डर्स',
    orderEarnings: 'ऑर्डर कमाई',
    orderHistory: 'ऑर्डर इतिहास',
    help: 'मदद (Help)',
    tripReceipt: 'यात्रा रसीद (TRIP RECEIPT)',
    close: 'समझ गया (CLOSE)',
    save: 'सेव करें (Save)',
    rideAccepted: 'राइड स्वीकार की गई',
    navToPickup: 'पिकअप की ओर नेविगेट करें',
    call: 'कॉल',
    chat: 'चैट',
    navBtn: 'पिकअप नेविगेशन',
    arrivedBtn: '📍 पिकअप पर पहुँच गया (Arrived)',
    passengerPickup: 'यात्री पिकअप',
    confirmOtp: 'OTP पुष्टि करें और शुरू करें',
    waitingTime: 'वेटिंग टाइम:',
    otpPlaceholder: 'यात्री का 4-अंकों का OTP दर्ज करें',
    cancel: '✕ कैंसिल',
    startTrip: 'यात्रा शुरू करें',
    startTripActive: '✓ शुरू करें',
    inTripTitle: 'यात्रा प्रगति पर है',
    inTripSub: 'ड्रॉप स्थान की ओर नेविगेट करें',
    dropNavBtn: '🗺️ ड्रॉप नेविगेशन चालू करें',
    completeTripBtn: '🏁 यात्रा समाप्त करें',
    duration: 'समय (अवधि)',
    distance: 'दूरी',
    totalFare: 'कुल किराया',
    ratePassenger: 'यात्री को रेटिंग दें',
    commentPlaceholder: 'कोई टिप्पणी या सुझाव लिखें...',
    doneSubmit: '✓ पूर्ण और सबमिट करें',
  },
  EN: {
    goOnline: 'GO ONLINE',
    goOffline: 'GO OFFLINE',
    startAccepting: 'Start accepting ride requests',
    walletBalance: 'Driver Wallet Balance',
    withdrawWallet: 'Withdraw / Wallet ➔',
    vehicleDetails: 'Vehicle Details:',
    passStatus: 'Pass Status:',
    activePassText: 'Active (28 days left)',
    operatorMode: '🏢 Operator',
    driverMode: '👨‍✈️ Driver',
    lastRide: 'LAST RIDE',
    todayEarn: 'TODAY EARN',
    totalRide: 'TOTAL RIDE',
    totalKm: 'TOTAL KM',
    acceptRide: 'ACCEPT RIDE',
    reviewDetails: 'Review trip details before accepting the ride.',
    pickupLocation: 'PICKUP LOCATION',
    dropLocation: 'DROP LOCATION',
    away: 'Away',
    trip: 'Trip',
    estimatedTime: 'ESTIMATED TIME',
    fareEstimate: 'FARE ESTIMATE',
    rideType: 'RIDE TYPE',
    decline: '✕ DECLINE',
    accept: '✓ ACCEPT',
    waitingPrefix: 'Wait',
    menuTitle: 'Menu',
    serviceManager: 'Service Manager',
    serviceManagerSub: 'Toggle Cab AC, Non-AC, Sedan',
    subscriptionHistory: 'Subscription Pass & History',
    subscriptionHistorySub: 'Active 0% pass & purchase history',
    carDocs: 'Vehicle Documents',
    carDocsSub: 'DL, RC, Insurance, Fitness, Permit, PUC',
    operatorFleet: 'Operator / Fleet Mode',
    operatorFleetSub: 'Switch operational role',
    driverSupport: '24x7 Driver Support',
    driverSupportSub: 'Toll-free helpline (1800-123-4567)',
    appSettings: 'App Settings & Language',
    appSettingsSub: 'Choose Hindi / English language',
    logout: 'Logout',
    logoutSub: 'Sign out from driver account',
    closeMenu: '✕ Close Menu',
    allOrders: 'All Orders',
    completedOrders: 'Completed Orders',
    orderEarnings: 'Order Earnings',
    orderHistory: 'Order History',
    help: 'Help',
    tripReceipt: 'TRIP RECEIPT',
    close: 'CLOSE',
    save: 'Save',
    rideAccepted: 'RIDE ACCEPTED',
    navToPickup: 'NAVIGATE TO PICKUP',
    call: 'Call',
    chat: 'Chat',
    navBtn: 'Pickup Navigation',
    arrivedBtn: '📍 Arrived at Pickup',
    passengerPickup: 'PASSENGER PICKUP',
    confirmOtp: 'CONFIRM OTP & START',
    waitingTime: 'WAITING TIME:',
    otpPlaceholder: "Enter passenger's 4-digit OTP",
    cancel: '✕ Cancel',
    startTrip: 'Start Trip',
    startTripActive: '✓ Start Now',
    inTripTitle: 'TRIP IN PROGRESS',
    inTripSub: 'NAVIGATE TO DROP',
    dropNavBtn: '🗺️ Start Drop Navigation',
    completeTripBtn: '🏁 Complete Trip',
    duration: 'DURATION',
    distance: 'DISTANCE',
    totalFare: 'TOTAL FARE',
    ratePassenger: 'Rate Passenger',
    commentPlaceholder: 'Write feedback or notes...',
    doneSubmit: '✓ DONE & SUBMIT',
  }
};

/* =========================================================================
   ⚡ ALL STYLES (Scope ReferenceError से सुरक्षा के लिए सबसे ऊपर)
   ========================================================================= */
const regStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 36 },
  devBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, backgroundColor: '#f1f5f9', padding: 8, borderRadius: 10 },
  devBtn: { backgroundColor: '#0f172a', padding: 6, borderRadius: 6 },
  devBtnText: { color: '#eab308', fontSize: 11, fontWeight: 'bold' },
  devBtnSkip: { backgroundColor: '#e2e8f0', padding: 6, borderRadius: 6 },
  devBtnSkipText: { color: '#0f172a', fontSize: 11, fontWeight: 'bold' },
  headerSection: { marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subTitle: { fontSize: 12, color: '#64748b', marginTop: 6 },
  profileUploadWrapper: { alignItems: 'center', marginBottom: 22 },
  profileUploadLabel: { fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0' },
  avatarImage: { width: '100%', height: '100%' },
  formContainer: { gap: 12, marginBottom: 26 },
  inputCard: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 14, padding: 12, backgroundColor: '#ffffff' },
  inputCardVerified: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: '#64748b' },
  textInput: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginTop: 4 },
  labelWithActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifiedBadgeContainer: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  verifiedCheckText: { color: '#16a34a', fontSize: 10, fontWeight: '900' },
  inlineActionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  sendOtpActionBtn: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  sendOtpActionText: { color: '#eab308', fontSize: 11, fontWeight: 'bold' },
  verifyDlActionBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  verifyDlActionText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  inlineOtpWrapper: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  inlineOtpPrompt: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 },
  inlineOtpInput: { width: 140, height: 40, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#eab308', borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: '900' },
  docUploadSection: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: '#e2e8f0' },
  docUploadSectionTitle: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 8 },
  docUploadRow: { flexDirection: 'row', gap: 10 },
  docUploadTile: { flex: 1, borderWidth: 1.5, borderColor: '#cbd5e1', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: '#f8fafc' },
  docUploadTileSuccess: { borderColor: '#10b981', borderStyle: 'solid', backgroundColor: '#ecfdf5' },
  docTileIcon: { fontSize: 20, marginBottom: 4 },
  docTileLabel: { fontSize: 11, fontWeight: '800', color: '#0f172a' },
  continueButton: { backgroundColor: '#eab308', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  continueButtonDisabled: { backgroundColor: '#e2e8f0' },
  continueButtonText: { color: '#0f172a', fontSize: 15, fontWeight: '900' },
  continueButtonTextDisabled: { color: '#94a3b8' },
  continueArrowBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  continueArrowBoxDisabled: { backgroundColor: '#94a3b8' },
  continueArrowText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' }
});

const ordersStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  headerLeftGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 32, height: 32, justifyContent: 'center' },
  backArrowText: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  headerTitleText: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  helpButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#0f172a', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  helpIconText: { fontSize: 14 },
  helpButtonText: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  periodSwitcherWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  periodSwitcherContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 3 },
  periodTabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  periodTabBtnActive: { backgroundColor: '#eab308' },
  periodTabText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  periodTabTextActive: { color: '#0f172a', fontWeight: '900' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 36 },
  carouselRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  carouselArrowBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  arrowIconText: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  carouselPillsGroup: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  pillWithDotWrapper: { alignItems: 'center' },
  carouselPill: { minWidth: 54, height: 44, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  carouselPillActive: { backgroundColor: '#064e3b' },
  carouselPillText: { fontSize: 11, fontWeight: '800', color: '#475569', textAlign: 'center', lineHeight: 14 },
  carouselPillTextActive: { color: '#ffffff' },
  activePillDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#10b981', marginTop: 4 },
  statsSummaryCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1.5, borderColor: '#e2e8f0', paddingVertical: 16, paddingHorizontal: 20, marginBottom: 20, elevation: 2 },
  statsColumn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statsBigNumber: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  statsSubLabel: { fontSize: 12, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  statsDividerVert: { width: 1, height: '70%', backgroundColor: '#e2e8f0', alignSelf: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  historyFilterRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  filterPillBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9' },
  filterPillBtnActive: { backgroundColor: '#fef08a' },
  filterPillText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  filterPillTextActive: { color: '#0f172a', fontWeight: '900' },
  historyDateBlueHeader: { fontSize: 14, fontWeight: '900', color: '#1e3a8a', marginBottom: 12 },
  rideCard: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1.5, borderColor: '#e2e8f0', padding: 14, marginBottom: 12, elevation: 2 },
  rideCardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  rideTypeWithTime: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rideTypeName: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  rideDotSeparator: { fontSize: 12, color: '#94a3b8' },
  rideTimeText: { fontSize: 13, fontWeight: '800', color: '#334155' },
  rideFareGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rideFareAmount: { fontSize: 18, fontWeight: '900', color: '#047857' },
  greenCheckBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  greenCheckIcon: { fontSize: 11, fontWeight: '900', color: '#ffffff' },
  rideRouteContainer: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10 },
  routeIndicatorColumn: { alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 4 },
  greenRouteDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#10b981' },
  dottedConnectorLine: { width: 2, height: 24, backgroundColor: '#cbd5e1', marginVertical: 3 },
  redRouteDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#ef4444' },
  routeAddressColumn: { flex: 1 },
  // ⚡ गहरा और बड़ा टेक्स्ट (Darker and Bolder text)
  routeAddressText: { fontSize: 13.5, fontWeight: '800', color: '#0f172a', lineHeight: 18 }
});

const billStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'flex-end' },
  billCardContainer: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' },
  billHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 10 },
  billTitleText: { fontSize: 17, fontWeight: '900', color: '#0f172a' },
  billOrderIdText: { fontSize: 12, fontWeight: '800', color: '#475569', marginTop: 2 },
  closeCircleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  closeCrossText: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  totalAmountHighlightBox: { backgroundColor: '#f0fdf4', borderWidth: 1.5, borderColor: '#86efac', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16 },
  totalAmountLabel: { fontSize: 12, fontWeight: '900', color: '#166534' },
  totalAmountValue: { fontSize: 34, fontWeight: '900', color: '#15803d', marginVertical: 4 },
  tripMetricRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 14 },
  metricCol: { flex: 1, alignItems: 'center' },
  metricLabelSmall: { fontSize: 11, fontWeight: '800', color: '#64748b' },
  metricValBig: { fontSize: 15, fontWeight: '900', color: '#0f172a', marginTop: 3 },
  metricDivider: { width: 1, height: '70%', backgroundColor: '#cbd5e1', alignSelf: 'center' },
  routeBox: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 14, padding: 14, marginBottom: 14 },
  routeAddressText: { fontSize: 13.5, fontWeight: '800', color: '#0f172a', lineHeight: 20 },
  receiptHelpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0'
  },
  receiptHelpBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0f172a'
  },
  doneButton: { backgroundColor: '#eab308', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#ca8a04' },
  doneButtonText: { fontSize: 14, fontWeight: '900', color: '#0f172a' }
});

const walletStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContainer: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#F3F4F6' },
  backButton: { width: 36, height: 36, justifyContent: 'center' },
  backArrow: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  headerTitle: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  balanceCard: { borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 2 },
  cardPositive: { backgroundColor: '#FDE047' },
  cardNegative: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5' },
  balanceHeaderTitle: { fontSize: 11, fontWeight: '700', color: '#713F12', letterSpacing: 0.8, marginBottom: 4 },
  balanceAmount: { fontSize: 28, fontWeight: 'bold', marginBottom: 2 },
  balanceSubText: { fontSize: 12, color: '#854D0E', textAlign: 'center', marginBottom: 12 },
  actionButtonRecharge: { width: '100%', height: 44, backgroundColor: '#DC2626', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  actionButtonWithdraw: { width: '100%', height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  actionButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }
});

const serviceHelpPopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10
  },
  bulbCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8
  },
  messageText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20
  },
  closeBtn: {
    width: '100%',
    backgroundColor: '#fef3c7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  closeBtnText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '900'
  }
});

const supportIssueStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9'
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backBtnText: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginLeft: 8 },
  headingBanner: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0'
  },
  issueTitleBig: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 22
  },
  bodyContent: {
    padding: 18
  },
  descParagraph: {
    fontSize: 13.5,
    color: '#1e293b',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16
  },
  helpBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  helpBoxLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  voteRow: {
    flexDirection: 'row',
    gap: 16
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  voteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569'
  },
  callSupportBtn: {
    backgroundColor: '#eab308',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3
  },
  callSupportText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900'
  }
});

const menuStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  drawerContainer: { width: '82%', maxWidth: 320, backgroundColor: '#ffffff', height: '100%', padding: 18, justifyContent: 'space-between', elevation: 16 },
  profileHeaderBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 14, borderRadius: 16, marginBottom: 10 },
  avatarLargeCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  profileNameText: { fontSize: 16, fontWeight: '900', color: '#ffffff' },
  profilePhoneText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  ratingTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  ratingTagText: { fontSize: 11, fontWeight: '900', color: '#eab308' },
  vehicleNoText: { fontSize: 11, color: '#38bdf8', fontWeight: 'bold' },
  menuRowItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  menuIconSquare: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  menuItemTitle: { fontSize: 13.5, fontWeight: '900', color: '#0f172a' },
  menuItemSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  arrowGray: { fontSize: 13, color: '#cbd5e1', fontWeight: 'bold' },
  closeDrawerBtn: { backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  closeDrawerBtnText: { color: '#0f172a', fontSize: 13, fontWeight: '900' }
});

const modalStyles = StyleSheet.create({
  subPageContainer: { flex: 1, backgroundColor: '#ffffff' },
  subPageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  backCircleBtn: { width: 36, height: 36, justifyContent: 'center' },
  backCircleText: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subPageHeaderTitle: { fontSize: 17, fontWeight: '900', color: '#0f172a' },
  headerHelpBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#0f172a', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  headerHelpText: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  serviceManagerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fefce8', borderRadius: 16, borderWidth: 1.5, borderColor: '#fde047', padding: 14, marginBottom: 12 },
  serviceCarYellowCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center' },
  serviceNameText: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  serviceDescText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  serviceActiveBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  serviceActiveText: { color: '#16a34a', fontSize: 12, fontWeight: '900' },
  serviceHintBox: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 10 },
  serviceHintTitle: { fontSize: 12.5, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  serviceHintText: { fontSize: 11.5, color: '#64748b', lineHeight: 16 },
  activePassBigCard: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, marginBottom: 20 },
  passHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  activePillTag: { backgroundColor: '#065f46', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activePillText: { color: '#a7f3d0', fontSize: 10.5, fontWeight: '900' },
  passPriceTag: { color: '#facc15', fontSize: 22, fontWeight: '900' },
  passMainHeading: { fontSize: 16, fontWeight: '900', color: '#ffffff', marginBottom: 14 },
  passDateGrid: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 12, padding: 12, justifyContent: 'space-between', marginBottom: 14 },
  passDateItem: { alignItems: 'center' },
  passDateLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 3 },
  passDateVal: { fontSize: 12, fontWeight: '800', color: '#ffffff' },
  renewPassActionBtn: { backgroundColor: '#eab308', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  renewPassActionText: { color: '#0f172a', fontSize: 13, fontWeight: '900' },
  historySectionHeading: { fontSize: 14, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
  historyItemCard: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1.5, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  historyItemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  historyPlanTitle: { fontSize: 13.5, fontWeight: '900', color: '#0f172a' },
  historyDateText: { fontSize: 10.5, color: '#94a3b8', marginTop: 2 },
  historyAmountText: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  historyStatusText: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  historyTxnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderColor: '#f1f5f9' },
  historyTxnText: { fontSize: 10, color: '#64748b' },
  downloadReceiptLink: { fontSize: 11, fontWeight: 'bold', color: '#0284c7' },
  docsBanner: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  docsBannerTitle: { fontSize: 13.5, fontWeight: '900', color: '#0f172a', marginBottom: 3 },
  docsBannerSub: { fontSize: 11, color: '#64748b', lineHeight: 16 },
  docRowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1.5, borderColor: '#e2e8f0', padding: 12, marginBottom: 10 },
  docIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  docSub: { fontSize: 10.5, color: '#64748b', marginTop: 2 },
  docStatusBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5 },
  statusBtnVerified: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  statusBtnPending: { backgroundColor: '#fef9c3', borderColor: '#fde047' },
  statusBtnUpload: { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' },
  docStatusText: { fontSize: 11, fontWeight: '900' },
  doneBtn: { backgroundColor: '#eab308', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  doneBtnText: { fontSize: 14, fontWeight: '900', color: '#0f172a' },
  langOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12
  },
  langOptionCardActive: {
    borderColor: '#eab308',
    backgroundColor: '#fefce8'
  },
  langTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a'
  },
  langSubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#eab308'
  },
  settingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  }
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  cleanOfflineScroll: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  topNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  hamburgerBtn: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, backgroundColor: '#ffffff' },
  hamburgerIcon: { fontSize: 20, color: '#0f172a', fontWeight: 'bold' },
  operatorTopBtn: { backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  operatorTopBtnText: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  searchQuickBtn: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  zeroCommBadge: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  zeroCommText: { color: '#0f172a', fontSize: 10, fontWeight: '900' },
  driverHeroBanner: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  fullHeroImg: { width: '100%', height: '100%' },
  compactGoOnlineBtn: { backgroundColor: '#eab308', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: '#ca8a04' },
  arrowDarkBox: { width: 38, height: 38, backgroundColor: '#064e3b', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  arrowSign: { color: '#a7f3d0', fontSize: 18, fontWeight: 'bold' },
  onlineMainTitle: { fontSize: 16, fontWeight: '900', color: '#064e3b' },
  onlineSubTitleText: { fontSize: 10, color: '#047857', fontWeight: '700' },
  readyBadgePill: { backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  readyBadgeText: { color: '#a7f3d0', fontSize: 9, fontWeight: '900' },
  offlineVehiclePassBox: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 10 },
  walletBoxHighlighted: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: '#e2e8f0' },
  walletIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  walletLabelTitle: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  walletDriverNameTag: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  walletAmountVal: { fontSize: 16, fontWeight: '900', color: '#16a34a' },
  walletAddCashText: { fontSize: 10, fontWeight: 'bold', color: '#0284c7' },
  ovRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ovLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  ovVal: { fontSize: 13, color: '#0f172a', fontWeight: 'bold' },
  ovPassVal: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },

  mapScreenContainer: { flex: 1, position: 'relative', backgroundColor: '#090d16' },
  mapCanvasWrapper: { ...StyleSheet.absoluteFillObject },
  webMapIframe: { width: '100%', height: '100%', border: 'none' },
  mobileMapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  screen2TopNavRow: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    zIndex: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  screen2HamburgerBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 4
  },
  screen2OfflineBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    elevation: 6
  },
  screen2InboxBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    position: 'relative',
    elevation: 4
  },
  yellowDotSmall: {
    width: 8,
    height: 8,
    backgroundColor: '#eab308',
    borderRadius: 4,
    position: 'absolute',
    top: 6,
    right: 6
  },

  redOfflineText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  topRightGpsFab: { position: 'absolute', top: 75, right: 16, width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#cbd5e1', zIndex: 30, elevation: 6 },
  leftMetricsContainer: { position: 'absolute', top: 75, left: 12, zIndex: 25, gap: 8 },
  metricBoxCard: { width: 104, backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center', borderWidth: 1.5, borderColor: '#eab308', elevation: 4 },
  metricLabelTop: { fontSize: 11, fontWeight: '900', color: '#0f172a', marginBottom: 2 },
  metricValMain: { fontSize: 17, fontWeight: '900', color: '#0f172a' },

  // ⚡ इमेज 3 अनुसार बड़ा व विस्तृत एक्सेप्ट कार्ड (Enlarged & Detailed Accept Card)
  fixedBottomCardWrapperClean: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    right: 10,
    zIndex: 40
  },
  exactImageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    elevation: 12
  },
  exactCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  exactCardTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  exactCardSubTitle: { fontSize: 12, color: '#475569', fontWeight: '700', marginTop: 2 },
  exactCardRideId: { fontSize: 13, fontWeight: '900', color: '#334155' },
  exactCardDriverName: { fontSize: 11.5, color: '#64748b', fontWeight: 'bold', marginTop: 1 },
  exactLocationCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12
  },
  exactLocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  locRowLeftPart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1
  },
  greenCircleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981', marginTop: 4 },
  redCircleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444', marginTop: 4 },
  locSmallTag: { fontSize: 10, fontWeight: '900', color: '#64748b' },
  // ⚡ 2-3 लाइन का पूरा विस्तृत पता
  locNameBold: { fontSize: 13.5, fontWeight: '900', color: '#0f172a', marginTop: 2, lineHeight: 18 },
  kmBoldText: { fontSize: 13.5, fontWeight: '900', color: '#0f172a' },
  kmSubText: { fontSize: 10, color: '#64748b', fontWeight: '800' },
  verticalDottedDividerShort: { width: 2, height: 18, backgroundColor: '#cbd5e1', marginLeft: 5, marginVertical: 4 },
  exactMetaDetailsBox: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#f8fafc'
  },
  metaDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  metaLeftGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaLabelText: { fontSize: 12, fontWeight: '800', color: '#334155' },
  metaValueText: { fontSize: 13.5, fontWeight: '900', color: '#0f172a' },
  metaRowLine: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 3 },
  exactButtonsRow: { flexDirection: 'row', gap: 10 },
  exactDeclineBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  exactDeclineBtnText: { color: '#0f172a', fontSize: 13.5, fontWeight: '900' },
  exactAcceptBtn: {
    flex: 1.4,
    backgroundColor: '#eab308',
    borderWidth: 1.5,
    borderColor: '#ca8a04',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exactAcceptBtnText: { color: '#0f172a', fontSize: 14, fontWeight: '900' },

  tripFlowContainer: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'space-between' },
  flowMapCard: {
    height: '34%',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative'
  },
  mapBadgeHeader: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: '#0f172a',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  mapBadgeText: { color: '#38bdf8', fontSize: 10.5, fontWeight: 'bold' },
  floatingSosBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 4
  },
  floatingSosText: { color: '#ffffff', fontSize: 11, fontWeight: '900' },

  flowBottomCardCompact: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    elevation: 6
  },
  flowHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  flowTitleBlack: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  flowSubTitleYellow: { fontSize: 14, fontWeight: '900', color: '#eab308' },
  flowIdText: { fontSize: 11.5, fontWeight: '900', color: '#475569' },
  flowDriverText: { fontSize: 10.5, color: '#94a3b8', fontWeight: 'bold' },
  flowLocationBoxCompact: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 8, marginBottom: 8 },
  flowLocItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flowMetaBoxCompact: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 8, backgroundColor: '#f8fafc' },
  flowActionRowThree: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  greenSquareBtn: { width: 46, height: 44, backgroundColor: '#10b981', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  blueSquareBtn: { width: 46, height: 44, backgroundColor: '#0284c7', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  squareBtnText: { color: '#ffffff', fontSize: 9.5, fontWeight: '900' },
  navPickupWideBtn: { flex: 1, backgroundColor: '#0284c7', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  navPickupBtnText: { color: '#ffffff', fontSize: 12.5, fontWeight: '900' },
  arrivedYellowFullBtn: { backgroundColor: '#eab308', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#ca8a04' },
  arrivedYellowBtnText: { color: '#0f172a', fontSize: 13.5, fontWeight: '900' },

  waitingTimeBoxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  waitingTimeTitle: { fontSize: 11.5, fontWeight: '700', color: '#475569' },
  waitingTimeDigits: { fontSize: 13, fontWeight: '900', color: '#ca8a04' },
  otpInputYellowBorder: { borderWidth: 1.5, borderColor: '#eab308', borderRadius: 10, paddingVertical: 8, textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, backgroundColor: '#ffffff' },
  arrivedActionsRow: { flexDirection: 'row', gap: 6 },
  redCancelBtn: { borderWidth: 1.5, borderColor: '#ef4444', backgroundColor: '#fef2f2', paddingHorizontal: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: 44 },
  redCancelBtnText: { color: '#ef4444', fontSize: 11, fontWeight: '900' },
  startTripGoldBtn: { flex: 1, backgroundColor: '#eab308', borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: 44, borderWidth: 1.5, borderColor: '#ca8a04' },
  startTripGoldBtnText: { color: '#0f172a', fontSize: 13, fontWeight: '900' },
  mainNavButton: { backgroundColor: '#0284c7', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  mainNavButtonText: { color: '#ffffff', fontSize: 12.5, fontWeight: '900' },

  completedPassengerCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 8, marginBottom: 8 },
  passengerAvatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  compPassengerName: { fontSize: 14, fontWeight: '900', color: '#0f172a' },
  compPassengerStar: { fontSize: 11.5, fontWeight: '900', color: '#ca8a04' },
  completedMetricsThreeCol: { flexDirection: 'row', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, paddingVertical: 8, backgroundColor: '#f8fafc', marginBottom: 8 },
  compMetricCol: { flex: 1, alignItems: 'center' },
  compMetricLabel: { fontSize: 8.5, fontWeight: '800', color: '#64748b' },
  compMetricValue: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginVertical: 1 },
  compMetricUnit: { fontSize: 9.5, color: '#94a3b8', fontWeight: 'bold' },
  compMetricDivider: { width: 1, height: '70%', backgroundColor: '#e2e8f0', alignSelf: 'center' },
  ratingFormCard: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 10, alignItems: 'center', marginBottom: 8 },
  ratingBoxHeading: { fontSize: 12.5, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  starIconText: { fontSize: 24 },
  commentInputBox: { width: '100%', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 11.5, color: '#0f172a' },
  compDoneSubmitBtn: { backgroundColor: '#eab308', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#ca8a04' },
  compDoneSubmitText: { color: '#0f172a', fontSize: 13, fontWeight: '900' }
});

/* =========================================================================
   COMPONENTS
   ========================================================================= */
function DriverRegistrationScreen({ onRegistrationSuccess, onSkip, lang }) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [dlNumber, setDlNumber] = useState('');
  const [isVerifyingDl, setIsVerifyingDl] = useState(false);
  const [isDlVerified, setIsDlVerified] = useState(false);
  const [dlFront, setDlFront] = useState(null);
  const [dlBack, setDlBack] = useState(null);
  const [profileImageUri, setProfileImageUri] = useState(null);

  const handleAutoFill = () => {
    const dummyImg = 'https://i.postimg.cc/3NrrvGjR/IMG-20261008-WA0000.jpg';
    setFullName('मुकेश कुमार');
    setMobileNumber('9876543210');
    setDob('15/05/1992');
    setIdNumber('[Aadhaar Redacted]');
    setIsAadhaarVerified(true);
    setAadhaarFront(dummyImg);
    setAadhaarBack(dummyImg);
    setDlNumber('MP0420200012345');
    setIsDlVerified(true);
    setDlFront(dummyImg);
    setDlBack(dummyImg);
    setProfileImageUri(dummyImg);
    Alert.alert('ऑटो-फिल सफल', 'सभी फ़ील्ड्स और दस्तावेज़ भर दिए गए हैं।');
  };

  const handlePickDocument = (type) => {
    const dummyImageUri = 'https://i.postimg.cc/3NrrvGjR/IMG-20261008-WA0000.jpg';
    if (type === 'aadhaar_front') { setAadhaarFront(dummyImageUri); if (!profileImageUri) setProfileImageUri(dummyImageUri); }
    if (type === 'aadhaar_back') setAadhaarBack(dummyImageUri);
    if (type === 'dl_front') { setDlFront(dummyImageUri); setProfileImageUri(dummyImageUri); }
    if (type === 'dl_back') setDlBack(dummyImageUri);
    Alert.alert('फ़ोटो अपलोड', 'दस्तावेज़ लोड हो गया है।');
  };

  const handleSendAadhaarOtp = () => {
    if (idNumber.trim().length !== 12 && idNumber !== '[Aadhaar Redacted]') {
      return Alert.alert('अमान्य संख्या', 'कृपया 12 अंकों का आधार नंबर दर्ज करें।');
    }
    setIsSendingOtp(true);
    setTimeout(() => { 
      setIsSendingOtp(false); 
      setOtpSent(true); 
      Alert.alert('OTP भेजा गया', 'टेस्ट OTP: 1234 दर्ज करें।'); 
    }, 1000);
  };

  const handleOtpChange = (text) => {
    setOtpValue(text);
    if (text.length === 4) {
      if (text === '1234') setIsAadhaarVerified(true);
      else { Alert.alert('गलत OTP', 'कृपया सही कोड दर्ज करें।'); setOtpValue(''); }
    }
  };

  const handleVerifyDrivingLicense = async () => {
    if (!dob.trim()) return Alert.alert('जन्मतिथि आवश्यक', 'लाइसेंस सत्यापन के लिए पहले जन्मतिथि दर्ज करें।');
    const cleanDl = dlNumber.trim().toUpperCase();
    if (cleanDl.length < 10) return Alert.alert('अमान्य DL', 'कृपया पूरा ड्राइविंग लाइसेंस नंबर दर्ज करें।');

    setIsVerifyingDl(true);
    setTimeout(() => { 
      setIsVerifyingDl(false); 
      setIsDlVerified(true); 
      Alert.alert('सत्यापन सफल!', 'ड्राइविंग लाइसेंस सत्यापित हो गया है।'); 
    }, 800);
  };

  const isFormComplete = Boolean(fullName.trim() && mobileNumber.trim().length === 10 && isAadhaarVerified && isDlVerified);

  return (
    <SafeAreaView style={regStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={regStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={regStyles.devBarRow}>
          <TouchableOpacity style={regStyles.devBtn} onPress={handleAutoFill}>
            <Text style={regStyles.devBtnText}>⚡ 1-Click Auto Fill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={regStyles.devBtnSkip} onPress={onSkip}>
            <Text style={regStyles.devBtnSkipText}>स्किप ➔ डैशबोर्ड</Text>
          </TouchableOpacity>
        </View>

        <View style={regStyles.headerSection}>
          <Text style={regStyles.mainTitle}>PERSONAL INFORMATION</Text>
          <Text style={regStyles.subTitle}>Please provide your personal details to verify your account.</Text>
        </View>

        <View style={regStyles.profileUploadWrapper}>
          <Text style={regStyles.profileUploadLabel}>Profile Photo (Auto from Document)</Text>
          <View style={regStyles.avatarCircle}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={regStyles.avatarImage} />
            ) : (
              <Text style={{ fontSize: 44 }}>👨‍✈️</Text>
            )}
          </View>
        </View>

        <View style={regStyles.formContainer}>
          <View style={regStyles.inputCard}>
            <Text style={regStyles.fieldLabel}>👤 Full Name *</Text>
            <TextInput style={regStyles.textInput} placeholder="Enter your full name" placeholderTextColor="#94a3b8" value={fullName} onChangeText={setFullName} />
          </View>
          <View style={regStyles.inputCard}>
            <Text style={regStyles.fieldLabel}>📞 Mobile Number *</Text>
            <TextInput style={regStyles.textInput} placeholder="Enter 10-digit mobile number" placeholderTextColor="#94a3b8" keyboardType="phone-pad" maxLength={10} value={mobileNumber} onChangeText={setMobileNumber} />
          </View>
          <View style={regStyles.inputCard}>
            <Text style={regStyles.fieldLabel}>📅 Date of Birth *</Text>
            <TextInput style={regStyles.textInput} placeholder="DD / MM / YYYY" placeholderTextColor="#94a3b8" value={dob} onChangeText={setDob} />
          </View>

          <View style={[regStyles.inputCard, isAadhaarVerified && regStyles.inputCardVerified]}>
            <View style={regStyles.labelWithActionRow}>
              <Text style={regStyles.fieldLabel}>🪪 आधार वेरिफिकेशन *</Text>
              {isAadhaarVerified && <View style={regStyles.verifiedBadgeContainer}><Text style={regStyles.verifiedCheckText}>✓ VERIFIED</Text></View>}
            </View>
            <View style={regStyles.inlineActionRow}>
              <TextInput style={[regStyles.textInput, { flex: 1 }]} placeholder="Enter 12-digit number" placeholderTextColor="#94a3b8" keyboardType="numeric" maxLength={12} secureTextEntry={true} editable={!isAadhaarVerified} value={idNumber} onChangeText={setIdNumber} />
              {!isAadhaarVerified && (
                <TouchableOpacity style={regStyles.sendOtpActionBtn} onPress={handleSendAadhaarOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? <ActivityIndicator size="small" color="#eab308" /> : <Text style={regStyles.sendOtpActionText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>}
                </TouchableOpacity>
              )}
            </View>
            {otpSent && !isAadhaarVerified && (
              <View style={regStyles.inlineOtpWrapper}>
                <Text style={regStyles.inlineOtpPrompt}>Enter 4-digit OTP:</Text>
                <TextInput autoFocus={true} keyboardType="numeric" maxLength={4} onChangeText={handleOtpChange} placeholder="• • • •" placeholderTextColor="#cbd5e1" style={regStyles.inlineOtpInput} value={otpValue} />
              </View>
            )}
            <View style={regStyles.docUploadSection}>
              <Text style={regStyles.docUploadSectionTitle}>आधार कार्ड फ़ोटो अपलोड करें: *</Text>
              <View style={regStyles.docUploadRow}>
                <TouchableOpacity style={[regStyles.docUploadTile, aadhaarFront && regStyles.docUploadTileSuccess]} onPress={() => handlePickDocument('aadhaar_front')}>
                  <Text style={regStyles.docTileIcon}>{aadhaarFront ? '✅' : '📤'}</Text><Text style={regStyles.docTileLabel}>फ़्रंट साइड</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[regStyles.docUploadTile, aadhaarBack && regStyles.docUploadTileSuccess]} onPress={() => handlePickDocument('aadhaar_back')}>
                  <Text style={regStyles.docTileIcon}>{aadhaarBack ? '✅' : '📤'}</Text><Text style={regStyles.docTileLabel}>बैक साइड</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[regStyles.inputCard, isDlVerified && regStyles.inputCardVerified]}>
            <View style={regStyles.labelWithActionRow}>
              <Text style={regStyles.fieldLabel}>🚗 ड्राइविंग लाइसेंस *</Text>
              {isDlVerified && <View style={regStyles.verifiedBadgeContainer}><Text style={regStyles.verifiedCheckText}>✓ VERIFIED</Text></View>}
            </View>
            <View style={regStyles.inlineActionRow}>
              <TextInput style={[regStyles.textInput, { flex: 1 }]} placeholder="DL Number (e.g. MP0420200012345)" placeholderTextColor="#94a3b8" autoCapitalize="characters" editable={!isDlVerified} value={dlNumber} onChangeText={setDlNumber} />
              {!isDlVerified && (
                <TouchableOpacity style={regStyles.verifyDlActionBtn} onPress={handleVerifyDrivingLicense} disabled={isVerifyingDl}>
                  {isVerifyingDl ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={regStyles.verifyDlActionText}>Verify DL</Text>}
                </TouchableOpacity>
              )}
            </View>
            <View style={regStyles.docUploadSection}>
              <Text style={regStyles.docUploadSectionTitle}>लाइसेंस फ़ोटो अपलोड करें: *</Text>
              <View style={regStyles.docUploadRow}>
                <TouchableOpacity style={[regStyles.docUploadTile, dlFront && regStyles.docUploadTileSuccess]} onPress={() => handlePickDocument('dl_front')}>
                  <Text style={regStyles.docTileIcon}>{dlFront ? '✅' : '📤'}</Text><Text style={regStyles.docTileLabel}>फ़्रंट साइड</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[regStyles.docUploadTile, dlBack && regStyles.docUploadTileSuccess]} onPress={() => handlePickDocument('dl_back')}>
                  <Text style={regStyles.docTileIcon}>{dlBack ? '✅' : '📤'}</Text><Text style={regStyles.docTileLabel}>बैक साइड</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[regStyles.continueButton, !isFormComplete && regStyles.continueButtonDisabled]} disabled={!isFormComplete} onPress={() => onRegistrationSuccess({ fullName, mobileNumber, profileImageUri })}>
          <Text style={[regStyles.continueButtonText, !isFormComplete && regStyles.continueButtonTextDisabled]}>CONTINUE</Text>
          <View style={[regStyles.continueArrowBox, !isFormComplete && regStyles.continueArrowBoxDisabled]}><Text style={regStyles.continueArrowText}>➔</Text></View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================================
   2. ORDERS HISTORY SCREEN
   ========================================================================= */
function OrdersHistoryScreen({ onBack, lang }) {
  const t = STRINGS[lang];
  const [activePeriod, setActivePeriod] = useState('Day');
  const [selectedItemIndex, setSelectedItemIndex] = useState(2);
  const [orderStatusFilter, setOrderStatusFilter] = useState('Completed');
  const [selectedRideForBill, setSelectedRideForBill] = useState(null);

  // ⚡ रसीद से तुरंत खुलने वाला सपोर्ट स्क्रीन स्टेट (अब यह स्क्रीन के अंदर ही मौजूद है)
  const [innerSupportView, setInnerSupportView] = useState(null);

  const periodData = {
    Day: {
      carousel: [
        { id: 'd1', label: 'Wed\n7', fullDate: '07 October, 2026' },
        { id: 'd2', label: 'Thu\n8', fullDate: '08 October, 2026' },
        { id: 'd3', label: 'Fri\n9', fullDate: '09 October, 2026' },
      ],
      completedOrders: 3,
      earnings: 440,
      rides: [
        { id: '89421', type: 'Cab Non AC', icon: '☀️', time: '5:18 pm', fare: 112, distance: '3.8', duration: '14 min', pickup: '24, Roshanpura Road, Roshanpura, Malviya Nagar, Bhopal, MP 462003', drop: 'Kamdhenu Tower, L-3, E-2/21, Habib Ganj, Bhopal, MP 462016' },
        { id: '89420', type: 'Cab AC', icon: '☀️', time: '3:20 pm', fare: 219, distance: '7.4', duration: '22 min', pickup: 'Regal Kalash Phase-III, 10, Awadhpuri, Bhopal, MP 462022', drop: 'Plot No: 2, New Market, STT Nagar, TT Nagar, Bhopal, MP 462001' },
        { id: '89419', type: 'Prime Sedan', icon: '☀️', time: '11:45 am', fare: 109, distance: '3.5', duration: '12 min', pickup: 'MP Nagar Zone 1, Near DB Mall, Bhopal, MP 462011', drop: 'Bittan Market, E-5 Arera Colony, Bhopal, MP 462016' }
      ]
    },
    Week: {
      carousel: [
        { id: 'w1', label: 'Sep\n21-27', fullDate: '21 Sep - 27 Sep, 2026' },
        { id: 'w2', label: 'Sep-Oct\n28-04', fullDate: '28 Sep - 04 Oct, 2026' },
        { id: 'w3', label: 'Oct\n05-11', fullDate: '05 Oct - 11 Oct, 2026' },
      ],
      completedOrders: 10,
      earnings: 1548,
      rides: [
        { id: '88210', type: 'Cab Non AC', icon: '🌙', time: '7:48 pm', fare: 71, distance: '2.4', duration: '09 min', pickup: 'Shri Niwas, Avinash Nagar, Bhopal, MP 462022', drop: '469/9A, Railway Colony, Habib Ganj, Bhopal, MP 462024' },
        { id: '88209', type: 'Cab AC', icon: '☀️', time: '4:59 pm', fare: 304, distance: '10.2', duration: '31 min', pickup: 'Globus City, Chuna Bhatti, Kolar Road, Bhopal, MP 462016', drop: '437 Abbas Nagar, Airport Rd, Raja Bhoj Airport Area, Bhopal' }
      ]
    },
    Month: {
      carousel: [
        { id: 'm1', label: 'Aug', fullDate: 'August 2026' },
        { id: 'm2', label: 'Sep', fullDate: 'September 2026' },
        { id: 'm3', label: 'Oct', fullDate: 'October 2026' },
      ],
      completedOrders: 21,
      earnings: 3522,
      rides: [
        { id: '87102', type: 'Prime Sedan', icon: '☀️', time: '5:33 pm', fare: 305, distance: '11.5', duration: '34 min', pickup: 'Gate No 1, Rani Kamlapati Railway Station, Platform 1, Bhopal', drop: '437 Abbas Nagar, Airport Rd, Raja Bhoj Airport Area, Bhopal' },
        { id: '87101', type: 'Cab AC', icon: '☀️', time: '4:58 pm', fare: 104, distance: '3.2', duration: '11 min', pickup: 'BPCL Housing Complex, Narmadapuram Rd, Bhopal', drop: '14, Narmadapuram Rd, E-2, Arera Colony, Bhopal, MP 462016' }
      ]
    }
  };

  const currentView = periodData[activePeriod];
  const activeDateItem = currentView.carousel[selectedItemIndex] || currentView.carousel[0];

  return (
    <SafeAreaView style={ordersStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={ordersStyles.headerRow}>
        <View style={ordersStyles.headerLeftGroup}>
          <TouchableOpacity onPress={onBack} style={ordersStyles.backButton}>
            <Text style={ordersStyles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={ordersStyles.headerTitleText}>{t.allOrders}</Text>
        </View>
        <TouchableOpacity style={ordersStyles.helpButton} onPress={() => setInnerSupportView('LIST')}>
          <Text style={ordersStyles.helpIconText}>🎧</Text>
          <Text style={ordersStyles.helpButtonText}>{t.help}</Text>
        </TouchableOpacity>
      </View>

      <View style={ordersStyles.periodSwitcherWrapper}>
        <View style={ordersStyles.periodSwitcherContainer}>
          {['Day', 'Week', 'Month'].map((tab) => {
            const isActive = activePeriod === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[ordersStyles.periodTabBtn, isActive && ordersStyles.periodTabBtnActive]}
                onPress={() => {
                  setActivePeriod(tab);
                  setSelectedItemIndex(periodData[tab].carousel.length - 1);
                }}
              >
                <Text style={[ordersStyles.periodTabText, isActive && ordersStyles.periodTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={ordersStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={ordersStyles.carouselRow}>
          <TouchableOpacity style={ordersStyles.carouselArrowBtn} onPress={() => setSelectedItemIndex(prev => Math.max(0, prev - 1))}>
            <Text style={ordersStyles.arrowIconText}>←</Text>
          </TouchableOpacity>
          <View style={ordersStyles.carouselPillsGroup}>
            {currentView.carousel.map((item, idx) => (
              <View key={item.id} style={ordersStyles.pillWithDotWrapper}>
                <TouchableOpacity style={[ordersStyles.carouselPill, selectedItemIndex === idx && ordersStyles.carouselPillActive]} onPress={() => setSelectedItemIndex(idx)}>
                  <Text style={[ordersStyles.carouselPillText, selectedItemIndex === idx && ordersStyles.carouselPillTextActive]}>{item.label}</Text>
                </TouchableOpacity>
                {selectedItemIndex === idx && <View style={ordersStyles.activePillDot} />}
              </View>
            ))}
          </View>
          <TouchableOpacity style={ordersStyles.carouselArrowBtn} onPress={() => setSelectedItemIndex(prev => Math.min(currentView.carousel.length - 1, prev + 1))}>
            <Text style={ordersStyles.arrowIconText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={ordersStyles.statsSummaryCard}>
          <View style={ordersStyles.statsColumn}>
            <Text style={ordersStyles.statsBigNumber}>{currentView.completedOrders}</Text>
            <Text style={ordersStyles.statsSubLabel}>{t.completedOrders}</Text>
          </View>
          <View style={ordersStyles.statsDividerVert} />
          <View style={ordersStyles.statsColumn}>
            <Text style={[ordersStyles.statsBigNumber, { color: '#047857' }]}>₹{currentView.earnings}</Text>
            <Text style={ordersStyles.statsSubLabel}>{t.orderEarnings}</Text>
          </View>
        </View>

        <Text style={ordersStyles.sectionTitle}>{t.orderHistory}</Text>
        <View style={ordersStyles.historyFilterRow}>
          {['Completed', 'Cancelled'].map((status) => (
            <TouchableOpacity key={status} style={[ordersStyles.filterPillBtn, orderStatusFilter === status && ordersStyles.filterPillBtnActive]} onPress={() => setOrderStatusFilter(status)}>
              <Text style={[ordersStyles.filterPillText, orderStatusFilter === status && ordersStyles.filterPillBtnActive]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={ordersStyles.historyDateBlueHeader}>{activeDateItem.fullDate}</Text>

        {currentView.rides.map((ride) => (
          <TouchableOpacity key={ride.id} style={ordersStyles.rideCard} activeOpacity={0.8} onPress={() => setSelectedRideForBill(ride)}>
            <View style={ordersStyles.rideCardTopRow}>
              <View style={ordersStyles.rideTypeWithTime}>
                <Text style={ordersStyles.rideTypeName}>{ride.type}</Text>
                <Text style={ordersStyles.rideDotSeparator}>•</Text>
                <Text style={ordersStyles.rideTimeText}>{ride.icon} {ride.time}</Text>
              </View>
              <View style={ordersStyles.rideFareGroup}>
                <Text style={ordersStyles.rideFareAmount}>₹{ride.fare}</Text>
                <View style={ordersStyles.greenCheckBadge}><Text style={ordersStyles.greenCheckIcon}>✓</Text></View>
              </View>
            </View>
            <View style={ordersStyles.rideRouteContainer}>
              <View style={ordersStyles.routeIndicatorColumn}>
                <View style={ordersStyles.greenRouteDot} />
                <View style={ordersStyles.dottedConnectorLine} />
                <View style={ordersStyles.redRouteDot} />
              </View>
              <View style={ordersStyles.routeAddressColumn}>
                {/* ⚡ इमेज 2 अनुसार: गहरा और बड़ा टेक्स्ट बिना कटे */}
                <Text style={ordersStyles.routeAddressText}>{ride.pickup}</Text>
                <View style={{ height: 10 }} />
                <Text style={ordersStyles.routeAddressText}>{ride.drop}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ⚡ रसीद मोडल */}
      <Modal visible={!!selectedRideForBill} transparent={true} animationType="slide" onRequestClose={() => setSelectedRideForBill(null)}>
        <View style={billStyles.modalOverlay}>
          <View style={billStyles.billCardContainer}>
            <View style={billStyles.billHeaderRow}>
              <View>
                <Text style={billStyles.billTitleText}>{t.tripReceipt}</Text>
                <Text style={billStyles.billOrderIdText}>Order ID: #CRN-{selectedRideForBill?.id}</Text>
              </View>
              <TouchableOpacity style={billStyles.closeCircleBtn} onPress={() => setSelectedRideForBill(null)}>
                <Text style={billStyles.closeCrossText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={billStyles.totalAmountHighlightBox}>
                <Text style={billStyles.totalAmountLabel}>Total Fare</Text>
                <Text style={billStyles.totalAmountValue}>₹{selectedRideForBill?.fare}</Text>
              </View>
              <View style={billStyles.tripMetricRow}>
                <View style={billStyles.metricCol}><Text style={billStyles.metricLabelSmall}>Distance</Text><Text style={billStyles.metricValBig}>{selectedRideForBill?.distance} KM</Text></View>
                <View style={billStyles.metricDivider} />
                <View style={billStyles.metricCol}><Text style={billStyles.metricLabelSmall}>Duration</Text><Text style={billStyles.metricValBig}>{selectedRideForBill?.duration}</Text></View>
              </View>
              <View style={billStyles.routeBox}>
                <Text style={billStyles.routeAddressText}>🟢 {selectedRideForBill?.pickup}</Text>
                <View style={{ height: 8 }} />
                <Text style={billStyles.routeAddressText}>🔴 {selectedRideForBill?.drop}</Text>
              </View>

              {/* ⚡ 'सहायता लें' बटन: यह दबाते ही तुरंत Support स्क्रीन सामने खुलेगी */}
              <TouchableOpacity 
                style={billStyles.receiptHelpBtn}
                onPress={() => {
                  setSelectedRideForBill(null);
                  setInnerSupportView('LIST');
                }}
              >
                <Text style={{ fontSize: 16 }}>🎧</Text>
                <Text style={billStyles.receiptHelpBtnText}>
                  {lang === 'EN' ? 'Need Help with this Order?' : 'इस ऑर्डर में कोई समस्या है? (सहायता लें)'}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={billStyles.doneButton} onPress={() => setSelectedRideForBill(null)}>
              <Text style={billStyles.doneButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ⚡ रसीद से सहायता लेते ही तुरंत खुलने वाला सपोर्ट मोडल */}
      <Modal visible={!!innerSupportView} animationType="slide">
        <SafeAreaView style={supportIssueStyles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={supportIssueStyles.header}>
            <TouchableOpacity onPress={() => setInnerSupportView(innerSupportView === 'LIST' ? null : 'LIST')} style={supportIssueStyles.backBtn}>
              <Text style={supportIssueStyles.backBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={supportIssueStyles.headerTitle}>Support</Text>
          </View>

          {innerSupportView === 'LIST' ? (
            <ScrollView style={{ flex: 1, padding: 18 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a', marginBottom: 14 }}>
                {lang === 'EN' ? 'Select your issue:' : 'अपनी समस्या चुनें:'}
              </Text>

              <TouchableOpacity 
                style={[menuStyles.menuRowItem, { paddingVertical: 16 }]}
                onPress={() => setInnerSupportView('PENALTY')}
              >
                <Text style={{ fontSize: 20 }}>⚠️</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>
                    I was charged a penalty for an order.
                  </Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[menuStyles.menuRowItem, { paddingVertical: 16 }]}
                onPress={() => setInnerSupportView('DISTANCE')}
              >
                <Text style={{ fontSize: 20 }}>🛣️</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>
                    Distance calculation is wrong.
                  </Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[menuStyles.menuRowItem, { paddingVertical: 16 }]}
                onPress={() => setInnerSupportView('CANCELLATION')}
              >
                <Text style={{ fontSize: 20 }}>❌</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>
                    I did not receive the cancellation fare for an order that the customer cancelled.
                  </Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[supportIssueStyles.callSupportBtn, { marginTop: 32 }]}
                onPress={() => Linking.openURL('tel:18001234567')}
              >
                <Text style={supportIssueStyles.callSupportText}>📞 Call Support</Text>
              </TouchableOpacity>
            </ScrollView>

          ) : innerSupportView === 'PENALTY' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={supportIssueStyles.headingBanner}>
                <Text style={supportIssueStyles.issueTitleBig}>
                  I was charged a penalty for an order.
                </Text>
              </View>
              <View style={supportIssueStyles.bodyContent}>
                <Text style={supportIssueStyles.descParagraph}>
                  Penalties are charged when you have committed any fraud on any of your rides or your actions do not follow the protocols. Please refer to 'order details' for that order to know the reason why you were charged a penalty.
                </Text>
                <Text style={supportIssueStyles.descParagraph}>
                  If you have any further questions regarding this please reach out to Captain Care Centre by clicking on Get Help below.
                </Text>

                <View style={supportIssueStyles.helpBox}>
                  <Text style={supportIssueStyles.helpBoxLabel}>Was it helpful?</Text>
                  <View style={supportIssueStyles.voteRow}>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👍</Text>
                      <Text style={supportIssueStyles.voteText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👎</Text>
                      <Text style={supportIssueStyles.voteText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={supportIssueStyles.callSupportBtn}
                  onPress={() => Linking.openURL('tel:18001234567')}
                >
                  <Text style={supportIssueStyles.callSupportText}>Call Support</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          ) : innerSupportView === 'DISTANCE' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={supportIssueStyles.headingBanner}>
                <Text style={supportIssueStyles.issueTitleBig}>
                  Distance calculation is wrong.
                </Text>
              </View>
              <View style={supportIssueStyles.bodyContent}>
                <Text style={supportIssueStyles.descParagraph}>
                  Your earnings will be calculated based on the route suggested by the application. Please follow the route suggested. In case you have taken a different route because of some reason, your order earnings will be recalculated based on the actual distance travelled and the earnings get adjusted automatically.
                </Text>
                <Text style={supportIssueStyles.descParagraph}>
                  If you have any further questions regarding this please reach out to Captain Care Centre by clicking on Get Help below.
                </Text>

                <View style={supportIssueStyles.helpBox}>
                  <Text style={supportIssueStyles.helpBoxLabel}>Was it helpful?</Text>
                  <View style={supportIssueStyles.voteRow}>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👍</Text>
                      <Text style={supportIssueStyles.voteText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👎</Text>
                      <Text style={supportIssueStyles.voteText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={supportIssueStyles.callSupportBtn}
                  onPress={() => Linking.openURL('tel:18001234567')}
                >
                  <Text style={supportIssueStyles.callSupportText}>Call Support</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={supportIssueStyles.headingBanner}>
                <Text style={supportIssueStyles.issueTitleBig}>
                  I did not receive the cancellation fare for an order that the customer cancelled.
                </Text>
              </View>
              <View style={supportIssueStyles.bodyContent}>
                <Text style={supportIssueStyles.descParagraph}>
                  If a customer cancels an order, and you are eligible for a cancellation fare, the money is automatically added to your wallet. Please check your 'Wallet' to know if you have received the cancellation fare. The eligibility for receiving the cancellation fare depends on the distance travelled towards the pickup location.
                </Text>
                <Text style={supportIssueStyles.descParagraph}>
                  Please check your rate card to know the maximum limit on the cancellation fare. If you have any issues regarding the earnings you can reach out to Captain Care Centre after you have completed the order.
                </Text>

                <View style={supportIssueStyles.helpBox}>
                  <Text style={supportIssueStyles.helpBoxLabel}>Was it helpful?</Text>
                  <View style={supportIssueStyles.voteRow}>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👍</Text>
                      <Text style={supportIssueStyles.voteText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={supportIssueStyles.voteBtn} onPress={() => Alert.alert('Thank you', 'Feedback submitted.')}>
                      <Text style={{ fontSize: 16 }}>👎</Text>
                      <Text style={supportIssueStyles.voteText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={supportIssueStyles.callSupportBtn}
                  onPress={() => Linking.openURL('tel:18001234567')}
                >
                  <Text style={supportIssueStyles.callSupportText}>Call Support</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

/* =========================================================================
   3. WALLET COMPONENT
   ========================================================================= */
function WalletScreen({ walletBalance = 500, onBack, onRecharge, onWithdraw, lang }) {
  const t = STRINGS[lang];
  const [balance, setBalance] = useState(walletBalance);
  const isPositive = balance >= 0;
  const canWithdraw = balance >= 200;

  return (
    <SafeAreaView style={walletStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={walletStyles.headerRow}>
        <TouchableOpacity style={walletStyles.backButton} onPress={onBack}>
          <Text style={walletStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={walletStyles.headerTitle}>{lang === 'EN' ? 'WITHDRAWAL & WALLET' : 'विड्रॉल और वॉलेट'}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={walletStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[walletStyles.balanceCard, !isPositive ? walletStyles.cardNegative : walletStyles.cardPositive]}>
          <Text style={walletStyles.balanceHeaderTitle}>{t.walletBalance}</Text>
          <Text style={[walletStyles.balanceAmount, { color: isPositive ? '#166534' : '#DC2626' }]}>₹{balance.toFixed(2)}</Text>
          <Text style={walletStyles.balanceSubText}>{isPositive ? (canWithdraw ? 'Available for Withdrawal' : 'Min ₹200 required') : '⚠️ Dues Pending'}</Text>
          {!isPositive ? (
            <TouchableOpacity style={walletStyles.actionButtonRecharge} onPress={() => { setBalance(500); onRecharge(500); Alert.alert('सफल', 'रीचार्ज हो गया!'); }}>
              <Text style={walletStyles.actionButtonText}>RECHARGE NOW</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[walletStyles.actionButtonWithdraw, { backgroundColor: canWithdraw ? '#111827' : '#D1D5DB' }]} disabled={!canWithdraw} onPress={() => { const amt = balance; setBalance(0); onWithdraw(amt); Alert.alert('सफल', `₹${amt} विड्रॉल हो गया`); }}>
              <Text style={[walletStyles.actionButtonText, { color: canWithdraw ? '#FFFFFF' : '#9CA3AF' }]}>WITHDRAW NOW</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================================
   4. MAIN APP EXPORT COMPONENT
   ========================================================================= */
export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [appMode, setAppMode] = useState('DRIVER');
  const [activeScreen, setActiveScreen] = useState('HOME');

  const [appLang, setAppLang] = useState('HI');
  const t = STRINGS[appLang];

  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState(null);
  const [serviceHelpModal, setServiceHelpModal] = useState(false);

  // ⚡ 1. लास्ट राइड हिस्ट्री मोडल स्टेट
  const [showLastRideModal, setShowLastRideModal] = useState(false);
  // ⚡ 2. कुल किमी (फ्री रन + पेड रन) मोडल स्टेट
  const [showKmBreakdownModal, setShowKmBreakdownModal] = useState(false);

  const [driverCoords, setDriverCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });

  const [lastRideFare, setLastRideFare] = useState(180);
  const [todayEarn, setTodayEarn] = useState(1450);
  const [totalRidesCount, setTotalRidesCount] = useState(8);
  const [totalKmVal, setTotalKmVal] = useState(42.6);

  // फ्री रन (पिकअप तक) व पेड रन (ड्रॉप तक)
  const [freeRunKm, setFreeRunKm] = useState(11.2);
  const [paidRunKm, setPaidRunKm] = useState(31.4);

  const [lastRideDetails, setLastRideDetails] = useState({
    id: 'CRN-89421',
    customer: 'अमित वर्मा',
    fare: 180,
    distance: '5.2 KM',
    duration: '18 min',
    ratingGiven: 5,
    pickup: 'न्यू मार्केट, टीटी नगर, भोपाल',
    drop: 'एमपी नगर ज़ोन 1, मानसरोवर कॉम्प्लेक्स, भोपाल',
    time: '02:15 PM'
  });

  const [activeRide, setActiveRide] = useState(null);
  const [inputOtp, setInputOtp] = useState('');

  const [availableRides, setAvailableRides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectedRideIds, setRejectedRideIds] = useState([]);
  const [walletBalance, setWalletBalance] = useState(500);

  const [requestTimer, setRequestTimer] = useState(10);
  const [waitSecs, setWaitSecs] = useState(0);

  const [selectedStars, setSelectedStars] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  // 3 श्रेणियां
  const [services, setServices] = useState([
    { id: 'non_ac', name: 'Cab Non AC', active: true, desc: 'नॉन-एसी सामान्य कैब' },
    { id: 'ac', name: 'Cab AC', active: true, desc: 'फुल एसी आरामदायक कैब' },
    { id: 'sedan', name: 'Prime Sedan', active: true, desc: 'प्रीमियम सेडान गाड़ियां (Dzire/Etios)' },
  ]);

  const [vehicleDocuments, setVehicleDocuments] = useState([
    { id: 'dl', title: 'ड्राइविंग लाइसेंस (DL)', desc: 'खाता बनाते समय सत्यापित किया गया', status: 'VERIFIED', icon: '🪪' },
    { id: 'rc_front', title: 'गाड़ी RC (Front Side)', desc: 'पंजीकरण प्रमाण पत्र - आगे का भाग', status: 'UPLOAD', icon: '🚗' },
    { id: 'rc_back', title: 'गाड़ी RC (Back Side)', desc: 'पंजीकरण प्रमाण पत्र - पीछे का भाग', status: 'UPLOAD', icon: '🚗' },
    { id: 'ins', title: 'वाहन बीमा (Insurance Policy)', desc: 'कमर्शियल कॉम्प्रिहेंसिव पॉलिसी', status: 'UPLOAD', icon: '📄' },
    { id: 'fit', title: 'फिटनेस प्रमाण पत्र (Fitness)', desc: 'RTO फिटनेस टेस्ट सर्टिफिकेट', status: 'UPLOAD', icon: '🛠️' },
    { id: 'permit', title: 'टैक्सी परमिट (Commercial Permit)', desc: 'ऑल एमपी / ऑल इंडिया परमिट', status: 'UPLOAD', icon: '📜' },
    { id: 'puc', title: 'प्रदूषण प्रमाण पत्र (PUC)', desc: 'वैध एमिशन टेस्ट रसीद', status: 'UPLOAD', icon: '🌱' },
  ]);

  const [currentPass, setCurrentPass] = useState({
    planName: 'मंथली अनलिमिटेड 0% कमीशन पास',
    price: 999,
    startDate: '12 Sep 2026',
    expiryDate: '11 Oct 2026',
    daysLeft: '28 दिन शेष',
    isExpired: false
  });

  const subscriptionHistory = [
    { id: 'sub_103', date: '12 Sep 2026, 10:15 AM', plan: '30 Days Pass (0% Comm)', amount: 999, status: 'सक्रिय (Active)', txnId: 'TXN99281726' },
    { id: 'sub_102', date: '13 Aug 2026, 11:30 AM', plan: '30 Days Pass (0% Comm)', amount: 999, status: 'समाप्त (Expired)', txnId: 'TXN88192019' },
    { id: 'sub_101', date: '14 Jul 2026, 09:45 AM', plan: '30 Days Pass (0% Comm)', amount: 999, status: 'समाप्त (Expired)', txnId: 'TXN77261901' },
  ];

  const mapIframeRef = useRef(null);

  const toggleService = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const fileInputRef = useRef(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);

  const triggerCameraUpload = (id, title) => {
    setUploadingDocId(id);
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      Alert.alert(
        `${title} फ़ोटो लें`,
        'कैमरा खोलकर स्पष्ट फोटो खींचे:',
        [
          { text: 'रद्द करें', style: 'cancel' },
          { 
            text: '📷 कैमरा खोलें', 
            onPress: () => simulateDocUploadSuccess(id, title) 
          }
        ]
      );
    }
  };

  const handleWebFileSelected = (event) => {
    const file = event.target.files[0];
    if (file && uploadingDocId) {
      const doc = vehicleDocuments.find(d => d.id === uploadingDocId);
      simulateDocUploadSuccess(uploadingDocId, doc?.title || 'दस्तावेज़');
    }
  };

  const simulateDocUploadSuccess = (id, title) => {
    setVehicleDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'PENDING' } : d));
    setTimeout(() => {
      Alert.alert(
        'दस्तावेज़ सत्यापन (Verification)',
        `${title} की फ़ोटो अपलोड हो चुकी है। सत्यापन पूरा करने के लिए ओके दबाएं।`,
        [
          { text: 'बाद में', style: 'cancel' },
          { 
            text: 'ओके (सत्यापित करें)', 
            onPress: () => {
              setVehicleDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'VERIFIED' } : d));
            }
          }
        ]
      );
    }, 600);
  };

  const handleTriggerSos = () => {
    Alert.alert(
      appLang === 'EN' ? '🚨 Emergency Alert (SOS)' : '🚨 आपातकालीन चेतावनी (SOS)',
      appLang === 'EN' ? 'Do you want to dial Police helpline (112)?' : 'क्या आप तुरंत पुलिस हेल्पलाइन (112) पर कॉल करना चाहते हैं?',
      [
        { text: appLang === 'EN' ? 'Cancel' : 'रद्द करें', style: 'cancel' },
        { text: appLang === 'EN' ? 'Call (112)' : 'कॉल करें (112)', onPress: () => Linking.openURL('tel:112'), style: 'destructive' }
      ]
    );
  };

  const fetchRidesFromSupabase = useCallback(async () => {
    try {
      const { data: myActiveRide } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_name', DRIVER_NAME)
        .in('status', ['ACCEPTED', 'ARRIVED', 'IN_TRIP'])
        .order('id', { ascending: false })
        .limit(1);

      if (myActiveRide && myActiveRide.length > 0) {
        setActiveRide(myActiveRide[0]);
        setIsOnline(true);
        return;
      }

      if (!isOnline) {
        setAvailableRides([]);
        return;
      }

      const { data: openRides } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'SEARCHING')
        .order('id', { ascending: false })
        .limit(10);

      if (openRides && openRides.length > 0) {
        const filtered = openRides.filter(r => !rejectedRideIds.includes(r.id));
        setAvailableRides(filtered);
        if (currentIndex >= filtered.length) setCurrentIndex(0);
      } else {
        setAvailableRides([]);
      }
    } catch (err) {
      console.log('Error fetching rides:', err);
    }
  }, [isOnline, rejectedRideIds, currentIndex]);

  useEffect(() => {
    fetchRidesFromSupabase();
    const channel = supabase.channel('driver_rides_realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, () => {
        fetchRidesFromSupabase();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchRidesFromSupabase]);

  useEffect(() => {
    let interval = null;
    if (isOnline && !activeRide && availableRides.length > 0) {
      setRequestTimer(10);
      interval = setInterval(() => {
        setRequestTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [currentIndex, isOnline, activeRide, availableRides.length]);

  useEffect(() => {
    let timer = null;
    if (activeRide && activeRide.status === 'ARRIVED') {
      timer = setInterval(() => setWaitSecs(s => s + 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [activeRide]);

  // ⚡ बिना ब्लिंक किए करंट लोकेशन पर स्मूथ पैन/रीसेंटर
  const handleSmoothRecenter = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setDriverCoords({ lat, lng });

          // postMessage द्वारा iframe को बिना रीलोड किए मैप को सिर्फ panTo करना
          if (mapIframeRef.current && mapIframeRef.current.contentWindow) {
            mapIframeRef.current.contentWindow.postMessage({ type: 'RECENTER', lat, lng }, '*');
          }
        },
        () => {
          // फ़ालबैक: मौजूदा लोकेशन पर ही रीसेंटर करें
          if (mapIframeRef.current && mapIframeRef.current.contentWindow) {
            mapIframeRef.current.contentWindow.postMessage({ type: 'RECENTER', lat: driverCoords.lat, lng: driverCoords.lng }, '*');
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      if (mapIframeRef.current && mapIframeRef.current.contentWindow) {
        mapIframeRef.current.contentWindow.postMessage({ type: 'RECENTER', lat: driverCoords.lat, lng: driverCoords.lng }, '*');
      }
    }
  }, [driverCoords]);

  useEffect(() => { handleSmoothRecenter(); }, []);

  const handleAcceptRide = async (rideItem) => {
    if (currentPass.isExpired) {
      Alert.alert(
        appLang === 'EN' ? 'Subscription Expired!' : 'सब्स्क्रिप्शन पास समाप्त!',
        appLang === 'EN' 
          ? 'You cannot accept rides because your pass has expired. Please renew.' 
          : 'पास समाप्त होने पर आप Ride Accept नहीं कर सकते। कृपया पास रीन्यू करें।'
      );
      return;
    }

    try {
      await supabase.from('rides').update({
        status: 'ACCEPTED',
        driver_name: DRIVER_NAME,
        driver_phone: DRIVER_PHONE,
        driver_rating: DRIVER_RATING
      }).eq('id', rideItem.id);

      setActiveRide({ 
        ...rideItem, 
        status: 'ACCEPTED', 
        driver_name: DRIVER_NAME, 
        driver_phone: DRIVER_PHONE 
      });
    } catch (err) {
      setActiveRide({ ...rideItem, status: 'ACCEPTED' });
    }
  };

  const handleDeclineRide = (rideId) => {
    setRejectedRideIds(prev => [...prev, rideId]);
    setAvailableRides(prev => prev.filter(r => r.id !== rideId));
    if (currentIndex >= availableRides.length - 1) setCurrentIndex(0);
  };

  const handleMarkArrived = async () => {
    if (!activeRide) return;
    try {
      await supabase.from('rides').update({
        status: 'ARRIVED',
        arrived_at: new Date().toISOString()
      }).eq('id', activeRide.id);
    } catch (e) { console.log(e); }
    setWaitSecs(0);
    setActiveRide(prev => ({ ...prev, status: 'ARRIVED' }));
  };

  const handleStartTripWithOtp = async (otpValueToCheck) => {
    if (!activeRide) return;
    const correctOtp = String(activeRide.otp || '1234').trim();
    if (otpValueToCheck.trim() === correctOtp || otpValueToCheck.trim() === '1234') {
      try {
        await supabase.from('rides').update({
          status: 'IN_TRIP',
          trip_started_at: new Date().toISOString()
        }).eq('id', activeRide.id);
      } catch (e) { console.log(e); }

      setInputOtp('');
      setActiveRide(prev => ({ ...prev, status: 'IN_TRIP' }));
    } else {
      Alert.alert(
        appLang === 'EN' ? 'Invalid OTP' : 'गलत OTP',
        appLang === 'EN' 
          ? `Please ask the passenger for the correct OTP (OTP: ${correctOtp})` 
          : `कृपया यात्री से सही 4-अंकों का OTP दर्ज करें (OTP: ${correctOtp})`
      );
    }
  };

  const handleCompleteTrip = async () => {
    if (!activeRide) return;
    try {
      await supabase.from('rides').update({
        status: 'COMPLETED',
        trip_ended_at: new Date().toISOString()
      }).eq('id', activeRide.id);
    } catch (e) { console.log(e); }

    // लास्ट राइड को अपडेट करना
    setLastRideDetails({
      id: `#CRN-${activeRide.id}`,
      customer: activeRide.passenger_name || 'राहुल शर्मा',
      fare: activeRide.fare || 180,
      distance: `${activeRide.total_distance_km || 5} KM`,
      duration: '18 min',
      ratingGiven: selectedStars,
      pickup: activeRide.pickup,
      drop: activeRide.dropoff,
      time: 'अभी-अभी'
    });

    setActiveRide(prev => ({ ...prev, status: 'COMPLETED' }));
  };

  const generateTripMapHtml = () => {
    const pickupLoc = KNOWN_PLACES[activeRide?.pickup] || { lat: 23.2315, lng: 77.4018 };
    const dropLoc = KNOWN_PLACES[activeRide?.dropoff] || { lat: 23.2332, lng: 77.4343 };

    if (activeRide?.status === 'IN_TRIP') {
      return `
        <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>body,html,#map{margin:0;padding:0;width:100%;height:100%;}</style></head><body><div id="map"></div>
        <script>
          var map = L.map('map', {zoomControl: false}).setView([${pickupLoc.lat}, ${pickupLoc.lng}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          var line = L.polyline([[${pickupLoc.lat}, ${pickupLoc.lng}], [${dropLoc.lat}, ${dropLoc.lng}]], {color: '#0284c7', weight: 6}).addTo(map);
          L.marker([${pickupLoc.lat}, ${pickupLoc.lng}], {icon: L.divIcon({html: '<div style="background:#10b981;color:white;border-radius:50%;width:24px;height:24px;text-align:center;font-weight:900;line-height:24px;">A</div>'})}).addTo(map);
          L.marker([${dropLoc.lat}, ${dropLoc.lng}], {icon: L.divIcon({html: '<div style="background:#ef4444;color:white;border-radius:50%;width:24px;height:24px;text-align:center;font-weight:900;line-height:24px;">B</div>'})}).addTo(map);
          map.fitBounds(line.getBounds(), {padding: [30, 30]});
        </script></body></html>
      `;
    }

    if (activeRide?.status === 'ARRIVED') {
      return `
        <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>body,html,#map{margin:0;padding:0;width:100%;height:100%;}</style></head><body><div id="map"></div>
        <script>
          var map = L.map('map', {zoomControl: false}).setView([${pickupLoc.lat}, ${pickupLoc.lng}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.circle([${pickupLoc.lat}, ${pickupLoc.lng}], {radius: 80, color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.25}).addTo(map);
          L.marker([${pickupLoc.lat}, ${pickupLoc.lng}], {icon: L.divIcon({html: '📍', iconSize: [24,24]})}).addTo(map);
          L.marker([${pickupLoc.lat - 0.0002}, ${pickupLoc.lng + 0.0002}], {icon: L.divIcon({html: '🚖', iconSize: [28,28]})}).addTo(map);
        </script></body></html>
      `;
    }

    return `
      <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>body,html,#map{margin:0;padding:0;width:100%;height:100%;}</style></head><body><div id="map"></div>
      <script>
        var map = L.map('map', {zoomControl: false}).setView([${pickupLoc.lat}, ${pickupLoc.lng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        var line = L.polyline([[${driverCoords.lat}, ${driverCoords.lng}], [${pickupLoc.lat}, ${pickupLoc.lng}]], {color: '#0284c7', weight: 5}).addTo(map);
        L.marker([${driverCoords.lat}, ${driverCoords.lng}], {icon: L.divIcon({html: '🚖', iconSize: [30,30]})}).addTo(map);
        L.marker([${pickupLoc.lat}, ${pickupLoc.lng}], {icon: L.divIcon({html: '<div style="background:#10b981;color:white;border-radius:50%;width:24px;height:24px;text-align:center;font-weight:900;line-height:24px;">A</div>'})}).addTo(map);
        map.fitBounds(line.getBounds(), {padding: [30, 30]});
      </script></body></html>
    `;
  };

  const currentRideItem = availableRides[currentIndex];

  if (!isRegistered) {
    return <DriverRegistrationScreen onRegistrationSuccess={() => setIsRegistered(true)} onSkip={() => setIsRegistered(true)} lang={appLang} />;
  }

  if (activeScreen === 'ORDERS') {
    return (
      <OrdersHistoryScreen 
        onBack={() => setActiveScreen('HOME')} 
        lang={appLang} 
      />
    );
  }

  if (activeScreen === 'WALLET') {
    return (
      <WalletScreen 
        walletBalance={walletBalance} 
        onBack={() => setActiveScreen('HOME')} 
        onRecharge={(amt) => setWalletBalance(amt)} 
        onWithdraw={(amt) => setWalletBalance(0)} 
        lang={appLang}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Hidden File Input for Web Camera Trigger */}
      {Platform.OS === 'web' && (
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleWebFileSelected} 
        />
      )}
      
      {/* -------------------- 1. OFFLINE DASHBOARD -------------------- */}
      {!isOnline && !activeRide ? (
        <ScrollView style={styles.cleanOfflineScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setIsDrawerMenuOpen(true)}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity style={styles.operatorTopBtn} onPress={() => setAppMode(appMode === 'DRIVER' ? 'OPERATOR' : 'DRIVER')}>
                <Text style={styles.operatorTopBtnText}>{appMode === 'DRIVER' ? t.operatorMode : t.driverMode}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchQuickBtn} onPress={() => setActiveScreen('ORDERS')}>
                <Text style={{ fontSize: 16 }}>🔍</Text>
              </TouchableOpacity>
              <View style={styles.zeroCommBadge}><Text style={styles.zeroCommText}>0% COMM</Text></View>
            </View>
          </View>

          <View style={styles.driverHeroBanner}>
            <Image source={{ uri: 'https://i.postimg.cc/3NrrvGjR/IMG-20261008-WA0000.jpg' }} style={styles.fullHeroImg} resizeMode="contain" />
          </View>

          <TouchableOpacity style={styles.compactGoOnlineBtn} activeOpacity={0.85} onPress={() => { handleSmoothRecenter(); setIsOnline(true); }}>
            <View style={styles.arrowDarkBox}><Text style={styles.arrowSign}>➔</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.onlineMainTitle}>{t.goOnline}</Text>
              <Text style={styles.onlineSubTitleText}>{t.startAccepting}</Text>
            </View>
            <View style={styles.readyBadgePill}><Text style={styles.readyBadgeText}>● READY</Text></View>
          </TouchableOpacity>

          <View style={styles.offlineVehiclePassBox}>
            <View style={styles.walletBoxHighlighted}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.walletIconCircle}><Text style={{ fontSize: 18 }}>👛</Text></View>
                <View>
                  <Text style={styles.walletLabelTitle}>{t.walletBalance}</Text>
                  <Text style={styles.walletDriverNameTag}>{DRIVER_NAME}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.walletAmountVal}>₹{walletBalance.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => setActiveScreen('WALLET')}>
                  <Text style={styles.walletAddCashText}>{t.withdrawWallet}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ovRow}><Text style={styles.ovLabel}>{t.vehicleDetails}</Text><Text style={styles.ovVal}>MP-04-TA-5566</Text></View>
            <View style={styles.ovRow}><Text style={styles.ovLabel}>{t.passStatus}</Text><Text style={styles.ovPassVal}>● {t.activePassText}</Text></View>
          </View>
        </ScrollView>

      ) : activeRide && activeRide.status === 'ACCEPTED' ? (
        /* -------------------- 2. SCREEN 1: RIDE ACCEPTED -------------------- */
        <SafeAreaView style={styles.tripFlowContainer}>
          <View style={styles.flowMapCard}>
            <View style={styles.mapBadgeHeader}>
              <Text style={styles.mapBadgeText}>{appLang === 'EN' ? 'LIVE NAVIGATION' : 'लाइव नेविगेशन'}</Text>
            </View>
            <TouchableOpacity style={styles.floatingSosBtn} onPress={handleTriggerSos}>
              <Text style={styles.floatingSosText}>🚨 SOS</Text>
            </TouchableOpacity>
            {Platform.OS === 'web' ? (
              <iframe
                title="Live Navigation"
                srcDoc={generateTripMapHtml()}
                style={styles.webMapIframe}
                frameBorder="0"
              />
            ) : (
              <View style={styles.mobileMapFallback}>
                <Text style={{ color: '#64748b', textAlign: 'center' }}>📍 लाइव नेविगेशन मैप वेब संस्करण में उपलब्ध है</Text>
              </View>
            )}
          </View>

          <View style={styles.flowBottomCardCompact}>
            <View style={styles.flowHeaderRow}>
              <View>
                <Text style={styles.flowTitleBlack}>{t.rideAccepted}</Text>
                <Text style={styles.flowSubTitleYellow}>{t.navToPickup}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.flowIdText}>#ID: {activeRide.id}</Text>
                <Text style={styles.flowDriverText}>{DRIVER_NAME}</Text>
              </View>
            </View>

            <View style={styles.flowLocationBoxCompact}>
              <View style={styles.flowLocItem}>
                <View style={styles.greenCircleDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locSmallTag}>{t.pickupLocation}</Text>
                  <Text style={styles.locNameBold}>{activeRide.pickup}</Text>
                </View>
              </View>
              <View style={styles.verticalDottedDividerShort} />
              <View style={styles.flowLocItem}>
                <View style={styles.redCircleDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locSmallTag}>{t.dropLocation}</Text>
                  <Text style={styles.locNameBold}>{activeRide.dropoff}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.kmBoldText}>{activeRide.total_distance_km || '5'} km</Text>
                  <Text style={styles.kmSubText}>{t.trip}</Text>
                </View>
              </View>
            </View>

            <View style={styles.flowMetaBoxCompact}>
              <View style={styles.metaDetailRow}>
                <View style={styles.metaLeftGroup}><Text>🕒</Text><Text style={styles.metaLabelText}>{t.estimatedTime}</Text></View>
                <Text style={styles.metaValueText}>18 min</Text>
              </View>
              <View style={styles.metaRowLine} />
              <View style={styles.metaDetailRow}>
                <View style={styles.metaLeftGroup}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#16a34a' }}>₹</Text>
                  <Text style={styles.metaLabelText}>{t.fareEstimate}</Text>
                </View>
                <Text style={styles.metaValueText}>₹{activeRide.fare}</Text>
              </View>
            </View>

            <View style={styles.flowActionRowThree}>
              <TouchableOpacity style={styles.greenSquareBtn} onPress={() => Linking.openURL('tel:9876543210')}>
                <Text style={{ fontSize: 16 }}>📞</Text>
                <Text style={styles.squareBtnText}>{t.call}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.blueSquareBtn} onPress={() => Alert.alert(t.chat, 'सवारी के साथ चैट विंडो सक्रिय है।')}>
                <Text style={{ fontSize: 16 }}>💬</Text>
                <Text style={styles.squareBtnText}>{t.chat}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navPickupWideBtn} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide.pickup)}`)}>
                <Text style={{ fontSize: 16 }}>🗺️</Text>
                <Text style={styles.navPickupBtnText}>{t.navBtn}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.arrivedYellowFullBtn} onPress={handleMarkArrived}>
              <Text style={styles.arrivedYellowBtnText}>{t.arrivedBtn}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

      ) : activeRide && (activeRide.status === 'ARRIVED' || activeRide.status === 'IN_TRIP') ? (
        /* -------------------- 3. SCREEN 2: PASSENGER PICKUP & IN TRIP -------------------- */
        <SafeAreaView style={styles.tripFlowContainer}>
          <View style={styles.flowMapCard}>
            <View style={styles.mapBadgeHeader}>
              <Text style={styles.mapBadgeText}>
                {activeRide.status === 'ARRIVED' 
                  ? (appLang === 'EN' ? 'GEOFENCE ARRIVED' : 'पिकअप ज़ोन पर पहुँचे') 
                  : (appLang === 'EN' ? 'IN TRIP' : 'यात्रा चालू है')}
              </Text>
            </View>
            <TouchableOpacity style={styles.floatingSosBtn} onPress={handleTriggerSos}>
              <Text style={styles.floatingSosText}>🚨 SOS</Text>
            </TouchableOpacity>
            {Platform.OS === 'web' ? (
              <iframe
                title="Trip Map"
                srcDoc={generateTripMapHtml()}
                style={styles.webMapIframe}
                frameBorder="0"
              />
            ) : (
              <View style={styles.mobileMapFallback}>
                <Text style={{ color: '#64748b', textAlign: 'center' }}>📍 ट्रिप मैप वेब संस्करण में उपलब्ध है</Text>
              </View>
            )}
          </View>

          <View style={styles.flowBottomCardCompact}>
            <View style={styles.flowHeaderRow}>
              <View>
                <Text style={styles.flowTitleBlack}>
                  {activeRide.status === 'ARRIVED' ? t.passengerPickup : t.inTripTitle}
                </Text>
                <Text style={styles.flowSubTitleYellow}>
                  {activeRide.status === 'ARRIVED' ? t.confirmOtp : t.inTripSub}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.flowIdText}>#ID: {activeRide.id}</Text>
                <Text style={styles.flowDriverText}>{DRIVER_NAME}</Text>
              </View>
            </View>

            <View style={styles.flowLocationBoxCompact}>
              <View style={styles.flowLocItem}>
                <View style={styles.greenCircleDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locSmallTag}>{t.pickupLocation}</Text>
                  <Text style={styles.locNameBold}>{activeRide.pickup}</Text>
                </View>
              </View>
              <View style={styles.verticalDottedDividerShort} />
              <View style={styles.flowLocItem}>
                <View style={styles.redCircleDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locSmallTag}>{t.dropLocation}</Text>
                  <Text style={styles.locNameBold}>{activeRide.dropoff}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.kmBoldText}>{activeRide.total_distance_km || '5'} km</Text>
                  <Text style={styles.kmSubText}>{t.trip}</Text>
                </View>
              </View>
            </View>

            <View style={styles.flowMetaBoxCompact}>
              <View style={styles.metaDetailRow}>
                <View style={styles.metaLeftGroup}><Text>🕒</Text><Text style={styles.metaLabelText}>{t.estimatedTime}</Text></View>
                <Text style={styles.metaValueText}>18 min</Text>
              </View>
              <View style={styles.metaRowLine} />
              <View style={styles.metaDetailRow}>
                <View style={styles.metaLeftGroup}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#16a34a' }}>₹</Text>
                  <Text style={styles.metaLabelText}>{t.fareEstimate}</Text>
                </View>
                <Text style={styles.metaValueText}>₹{activeRide.fare}</Text>
              </View>
            </View>

            {activeRide.status === 'ARRIVED' ? (
              <>
                <View style={styles.waitingTimeBoxRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text>⏱️</Text>
                    <Text style={styles.waitingTimeTitle}>{t.waitingTime}</Text>
                  </View>
                  <Text style={styles.waitingTimeDigits}>
                    {Math.floor(waitSecs / 60)}m {String(waitSecs % 60).padStart(2, '0')}s ⏳
                  </Text>
                </View>

                {/* OTP Input */}
                <TextInput 
                  style={styles.otpInputYellowBorder}
                  placeholder={`${t.otpPlaceholder} (OTP: ${activeRide.otp || '1234'})`}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={4}
                  value={inputOtp}
                  onChangeText={(val) => {
                    setInputOtp(val);
                    if (val.length === 4) {
                      handleStartTripWithOtp(val);
                    }
                  }}
                />

                <View style={styles.arrivedActionsRow}>
                  <TouchableOpacity style={styles.greenSquareBtn} onPress={() => Linking.openURL('tel:9876543210')}>
                    <Text style={{ fontSize: 16 }}>📞</Text>
                    <Text style={styles.squareBtnText}>{t.call}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.blueSquareBtn} onPress={() => Alert.alert(t.chat, 'सवारी के साथ चैट विंडो खुली है।')}>
                    <Text style={{ fontSize: 16 }}>💬</Text>
                    <Text style={styles.squareBtnText}>{t.chat}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.redCancelBtn} onPress={() => { setActiveRide(null); }}>
                    <Text style={styles.redCancelBtnText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.startTripGoldBtn, inputOtp.length === 4 && { backgroundColor: '#10b981', borderColor: '#059669' }]} 
                    onPress={() => handleStartTripWithOtp(inputOtp)}
                  >
                    <Text style={[styles.startTripGoldBtnText, inputOtp.length === 4 && { color: '#ffffff' }]}>
                      {inputOtp.length === 4 ? t.startTripActive : t.startTrip}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={{ gap: 8 }}>
                <TouchableOpacity style={styles.mainNavButton} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide.dropoff)}`)}>
                  <Text style={styles.mainNavButtonText}>{t.dropNavBtn}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.arrivedYellowFullBtn, { backgroundColor: '#10b981', borderColor: '#059669' }]} onPress={handleCompleteTrip}>
                  <Text style={[styles.arrivedYellowBtnText, { color: '#ffffff' }]}>{t.completeTripBtn}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>

      ) : activeRide && activeRide.status === 'COMPLETED' ? (
        /* -------------------- 4. SCREEN 3: TRIP COMPLETED / RATING -------------------- */
        <SafeAreaView style={styles.tripFlowContainer}>
          <View style={[styles.flowMapCard, { height: '30%' }]}>
            {Platform.OS === 'web' ? (
              <iframe
                title="Completed Map"
                srcDoc={generateTripMapHtml()}
                style={styles.webMapIframe}
                frameBorder="0"
              />
            ) : (
              <View style={styles.mobileMapFallback}>
                <Text style={{ color: '#64748b', textAlign: 'center' }}>📍 ट्रिप मैप वेब संस्करण में उपलब्ध है</Text>
              </View>
            )}
          </View>

          <View style={[styles.flowBottomCardCompact, { paddingVertical: 14 }]}>
            <View style={styles.completedPassengerCard}>
              <View style={styles.passengerAvatarCircle}><Text style={{ fontSize: 24 }}>👨</Text></View>
              <View style={{ marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.compPassengerName}>{activeRide.passenger_name || 'राहुल शर्मा'}</Text>
                  <Text style={styles.compPassengerStar}>⭐ 4.9</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0284c7', marginTop: 2 }}>
                  {appLang === 'EN' ? 'Ride ID:' : 'राइड ID:'} #{activeRide.id}
                </Text>
              </View>
            </View>

            <View style={styles.completedMetricsThreeCol}>
              <View style={styles.compMetricCol}>
                <Text style={styles.compMetricLabel}>🕒 {t.duration}</Text>
                <Text style={styles.compMetricValue}>1:24</Text>
                <Text style={styles.compMetricUnit}>min</Text>
              </View>
              <View style={styles.compMetricDivider} />
              <View style={styles.compMetricCol}>
                <Text style={styles.compMetricLabel}>🛣️ {t.distance}</Text>
                <Text style={styles.compMetricValue}>{activeRide.total_distance_km || '5'}</Text>
                <Text style={styles.compMetricUnit}>km</Text>
              </View>
              <View style={styles.compMetricDivider} />
              <View style={styles.compMetricCol}>
                <Text style={styles.compMetricLabel}>₹ {t.totalFare}</Text>
                <Text style={[styles.compMetricValue, { color: '#0f172a' }]}>₹{activeRide.fare}</Text>
              </View>
            </View>

            <View style={styles.ratingFormCard}>
              <Text style={styles.ratingBoxHeading}>{t.ratePassenger}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setSelectedStars(s)}>
                    <Text style={[styles.starIconText, { color: s <= selectedStars ? '#eab308' : '#cbd5e1' }]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput 
                style={styles.commentInputBox}
                placeholder={t.commentPlaceholder}
                placeholderTextColor="#94a3b8"
                value={feedbackComment}
                onChangeText={setFeedbackComment}
              />
            </View>

            <TouchableOpacity 
              style={[styles.compDoneSubmitBtn, { width: '100%' }]} 
              onPress={() => {
                setTodayEarn(prev => prev + activeRide.fare);
                setTotalRidesCount(prev => prev + 1);
                setLastRideFare(activeRide.fare);
                setActiveRide(null);
                fetchRidesFromSupabase();
              }}
            >
              <Text style={styles.compDoneSubmitText}>{t.doneSubmit}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

      ) : (
        /* -------------------- 5. LIVE MAP & FIXED RIDE CARD -------------------- */
        <View style={styles.mapScreenContainer}>
          
          <View style={styles.screen2TopNavRow}>
            <TouchableOpacity style={styles.screen2HamburgerBtn} onPress={() => setIsDrawerMenuOpen(true)}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.screen2OfflineBtn} activeOpacity={0.8} onPress={() => setIsOnline(false)}>
              <Text style={styles.redOfflineText}>🔴 {t.goOffline}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.screen2InboxBtn} onPress={() => Alert.alert(t.help, 'कोई नया संदेश नहीं है।')}>
              <Text style={{ fontSize: 18 }}>💬</Text>
              <View style={styles.yellowDotSmall} />
            </TouchableOpacity>
          </View>

          {/* ⚡ रीसेंटर बटन: बिना किसी ब्लिंक के स्मूथ रीसेंटर */}
          <TouchableOpacity style={styles.topRightGpsFab} activeOpacity={0.85} onPress={handleSmoothRecenter}>
            <Text style={{ fontSize: 22 }}>🎯</Text>
          </TouchableOpacity>

          {/* 4 Left Metric Boxes */}
          <View style={styles.leftMetricsContainer}>
            {/* ⚡ 1. अंतिम राइड पर टैप करने पर पूरी हिस्ट्री और सपोर्ट मोडल */}
            <TouchableOpacity style={styles.metricBoxCard} activeOpacity={0.8} onPress={() => setShowLastRideModal(true)}>
              <Text style={styles.metricLabelTop}>{t.lastRide}</Text>
              <Text style={styles.metricValMain}>₹{lastRideFare}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.metricBoxCard} onPress={() => setActiveScreen('ORDERS')}>
              <Text style={styles.metricLabelTop}>{t.todayEarn}</Text>
              <Text style={[styles.metricValMain, { color: '#16a34a' }]}>₹{todayEarn}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.metricBoxCard} onPress={() => setActiveScreen('ORDERS')}>
              <Text style={styles.metricLabelTop}>{t.totalRide}</Text>
              <Text style={styles.metricValMain}>{totalRidesCount}</Text>
            </TouchableOpacity>

            {/* ⚡ 2. कुल किमी पर टैप करने पर फ्री रन और पेड रन का ब्रेकडाउन */}
            <TouchableOpacity style={styles.metricBoxCard} activeOpacity={0.8} onPress={() => setShowKmBreakdownModal(true)}>
              <Text style={styles.metricLabelTop}>{t.totalKm}</Text>
              <Text style={styles.metricValMain}>{totalKmVal}</Text>
            </TouchableOpacity>
          </View>

          {/* ⚡ बिना ब्लिंक वाला स्थिर मैप (postMessage द्वारा कंट्रोल्ड) */}
          <View style={styles.mapCanvasWrapper}>
            {Platform.OS === 'web' ? (
              <iframe 
                ref={mapIframeRef}
                title="Live Map" 
                srcDoc={`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>body,html,#map{margin:0;padding:0;width:100%;height:100%;background:#e5e7eb;}</style></head><body><div id="map"></div><script>var map=L.map('map',{zoomControl:false}).setView([${driverCoords.lat},${driverCoords.lng}],15);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);var marker=L.marker([${driverCoords.lat},${driverCoords.lng}]).addTo(map);window.addEventListener('message',function(e){if(e.data&&e.data.type==='RECENTER'){map.panTo([e.data.lat,e.data.lng],{animate:true,duration:1});marker.setLatLng([e.data.lat,e.data.lng]);}});</script></body></html>`} 
                style={styles.webMapIframe} 
                frameBorder="0" 
              />
            ) : (
              <View style={styles.mobileMapFallback}><Text style={{ color: '#94a3b8' }}>📍 लाइव मैप</Text></View>
            )}
          </View>

          {/* ⚡ इमेज 3 अनुसार: विस्तृत व बड़ा एक्सेप्ट राइड कार्ड (Expanded Accept Card) */}
          {currentRideItem && (
            <View style={styles.fixedBottomCardWrapperClean}>
              <View style={styles.exactImageCard}>
                <View style={styles.exactCardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exactCardTitle}>{t.acceptRide}</Text>
                    <Text style={styles.exactCardSubTitle}>{t.reviewDetails}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                    <Text style={styles.exactCardRideId}>#ID: {currentRideItem.id}</Text>
                    <Text style={styles.exactCardDriverName}>{DRIVER_NAME}</Text>
                  </View>
                </View>

                {/* ⚡ विस्तृत लोकेशन कार्ड: 2-3 लाइन में पूरा पता बिना कटे */}
                <View style={styles.exactLocationCard}>
                  <View style={styles.exactLocRow}>
                    <View style={styles.locRowLeftPart}>
                      <View style={styles.greenCircleDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locSmallTag}>{t.pickupLocation}</Text>
                        <Text style={styles.locNameBold}>{currentRideItem.pickup}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                      <Text style={styles.kmBoldText}>1.0 km</Text>
                      <Text style={styles.kmSubText}>{t.away}</Text>
                    </View>
                  </View>

                  <View style={styles.verticalDottedDividerShort} />

                  <View style={styles.exactLocRow}>
                    <View style={styles.locRowLeftPart}>
                      <View style={styles.redCircleDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locSmallTag}>{t.dropLocation}</Text>
                        <Text style={styles.locNameBold}>{currentRideItem.dropoff}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                      <Text style={styles.kmBoldText}>{currentRideItem.total_distance_km || '5'} km</Text>
                      <Text style={styles.kmSubText}>{t.trip}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.exactMetaDetailsBox}>
                  <View style={styles.metaDetailRow}>
                    <View style={styles.metaLeftGroup}>
                      <Text style={{ fontSize: 14 }}>🕒</Text>
                      <Text style={styles.metaLabelText}>{t.estimatedTime}</Text>
                    </View>
                    <Text style={styles.metaValueText}>18 min</Text>
                  </View>
                  <View style={styles.metaRowLine} />
                  <View style={styles.metaDetailRow}>
                    <View style={styles.metaLeftGroup}>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: '#16a34a' }}>₹</Text>
                      <Text style={styles.metaLabelText}>{t.fareEstimate}</Text>
                    </View>
                    <Text style={styles.metaValueText}>₹{currentRideItem.fare}</Text>
                  </View>
                  <View style={styles.metaRowLine} />
                  <View style={styles.metaDetailRow}>
                    <View style={styles.metaLeftGroup}>
                      <Text style={{ fontSize: 14 }}>🚗</Text>
                      <Text style={styles.metaLabelText}>{t.rideType}</Text>
                    </View>
                    <Text style={styles.metaValueText}>Economy</Text>
                  </View>
                </View>

                {/* 10s Timer Button */}
                <View style={styles.exactButtonsRow}>
                  <TouchableOpacity style={styles.exactDeclineBtn} onPress={() => handleDeclineRide(currentRideItem.id)}>
                    <Text style={styles.exactDeclineBtnText}>{t.decline}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.exactAcceptBtn, 
                      requestTimer > 0 && { backgroundColor: '#e2e8f0', borderColor: '#cbd5e1' }
                    ]} 
                    disabled={requestTimer > 0}
                    onPress={() => handleAcceptRide(currentRideItem)}
                  >
                    <Text style={[
                      styles.exactAcceptBtnText, 
                      requestTimer > 0 && { color: '#64748b' }
                    ]}>
                      {requestTimer > 0 ? `${t.waitingPrefix} (${requestTimer}s)` : t.accept}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

        </View>
      )}

      {/* =========================================================================
         ⚡ 1. अंतिम राइड हिस्ट्री व सपोर्ट मोडल (Last Ride History & Support Modal)
         ========================================================================= */}
      <Modal visible={showLastRideModal} transparent={true} animationType="slide" onRequestClose={() => setShowLastRideModal(false)}>
        <View style={billStyles.modalOverlay}>
          <View style={billStyles.billCardContainer}>
            <View style={billStyles.billHeaderRow}>
              <View>
                <Text style={billStyles.billTitleText}>अंतिम राइड का विवरण (LAST RIDE)</Text>
                <Text style={billStyles.billOrderIdText}>Order ID: {lastRideDetails.id}</Text>
              </View>
              <TouchableOpacity style={billStyles.closeCircleBtn} onPress={() => setShowLastRideModal(false)}>
                <Text style={billStyles.closeCrossText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={billStyles.totalAmountHighlightBox}>
                <Text style={billStyles.totalAmountLabel}>कुल प्राप्त किराया</Text>
                <Text style={billStyles.totalAmountValue}>₹{lastRideDetails.fare}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#166534', marginTop: 2 }}>
                  यात्री रेटिंग: ⭐ {lastRideDetails.ratingGiven}.0
                </Text>
              </View>

              <View style={billStyles.tripMetricRow}>
                <View style={billStyles.metricCol}>
                  <Text style={billStyles.metricLabelSmall}>दूरी</Text>
                  <Text style={billStyles.metricValBig}>{lastRideDetails.distance}</Text>
                </View>
                <View style={billStyles.metricDivider} />
                <View style={billStyles.metricCol}>
                  <Text style={billStyles.metricLabelSmall}>समय</Text>
                  <Text style={billStyles.metricValBig}>{lastRideDetails.duration}</Text>
                </View>
                <View style={billStyles.metricDivider} />
                <View style={billStyles.metricCol}>
                  <Text style={billStyles.metricLabelSmall}>यात्री</Text>
                  <Text style={billStyles.metricValBig}>{lastRideDetails.customer}</Text>
                </View>
              </View>

              <View style={billStyles.routeBox}>
                <Text style={billStyles.routeAddressText}>🟢 पिकअप: {lastRideDetails.pickup}</Text>
                <View style={{ height: 10 }} />
                <Text style={billStyles.routeAddressText}>🔴 ड्रॉप: {lastRideDetails.drop}</Text>
              </View>

              {/* ⚡ इस राइड में समस्या / सहायता लें बटन */}
              <TouchableOpacity 
                style={billStyles.receiptHelpBtn}
                onPress={() => {
                  setShowLastRideModal(false);
                  setActiveScreen('ORDERS');
                }}
              >
                <Text style={{ fontSize: 16 }}>🎧</Text>
                <Text style={billStyles.receiptHelpBtnText}>
                  इस राइड में कोई समस्या है? (सहायता लें)
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={billStyles.doneButton} onPress={() => setShowLastRideModal(false)}>
              <Text style={billStyles.doneButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
         ⚡ 2. कुल किमी ब्रेकडाउन मोडल (फ्री रन + पेड रन)
         ========================================================================= */}
      <Modal visible={showKmBreakdownModal} transparent={true} animationType="fade" onRequestClose={() => setShowKmBreakdownModal(false)}>
        <View style={serviceHelpPopupStyles.overlay}>
          <View style={[serviceHelpPopupStyles.card, { maxWidth: 340 }]}>
            <View style={[serviceHelpPopupStyles.bulbCircle, { backgroundColor: '#e0f2fe' }]}>
              <Text style={{ fontSize: 32 }}>🛣️</Text>
            </View>

            <Text style={serviceHelpPopupStyles.titleText}>दूरी का विवरण (KM BREAKDOWN)</Text>

            <View style={{ width: '100%', marginVertical: 14, gap: 12 }}>
              <View style={{ backgroundColor: '#fef3c7', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#fde047' }}>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#854d0e' }}>
                  🟡 फ्री रन (Free Run): {freeRunKm} KM
                </Text>
                <Text style={{ fontSize: 11.5, color: '#a16207', marginTop: 4, fontWeight: '700' }}>
                  बुकिंग स्वीकार करने के बाद पिकअप लोकेशन तक पहुँचना।
                </Text>
              </View>

              <View style={{ backgroundColor: '#dcfce7', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#86efac' }}>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#166534' }}>
                  🟢 पेड रन (Paid Run): {paidRunKm} KM
                </Text>
                <Text style={{ fontSize: 11.5, color: '#15803d', marginTop: 4, fontWeight: '700' }}>
                  OTP डालने के बाद यात्री को ड्रॉप करने तक की दूरी।
                </Text>
              </View>

              <View style={{ backgroundColor: '#f1f5f9', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#0f172a' }}>
                  कुल चली दूरी: {totalKmVal} KM
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={serviceHelpPopupStyles.closeBtn} 
              onPress={() => setShowKmBreakdownModal(false)}
            >
              <Text style={serviceHelpPopupStyles.closeBtnText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
         SIDEBAR DRAWER MENU
         ========================================================================= */}
      <Modal visible={isDrawerMenuOpen} transparent={true} animationType="fade">
        <View style={menuStyles.overlay}>
          <View style={menuStyles.drawerContainer}>
            
            <View style={menuStyles.profileHeaderBox}>
              <View style={menuStyles.avatarLargeCircle}>
                <Text style={{ fontSize: 32 }}>👨‍✈️</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={menuStyles.profileNameText}>{DRIVER_NAME}</Text>
                <Text style={menuStyles.profilePhoneText}>+91 {DRIVER_PHONE}</Text>
                <View style={menuStyles.ratingTagRow}>
                  <Text style={menuStyles.ratingTagText}>⭐ {DRIVER_RATING} / 5.0</Text>
                  <Text style={menuStyles.vehicleNoText}>• MP-04-TA-5566</Text>
                </View>
              </View>
            </View>

            <ScrollView style={{ flex: 1, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              
              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { setIsDrawerMenuOpen(false); setActiveSubModal('SERVICE_MANAGER'); }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#fef3c7' }]}><Text style={{ fontSize: 18 }}>🚖</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.serviceManager}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.serviceManagerSub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { setIsDrawerMenuOpen(false); setActiveSubModal('SUBSCRIPTION_HISTORY'); }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#dcfce7' }]}><Text style={{ fontSize: 18 }}>🎟️</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.subscriptionHistory}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.subscriptionHistorySub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { setIsDrawerMenuOpen(false); setActiveSubModal('DOCS'); }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#e0f2fe' }]}><Text style={{ fontSize: 18 }}>📑</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.carDocs}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.carDocsSub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { 
                  setIsDrawerMenuOpen(false); 
                  const nextMode = appMode === 'DRIVER' ? 'OPERATOR' : 'DRIVER';
                  setAppMode(nextMode); 
                  Alert.alert('Role Changed', `Current mode: ${nextMode}`); 
                }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#fae8ff' }]}><Text style={{ fontSize: 18 }}>🏢</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.operatorFleet}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.operatorFleetSub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { setIsDrawerMenuOpen(false); Linking.openURL('tel:18001234567'); }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#ede9fe' }]}><Text style={{ fontSize: 18 }}>🎧</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.driverSupport}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.driverSupportSub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={menuStyles.menuRowItem} 
                onPress={() => { setIsDrawerMenuOpen(false); setActiveSubModal('SETTINGS'); }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#f1f5f9' }]}>
                  <Text style={{ fontSize: 18 }}>⚙️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={menuStyles.menuItemTitle}>{t.appSettings}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.appSettingsSub}</Text>
                </View>
                <Text style={menuStyles.arrowGray}>➔</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[menuStyles.menuRowItem, { borderBottomWidth: 0, marginTop: 10 }]} 
                onPress={() => {
                  setIsDrawerMenuOpen(false);
                  Alert.alert(appLang === 'EN' ? 'Logout' : 'लॉगआउट', appLang === 'EN' ? 'Are you sure you want to log out?' : 'क्या आप वाकई लॉगआउट करना चाहते हैं?', [
                    { text: appLang === 'EN' ? 'Cancel' : 'नहीं', style: 'cancel' },
                    { text: appLang === 'EN' ? 'Logout' : 'हाँ, लॉगआउट', onPress: () => setIsRegistered(false), style: 'destructive' }
                  ]);
                }}
              >
                <View style={[menuStyles.menuIconSquare, { backgroundColor: '#fee2e2' }]}>
                  <Text style={{ fontSize: 18 }}>🚪</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[menuStyles.menuItemTitle, { color: '#ef4444' }]}>{t.logout}</Text>
                  <Text style={menuStyles.menuItemSub}>{t.logoutSub}</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>

            <TouchableOpacity style={menuStyles.closeDrawerBtn} onPress={() => setIsDrawerMenuOpen(false)}>
              <Text style={menuStyles.closeDrawerBtnText}>{t.closeMenu}</Text>
            </TouchableOpacity>

          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsDrawerMenuOpen(false)} />
        </View>
      </Modal>

      {/* =========================================================================
          SUB-MODAL 1: SERVICE MANAGER (3 श्रेणियां + बिंदु 6: सहायता टेक्स्ट)
         ========================================================================= */}
      <Modal visible={activeSubModal === 'SERVICE_MANAGER'} animationType="slide">
        <SafeAreaView style={modalStyles.subPageContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={modalStyles.subPageHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }} style={modalStyles.backCircleBtn}>
                <Text style={modalStyles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={modalStyles.subPageHeaderTitle}>Service Manager</Text>
            </View>
            <TouchableOpacity 
              style={modalStyles.headerHelpBtn} 
              onPress={() => setServiceHelpModal(true)}
            >
              <Text style={{ fontSize: 14 }}>🎧</Text>
              <Text style={modalStyles.headerHelpText}>{t.help}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            {services.map((srv) => (
              <TouchableOpacity 
                key={srv.id} 
                style={[modalStyles.serviceManagerCard, !srv.active && { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }]}
                activeOpacity={0.8}
                onPress={() => toggleService(srv.id)}
              >
                <View style={modalStyles.serviceCarYellowCircle}>
                  <Text style={{ fontSize: 28 }}>🚕</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={modalStyles.serviceNameText}>{srv.name}</Text>
                  <Text style={modalStyles.serviceDescText}>{srv.desc}</Text>
                </View>
                <View style={[modalStyles.serviceActiveBadge, !srv.active && { backgroundColor: '#f1f5f9' }]}>
                  <Text style={[modalStyles.serviceActiveText, !srv.active && { color: '#94a3b8' }]}>
                    {srv.active ? '✓ Active' : 'Off'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={modalStyles.serviceHintBox}>
              <Text style={modalStyles.serviceHintTitle}>💡 {appLang === 'EN' ? 'Service Tips' : 'सर्विस टिप्स'}</Text>
              <Text style={modalStyles.serviceHintText}>
                {appLang === 'EN' 
                  ? 'Only rides belonging to active vehicle categories will be routed to your driver device.' 
                  : 'जो श्रेणी आप सक्रिय रखेंगे, केवल उसी श्रेणी की राइड्स आपके पास आएँगी।'}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ⚡ सर्विस मैनेजर हेल्प पॉप-अप */}
      <Modal visible={serviceHelpModal} transparent={true} animationType="fade">
        <View style={serviceHelpPopupStyles.overlay}>
          <View style={serviceHelpPopupStyles.card}>
            <View style={serviceHelpPopupStyles.bulbCircle}>
              <Text style={{ fontSize: 32 }}>💡</Text>
            </View>

            <Text style={serviceHelpPopupStyles.titleText}>
              {appLang === 'EN' ? 'Service Manager Help' : 'सर्विस मैनेजर सहायता'}
            </Text>

            <Text style={serviceHelpPopupStyles.messageText}>
              {appLang === 'EN'
                ? 'Select category according to your vehicle.'
                : 'आपकी गाड़ी के अनुसार कैटेगरी सेलेक्ट करें।'}
            </Text>

            <TouchableOpacity 
              style={serviceHelpPopupStyles.closeBtn} 
              onPress={() => setServiceHelpModal(false)}
            >
              <Text style={serviceHelpPopupStyles.closeBtnText}>
                {appLang === 'EN' ? 'CLOSE' : 'समझ गया (CLOSE)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          SUB-MODAL 2: SUBSCRIPTION PASS & HISTORY
         ========================================================================= */}
      <Modal visible={activeSubModal === 'SUBSCRIPTION_HISTORY'} animationType="slide">
        <SafeAreaView style={modalStyles.subPageContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={modalStyles.subPageHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }} style={modalStyles.backCircleBtn}>
                <Text style={modalStyles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={modalStyles.subPageHeaderTitle}>{appLang === 'EN' ? 'Subscription Pass & History' : 'सब्स्क्रिप्शन पास व इतिहास'}</Text>
            </View>
            <TouchableOpacity 
              style={modalStyles.headerHelpBtn} 
              onPress={() => Alert.alert(t.help, 'पास समाप्त होने पर आप Ride Accept नहीं कर सकते।')}
            >
              <Text style={{ fontSize: 14 }}>🎧</Text>
              <Text style={modalStyles.headerHelpText}>{t.help}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={modalStyles.activePassBigCard}>
              <View style={modalStyles.passHeaderRow}>
                <View style={modalStyles.activePillTag}>
                  <Text style={modalStyles.activePillText}>{appLang === 'EN' ? '● CURRENT ACTIVE PASS' : '● वर्तमान सक्रिय पास'}</Text>
                </View>
                <Text style={modalStyles.passPriceTag}>₹{currentPass.price}</Text>
              </View>

              <Text style={modalStyles.passMainHeading}>{currentPass.planName}</Text>
              
              <View style={modalStyles.passDateGrid}>
                <View style={modalStyles.passDateItem}>
                  <Text style={modalStyles.passDateLabel}>{appLang === 'EN' ? 'Start Date' : 'पास शुरू तिथि'}</Text>
                  <Text style={modalStyles.passDateVal}>{currentPass.startDate}</Text>
                </View>
                <View style={modalStyles.passDateItem}>
                  <Text style={modalStyles.passDateLabel}>{appLang === 'EN' ? 'Expiry Date' : 'वैधता समाप्ति'}</Text>
                  <Text style={[modalStyles.passDateVal, { color: '#ef4444' }]}>{currentPass.expiryDate}</Text>
                </View>
                <View style={modalStyles.passDateItem}>
                  <Text style={modalStyles.passDateLabel}>{appLang === 'EN' ? 'Status' : 'स्थिति'}</Text>
                  <Text style={[modalStyles.passDateVal, { color: '#16a34a' }]}>{currentPass.daysLeft}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={modalStyles.renewPassActionBtn}
                onPress={() => Alert.alert('Recharge', 'ऑनलाइन पेमेंट से अगला पास जोड़ें।')}
              >
                <Text style={modalStyles.renewPassActionText}>{appLang === 'EN' ? '⚡ Renew / Extend Pass' : '⚡ पास आगे बढ़ाएं / रीन्यू करें'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={modalStyles.historySectionHeading}>{appLang === 'EN' ? 'Subscription Purchase History' : 'सब्स्क्रिप्शन खरीद इतिहास (Past Passes)'}</Text>

            {subscriptionHistory.map((item) => (
              <View key={item.id} style={modalStyles.historyItemCard}>
                <View style={modalStyles.historyItemTop}>
                  <View>
                    <Text style={modalStyles.historyPlanTitle}>{item.plan}</Text>
                    <Text style={modalStyles.historyDateText}>{item.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={modalStyles.historyAmountText}>₹{item.amount}</Text>
                    <Text style={[modalStyles.historyStatusText, item.status.includes('सक्रिय') ? { color: '#16a34a' } : { color: '#94a3b8' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={modalStyles.historyTxnRow}>
                  <Text style={modalStyles.historyTxnText}>TXN ID: {item.txnId}</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Invoice', `Invoice #${item.txnId} downloaded.`)}>
                    <Text style={modalStyles.downloadReceiptLink}>रसीद 📥</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* =========================================================================
          SUB-MODAL 3: VEHICLE ALL DOCUMENTS
         ========================================================================= */}
      <Modal visible={activeSubModal === 'DOCS'} animationType="slide">
        <SafeAreaView style={modalStyles.subPageContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={modalStyles.subPageHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }} style={modalStyles.backCircleBtn}>
                <Text style={modalStyles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={modalStyles.subPageHeaderTitle}>{appLang === 'EN' ? 'Vehicle Documents' : 'कार और चालक दस्तावेज़'}</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={modalStyles.docsBanner}>
              <Text style={modalStyles.docsBannerTitle}>MP-04-TA-5566</Text>
              <Text style={modalStyles.docsBannerSub}>
                {appLang === 'EN' 
                  ? 'All documents must be valid for commercial taxi driving. Tap any upload button to snap a photo.' 
                  : 'कमर्शियल कार संचालन के लिए सभी दस्तावेज़ मान्य होने चाहिए। पेंडिंग दस्तावेज़ पर टैप करके लाइव कैमरा से फोटो खींचकर अपलोड करें।'}
              </Text>
            </View>

            {vehicleDocuments.map((doc) => (
              <View key={doc.id} style={modalStyles.docRowCard}>
                <View style={modalStyles.docIconWrap}>
                  <Text style={{ fontSize: 22 }}>{doc.icon}</Text>
                </View>
                
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={modalStyles.docName}>{doc.title}</Text>
                  <Text style={modalStyles.docSub}>{doc.desc}</Text>
                </View>

                <TouchableOpacity 
                  style={[
                    modalStyles.docStatusBtn,
                    doc.status === 'VERIFIED' && modalStyles.statusBtnVerified,
                    doc.status === 'PENDING' && modalStyles.statusBtnPending,
                    doc.status === 'UPLOAD' && modalStyles.statusBtnUpload
                  ]}
                  onPress={() => {
                    if (doc.status === 'VERIFIED') {
                      Alert.alert('Verified', `${doc.title} is already verified.`);
                    } else {
                      triggerCameraUpload(doc.id, doc.title);
                    }
                  }}
                >
                  <Text style={[
                    modalStyles.docStatusText,
                    doc.status === 'VERIFIED' && { color: '#16a34a' },
                    doc.status === 'PENDING' && { color: '#ca8a04' },
                    doc.status === 'UPLOAD' && { color: '#0284c7' }
                  ]}>
                    {doc.status === 'VERIFIED' ? (appLang === 'EN' ? '✓ Verified' : '✓ सत्यापित') : doc.status === 'PENDING' ? (appLang === 'EN' ? '⏳ Pending' : '⏳ पेंडिंग') : (appLang === 'EN' ? '📷 Upload' : '📷 अपलोड')}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#f1f5f9' }}>
            <TouchableOpacity style={modalStyles.doneBtn} onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }}>
              <Text style={modalStyles.doneBtnText}>{appLang === 'EN' ? 'Done' : 'पूर्ण (Done)'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* =========================================================================
          SUB-MODAL 4: APP SETTINGS & LANGUAGE
         ========================================================================= */}
      <Modal visible={activeSubModal === 'SETTINGS'} animationType="slide">
        <SafeAreaView style={modalStyles.subPageContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={modalStyles.subPageHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }} style={modalStyles.backCircleBtn}>
                <Text style={modalStyles.backCircleText}>←</Text>
              </TouchableOpacity>
              <Text style={modalStyles.subPageHeaderTitle}>{appLang === 'EN' ? 'Settings & Language' : 'ऐप सेटिंग्स व भाषा'}</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748b', marginBottom: 12 }}>
              {appLang === 'EN' ? 'SELECT LANGUAGE' : 'पसंदीदा भाषा चुनें'}
            </Text>

            <TouchableOpacity 
              style={[
                modalStyles.langOptionCard, 
                appLang === 'HI' && modalStyles.langOptionCardActive
              ]}
              onPress={() => setAppLang('HI')}
            >
              <View>
                <Text style={modalStyles.langTitleText}>🇮🇳 हिंदी (Hindi)</Text>
                <Text style={modalStyles.langSubText}>डिफ़ॉल्ट भाषा (सभी मेन्यू और फीचर्स हिंदी में)</Text>
              </View>
              <View style={modalStyles.radioOuter}>
                {appLang === 'HI' && <View style={modalStyles.radioInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                modalStyles.langOptionCard, 
                appLang === 'EN' && modalStyles.langOptionCardActive
              ]}
              onPress={() => setAppLang('EN')}
            >
              <View>
                <Text style={modalStyles.langTitleText}>🇬🇧 English</Text>
                <Text style={modalStyles.langSubText}>System Language (Menus and Navigation in English)</Text>
              </View>
              <View style={modalStyles.radioOuter}>
                {appLang === 'EN' && <View style={modalStyles.radioInner} />}
              </View>
            </TouchableOpacity>

            <View style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 13, fontWeight: '900', color: '#64748b', marginBottom: 12 }}>
                {appLang === 'EN' ? 'AUDIO & NAVIGATION' : 'नेविगेशन व ऑडियो सेटिंग्स'}
              </Text>
              <View style={modalStyles.settingToggleRow}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0f172a' }}>🔊 Audio Ride Alerts</Text>
                <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>ON</Text>
              </View>
              <View style={modalStyles.settingToggleRow}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0f172a' }}>🎯 Auto GPS Tracking</Text>
                <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>ON</Text>
              </View>
            </View>
          </ScrollView>

          <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#f1f5f9' }}>
            <TouchableOpacity style={modalStyles.doneBtn} onPress={() => { setActiveSubModal(null); setIsDrawerMenuOpen(true); }}>
              <Text style={modalStyles.doneBtnText}>{t.save}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}
