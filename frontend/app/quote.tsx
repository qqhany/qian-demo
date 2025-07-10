import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axiosInstance';

export default function QuoteScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [vehicleInfo, setVehicleInfo] = useState({
        type: 'sedan',
        year: new Date().getFullYear().toString(),
        engineCapacity: '',
        brand: '',
        model: '',
    });

    const [driverInfo, setDriverInfo] = useState({
        name: '',
        birthYear: new Date().getFullYear().toString(),
        licenseNumber: '',
        claimsHistory: '0',
    });

    const vehicleTypes = [
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Pickup', value: 'pickup' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Motorcycle', value: 'motorcycle' },
    ];

    const years = Array.from({ length: 30 }, (_, i) =>
        (new Date().getFullYear() - i).toString()
    );

    const birthYears = Array.from({ length: 50 }, (_, i) =>
        (new Date().getFullYear() - i).toString()
    );

    const claimsHistory = [
        { label: 'No claims', value: '0' },
        { label: '1 claim', value: '1' },
        { label: '2 claims', value: '2' },
        { label: '3+ claims', value: '3' },
    ];

    const handleGetQuotes = async () => {
        console.log('Get Quotes button pressed'); // Debug log
        console.log('axios:', axios);
        console.log('typeof axios.post:', typeof axios.post);

        if (!vehicleInfo.brand || !vehicleInfo.model || !vehicleInfo.engineCapacity) {
            Alert.alert('Error', 'Please fill in all vehicle information');
            return;
        }

        if (!driverInfo.name || !driverInfo.licenseNumber) {
            Alert.alert('Error', 'Please fill in all driver information');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending quote request with data:', {
                vehicle: {
                    ...vehicleInfo,
                    year: parseInt(vehicleInfo.year),
                    engineCapacity: parseInt(vehicleInfo.engineCapacity),
                },
                driver: {
                    ...driverInfo,
                    birthYear: parseInt(driverInfo.birthYear),
                    claimsHistory: parseInt(driverInfo.claimsHistory),
                },
            });

            const response = await axios.post('/api/quotes', {
                vehicle: {
                    ...vehicleInfo,
                    year: parseInt(vehicleInfo.year),
                    engineCapacity: parseInt(vehicleInfo.engineCapacity),
                },
                driver: {
                    ...driverInfo,
                    birthYear: parseInt(driverInfo.birthYear),
                    claimsHistory: parseInt(driverInfo.claimsHistory),
                },
            });

            console.log('Quote response received:', response.data);

            // Navigate to results page with data
            router.push({
                pathname: '/results' as any,
                params: { quotes: JSON.stringify(response.data) }
            });
        } catch (error: any) {
            console.log('Quote request error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        console.log('Logout button pressed in quote page');
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.log('Logout API error:', error);
        }
        await AsyncStorage.removeItem('token');
        router.push('/login');
    };

    const renderVehicleForm = () => (
        <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Type</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={vehicleInfo.type}
                        onValueChange={(value) => setVehicleInfo({ ...vehicleInfo, type: value })}
                        style={styles.picker}
                    >
                        {vehicleTypes.map((type) => (
                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Manufacturing Year</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={vehicleInfo.year}
                        onValueChange={(value) => setVehicleInfo({ ...vehicleInfo, year: value })}
                        style={styles.picker}
                    >
                        {years.map((year) => (
                            <Picker.Item key={year} label={year} value={year} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Brand</Text>
                <TextInput
                    style={styles.input}
                    value={vehicleInfo.brand}
                    onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, brand: text })}
                    placeholder="e.g., Toyota, Honda, Proton"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                    style={styles.input}
                    value={vehicleInfo.model}
                    onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, model: text })}
                    placeholder="e.g., Vios, City, Saga"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Engine Capacity (cc)</Text>
                <TextInput
                    style={styles.input}
                    value={vehicleInfo.engineCapacity}
                    onChangeText={(text) => setVehicleInfo({ ...vehicleInfo, engineCapacity: text })}
                    placeholder="e.g., 1500"
                    keyboardType="numeric"
                />
            </View>
        </View>
    );

    const renderDriverForm = () => (
        <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Driver Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={driverInfo.name}
                    onChangeText={(text) => setDriverInfo({ ...driverInfo, name: text })}
                    placeholder="Enter your full name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Birth Year</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={driverInfo.birthYear}
                        onValueChange={(value) => setDriverInfo({ ...driverInfo, birthYear: value })}
                        style={styles.picker}
                    >
                        {birthYears.map((year) => (
                            <Picker.Item key={year} label={year} value={year} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>License Number</Text>
                <TextInput
                    style={styles.input}
                    value={driverInfo.licenseNumber}
                    onChangeText={(text) => setDriverInfo({ ...driverInfo, licenseNumber: text })}
                    placeholder="Enter your license number"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Claims History (Last 3 Years)</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={driverInfo.claimsHistory}
                        onValueChange={(value) => setDriverInfo({ ...driverInfo, claimsHistory: value })}
                        style={styles.picker}
                    >
                        {claimsHistory.map((claim) => (
                            <Picker.Item key={claim.value} label={claim.label} value={claim.value} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Get Insurance Quote</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${step * 50}%` }]} />
                </View>
                <Text style={styles.progressText}>Step {step} of 2</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {step === 1 && renderVehicleForm()}
                {step === 2 && renderDriverForm()}

                {/* Navigation Buttons */}
                <View style={styles.buttonContainer}>
                    {step === 1 ? (
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => setStep(2)}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.finalButtons}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setStep(1)}
                            >
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.getQuotesButton, loading && styles.disabledButton]}
                                onPress={handleGetQuotes}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.getQuotesButtonText}>Get Quotes</Text>
                                        <Ionicons name="calculator-outline" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    formSection: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'white',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
    },
    buttonContainer: {
        padding: 20,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 25,
        gap: 10,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finalButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    backButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#666',
        fontSize: 18,
        fontWeight: 'bold',
    },
    getQuotesButton: {
        flex: 2,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 25,
        gap: 10,
    },
    getQuotesButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
}); 