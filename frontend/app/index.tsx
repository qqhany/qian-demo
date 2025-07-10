import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axiosInstance';

export default function HomeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Get user profile
            const response = await axios.get('/api/profile');
            setUser(response.data.user);
        } catch (error) {
            // Token invalid, redirect to login
            await AsyncStorage.removeItem('token');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        console.log('Logout button pressed');
        try {
            setUser(null);
            await axios.post('/api/logout');
        } catch (error) {
            console.log('Logout API error:', error);
        }
        await AsyncStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const features = [
        {
            icon: 'car-outline',
            title: 'Renew Insurance & Roadtax',
            subtitle: 'Special Discount, Limited Time!',
            color: '#4CAF50',
        },
        {
            icon: 'card-outline',
            title: 'Payment Options',
            subtitle: 'Split Your Purchase Into Easy Installments',
            color: '#2196F3',
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'FREE Roadside Assistance',
            subtitle: 'Flat tyre? Dead battery? Get immediate help',
            color: '#FF9800',
        },
        {
            icon: 'time-outline',
            title: 'Support 24/7',
            subtitle: 'We\'re always here – day or night',
            color: '#9C27B0',
        },
    ];

    const stats = [
        { value: '4.8', label: 'Rating on user reviews' },
        { value: 'RM500 mil', label: 'successfully saved' },
        { value: '250,000+', label: 'Recommended by users' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>🚗 BJAK</Text>
                        <Text style={styles.tagline}>#1 Vehicle Insurance</Text>
                    </View>
                    <View style={styles.userSection}>
                        {user && (
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>Hi, {user.name}</Text>
                                <Text style={styles.userType}>
                                    {user.type === 'github' ? 'GitHub' : 'Local'} User
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Renew Insurance & Roadtax Online</Text>
                    <Text style={styles.heroSubtitle}>Special Discount, Limited Time!</Text>

                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => router.push('/quote')}
                    >
                        <Text style={styles.ctaText}>Get Quote Now</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Features Grid */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>BJAK Makes You a VIP</Text>
                    <Text style={styles.sectionSubtitle}>
                        Assistance, Claims, VIP Service - All in One Plan.
                    </Text>

                    <View style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <TouchableOpacity key={index} style={styles.featureCard}>
                                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                                    <Ionicons name={feature.icon as any} size={24} color="white" />
                                </View>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>What Our Customers Say</Text>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Payment Options */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>Payment Options</Text>
                    <Text style={styles.sectionSubtitle}>
                        Choose the payment plan that works best for your budget
                    </Text>

                    <View style={styles.paymentOptions}>
                        <View style={[styles.paymentOption, styles.popular]}>
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>Most Popular</Text>
                            </View>
                            <Text style={styles.paymentTitle}>3x</Text>
                            <Text style={styles.paymentSubtitle}>Pay in 3 installments</Text>
                            <Text style={styles.paymentFeatures}>• No hidden fees</Text>
                            <Text style={styles.paymentFeatures}>• First payment today</Text>
                            <Text style={styles.paymentFeatures}>• Quick approval process</Text>
                        </View>

                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentTitle}>6x</Text>
                            <Text style={styles.paymentSubtitle}>Pay in 6 installments</Text>
                            <Text style={styles.paymentFeatures}>• Spread payments over 6 months</Text>
                            <Text style={styles.paymentFeatures}>• Smaller monthly payments</Text>
                        </View>

                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentTitle}>12x</Text>
                            <Text style={styles.paymentSubtitle}>Pay in 12 installments</Text>
                            <Text style={styles.paymentFeatures}>• Maximum flexibility</Text>
                            <Text style={styles.paymentFeatures}>• Lowest monthly payments</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom CTA */}
                <View style={styles.bottomCTA}>
                    <TouchableOpacity
                        style={styles.bottomCTAButton}
                        onPress={() => router.push('/quote')}
                    >
                        <Text style={styles.bottomCTAText}>Get Quote</Text>
                    </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    tagline: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        marginRight: 12,
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    userType: {
        fontSize: 10,
        color: '#666',
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
    heroSection: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        gap: 10,
    },
    ctaText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuresSection: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    featureSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    statsSection: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statCard: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    paymentSection: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    paymentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    paymentOption: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
    },
    popular: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196F3',
        borderWidth: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    popularText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    paymentSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    paymentFeatures: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginBottom: 2,
    },
    bottomCTA: {
        padding: 20,
        backgroundColor: 'white',
    },
    bottomCTAButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    bottomCTAText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 