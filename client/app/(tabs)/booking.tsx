import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { MapPin, Calendar, Clock, CreditCard as Edit2, ArrowLeft } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from '@/components/BottomSheet';
import OTPInput from '@/components/OTPInput';
import BookingSuccess from '@/components/BookingSuccess';
import { getUserData, saveUserData } from '@/utils/storage';
import { branchService, bookingService } from '@/services/api';
import type { Branch } from '@/services/api/types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const TIME_SLOT_WIDTH = (WINDOW_WIDTH - 48) / 3;
const DATE_CARD_WIDTH = WINDOW_WIDTH * 0.3;
const BRANCH_CARD_WIDTH = WINDOW_WIDTH * 0.45;
const BRANCH_CARD_HEIGHT = BRANCH_CARD_WIDTH * 0.6;

const availableDates = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), i);
  return {
    date,
    dayName: format(date, 'EEE'),
    dayNumber: format(date, 'd'),
    value: format(date, 'yyyy-MM-dd'),
  };
});

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 24; hour++) {
    if (hour === 24) {
      slots.push({
        label: '00:00',
        value: '00:00',
      });
      continue;
    }

    [0, 15, 30, 45].forEach(minute => {
      const time = setMinutes(setHours(new Date(), hour), minute);
      slots.push({
        label: format(time, 'h:mm a'),
        value: format(time, 'HH:mm'),
      });
    });
  }
  return slots;
};

function BranchCard({ branch, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.branchCard, isSelected && styles.branchCardSelected]}
      onPress={() => onSelect(branch._id)}
    >
      <Image source={{ uri: branch.images[0] }} style={styles.branchImage} />
      <View style={styles.branchContent}>
        <Text style={styles.branchName} numberOfLines={1}>{branch.name}</Text>
        <Text style={styles.branchAddress} numberOfLines={1}>{branch.address}</Text>
      </View>
      <View style={[styles.branchOverlay, isSelected && styles.branchOverlaySelected]} />
    </TouchableOpacity>
  );
}

export default function BookingScreen() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedPhone, setSavedPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  useEffect(() => {
    loadUserData();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      setBranchesError(null);
      const response = await branchService.getBranches();
      setBranches(response || []);
    } catch (err) {
      setBranchesError('Failed to load branches. Please try again.');
      console.error('Error fetching branches:', err);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      setResendTimer(30);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, resendTimer]);

  const loadUserData = async () => {
    const userData = await getUserData();
    if (userData) {
      setName(userData.name);
      setPhone(userData.phone);
      setSavedPhone(userData.phone);
    }
  };

  const isFormValid = selectedBranch && selectedDate && selectedTime;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedBranch || !selectedDate || !selectedTime) {
      return;
    }

    const userData = await getUserData();
    if (userData) {
      setName(userData.name);
      setPhone(userData.phone);
      setSavedPhone(userData.phone);
    }
    bottomSheetRef.current?.present();
  }, [selectedBranch, selectedDate, selectedTime]);

  const createBooking = async () => {
    try {
      setLoading(true);
      setBookingError(null);

      const selectedBranchData = branches.find(b => b._id === selectedBranch);
      if (!selectedBranchData) {
        throw new Error('Selected branch not found');
      }
     
      const userData = await getUserData();
      let userid = userData?.userId
      if(!userid){
        userid = await saveUserData({name, phone})
      }
      const bookingData = {
        userid: userid,
        branchName: selectedBranchData.name,
        date: selectedDate,
        time: selectedTime,
        fullName: name,
        phoneNumber: phone,
        status: 0
      };

      console.log(bookingData)

      await bookingService.createBooking(bookingData);
      setShowSuccess(true);
      bottomSheetRef.current?.dismiss();
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!name || !phone) return;

    setLoading(true);

    if (phone === savedPhone || !savedPhone) {
      await saveUserData({name, phone });
      createBooking();
      return;
    }

    await saveUserData({ name, phone });
    setTimeout(() => {
      setLoading(false);
      setShowOTP(true);
      setResendDisabled(true);
    }, 1000);
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setResendTimer(30);
    setTimeout(() => {
      setOTP('');
      setOtpError(false);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return;

    setLoading(true);
    setTimeout(() => {
      if (otp === '123456') {
        setLoading(false);
        createBooking();
        setOtpError(false);
        setSavedPhone(phone);
      } else {
        setLoading(false);
        setOtpError(true);
      }
    }, 1500);
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
    setShowOTP(false);
  };

  const handleCancelEdit = () => {
    setPhone(savedPhone);
    setIsEditingPhone(false);
    setShowOTP(true);
  };

  if (showSuccess) {
    const selectedBranchData = branches.find(b => b._id === selectedBranch);
    return (
      <BookingSuccess
        bookingDetails={{
          branch: selectedBranchData?.name || '',
          date: format(new Date(selectedDate), 'MMMM d, yyyy'),
          time: selectedTime,
          name,
          phone,
        }}
        onClose={() => {
          setShowSuccess(false);
          setSelectedBranch(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setShowOTP(false);
          setOTP('');
          setIsEditingPhone(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Book a Room</Text>
            <Text style={styles.subtitle}>Select your preferred branch, date, and time</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <MapPin size={20} color="#FF0099" />
                <Text style={styles.label}>Select Branch</Text>
              </View>
              {branchesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ED188D" />
                </View>
              ) : branchesError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{branchesError}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={fetchBranches}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.branchScrollContent}
                >
                  {branches.map((branch) => (
                    <BranchCard
                      key={branch._id}
                      branch={branch}
                      isSelected={selectedBranch === branch._id}
                      onSelect={setSelectedBranch}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Calendar size={20} color="#FF0099" />
                <Text style={styles.label}>Select Date</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateScrollContent}
              >
                {availableDates.map((date) => (
                  <TouchableOpacity
                    key={date.value}
                    style={[
                      styles.dateCard,
                      selectedDate === date.value && styles.dateCardSelected,
                    ]}
                    onPress={() => handleDateSelect(date.value)}
                  >
                    <Text 
                      style={[
                        styles.dayName,
                        selectedDate === date.value && styles.dateTextSelected,
                      ]}
                    >
                      {date.dayName}
                    </Text>
                    <Text 
                      style={[
                        styles.dayNumber,
                        selectedDate === date.value && styles.dateTextSelected,
                      ]}
                    >
                      {date.dayNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Clock size={20} color="#FF0099" />
                <Text style={styles.label}>Select Time</Text>
              </View>
              <View style={styles.timeGrid}>
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      selectedTime === slot.value && styles.timeSlotSelected,
                    ]}
                    onPress={() => handleTimeSelect(slot.value)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTime === slot.value && styles.timeSlotTextSelected,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>CONFIRM BOOKING</Text>
          </TouchableOpacity>
        </View>

        <BottomSheet 
          bottomSheetRef={bottomSheetRef}
          snapPoints={['60%', '90%']}
        >
          <ScrollView 
            style={styles.bottomSheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!showOTP ? (
              <>
                <Text style={styles.bottomSheetTitle}>Enter Your Details</Text>
                <Text style={styles.bottomSheetSubtitle}>
                  {savedPhone 
                    ? 'Review your details before confirming'
                    : 'Please provide your name and phone number'}
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666666"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#666666"
                    keyboardType="phone-pad"
                  />
                  {savedPhone && (
                    <Text style={styles.noteText}>
                      {phone !== savedPhone 
                        ? 'You will need to verify your new phone number'
                        : 'Using your verified phone number'}
                    </Text>
                  )}
                </View>

                {bookingError && (
                  <Text style={styles.bookingErrorText}>{bookingError}</Text>
                )}

                <TouchableOpacity
                  style={[styles.confirmButton, loading && styles.loadingButton]}
                  onPress={handleConfirmBooking}
                  disabled={loading || !name || !phone}
                >
                  <Text style={styles.confirmButtonText}>
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.otpHeader}>
                  {isEditingPhone ? (
                    <TouchableOpacity 
                      style={styles.backButton} 
                      onPress={handleCancelEdit}
                    >
                      <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.editButton} 
                      onPress={handleEditPhone}
                    >
                      <Edit2 color="#FFFFFF" size={20} />
                      <Text style={styles.editButtonText}>Edit Number</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isEditingPhone ? (
                  <>
                    <Text style={styles.bottomSheetTitle}>Edit Phone Number</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter new phone number"
                        placeholderTextColor="#666666"
                        keyboardType="phone-pad"
                        autoFocus
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.confirmButton, loading && styles.loadingButton]}
                      onPress={() => {
                        setIsEditingPhone(false);
                        setShowOTP(true);
                        handleResendOTP();
                      }}
                      disabled={loading || !phone || phone === savedPhone}
                    >
                      <Text style={styles.confirmButtonText}>
                        Verify New Number
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.bottomSheetTitle}>Verify Your Number</Text>
                    <Text style={styles.bottomSheetSubtitle}>
                      Enter the 6-digit code sent to {phone}
                    </Text>

                    <View style={styles.otpContainer}>
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={setOTP}
                        error={otpError}
                      />
                      {otpError && (
                        <Text style={styles.otpErrorText}>Invalid OTP. Please try again.</Text>
                      )}
                    </View>

                    <View style={styles.resendContainer}>
                      <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={resendDisabled}
                      >
                        <Text style={[
                          styles.resendText,
                          resendDisabled && styles.resendTextDisabled
                        ]}>
                          {resendDisabled 
                            ? `Resend code in ${resendTimer}s`
                            : 'Resend code'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.confirmButton, loading && styles.loadingButton]}
                      onPress={handleVerifyOTP}
                      disabled={loading || otp.length !== 6}
                    >
                      <Text style={styles.confirmButtonText}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </ScrollView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 60 : 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  form: {
    gap: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    height: BRANCH_CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: BRANCH_CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#ED188D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  branchScrollContent: {
    paddingVertical: 8,
    gap: 8,
    paddingHorizontal: 8,
  },
  branchCard: {
    width: BRANCH_CARD_WIDTH,
    height: BRANCH_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 8,
    backgroundColor: '#1A1A1A',
  },
  branchCardSelected: {
    borderColor: '#FF0099',
    borderWidth: 2,
  },
  branchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  branchContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 1,
  },
  branchName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  branchAddress: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  branchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  branchOverlaySelected: {
    backgroundColor: 'rgba(255,0,153,0.1)',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(255,0,153,0.3))',
  },
  dateScrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  dateCard: {
    width: DATE_CARD_WIDTH,
    height: 80,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 8,
  },
  dateCardSelected: {
    backgroundColor: '#FF0099',
    borderColor: '#FF0099',
  },
  dayName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  dayNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  timeSlot: {
    width: TIME_SLOT_WIDTH,
    height: 44,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  timeSlotSelected: {
    backgroundColor: '#FF0099',
    borderColor: '#FF0099',
  },
  timeSlotText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#000000',
  },
  submitButton: {
    backgroundColor: '#FF0099',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bottomSheetSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  noteText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#FF0099',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loadingButton: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  otpErrorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 8,
  },
  bookingErrorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  backButton: {
    padding: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  resendText: {
    color: '#FF0099',
    fontSize: 14,
  },
  resendTextDisabled: {
    color: '#666666',
  },
});