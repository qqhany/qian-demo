import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axiosInstance';

interface Quote {
    id: number;
    name: string;
    finalPrice: number;
    originalPrice: number;
    ncd: string;
    savings: number;
    monthlyPayment: number;
    rating: number;
    features: string[];
    popular: boolean;
    discount: string;
    installments: number[];
}

interface QuoteData {
    quotes: Quote[];
    summary: {
        totalQuotes: number;
        priceRange: {
            min: number;
            max: number;
        };
        averagePrice: number;
    };
}

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    useEffect(() => {
        if (params.quotes) {
            try {
                const data = JSON.parse(params.quotes as string);
                setQuoteData(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to load quote data');
                router.back();
            }
        }
    }, [params.quotes]);

    const handleSelectQuote = (quote: Quote) => {
        setSelectedQuote(quote);
        Alert.alert(
            'Quote Selected',
            `You selected ${quote.name} for RM${quote.finalPrice}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Proceed', onPress: () => handlePurchase(quote) },
            ]
        );
    };

    const handlePurchase = (quote: Quote) => {
        Alert.alert(
            'Purchase Confirmation',
            `Confirm purchase of ${quote.name} insurance for RM${quote.finalPrice}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        Alert.alert('Success', 'Insurance purchased successfully!');
                        router.push('/');
                    }
                },
            ]
        );
    };

    const handleLogout = async () => {
        console.log('Logout button pressed in results page'); // Debug log
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.log('Logout API error:', error);
        }
        await AsyncStorage.removeItem('token');
        router.push('/login');
    };

    const renderQuoteCard = (quote: Quote, index: number) => (
        <TouchableOpacity
            key={quote.id}
            style={[styles.quoteCard, quote.popular && styles.popularCard]}
            onPress={() => handleSelectQuote(quote)}
        >
            {quote.popular && (
                <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                </View>
            )}

            <View style={styles.quoteHeader}>
                <View style={styles.insurerInfo}>
                    <Text style={styles.insurerName}>{quote.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{quote.rating}</Text>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.finalPrice}>RM {quote.finalPrice}</Text>
                    <Text style={styles.originalPrice}>RM {quote.originalPrice}</Text>
                    <Text style={styles.savings}>Save RM {quote.savings}</Text>
                </View>
            </View>

            <View style={styles.quoteDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>NCD:</Text>
                    <Text style={styles.detailValue}>{quote.ncd}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monthly:</Text>
                    <Text style={styles.detailValue}>RM {quote.monthlyPayment}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Discount:</Text>
                    <Text style={styles.detailValue}>{quote.discount}</Text>
                </View>
            </View>

            <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Features:</Text>
                {quote.features.slice(0, 3).map((feature, idx) => (
                    <Text key={idx} style={styles.feature}>• {feature}</Text>
                ))}
                {quote.features.length > 3 && (
                    <Text style={styles.moreFeatures}>+{quote.features.length - 3} more</Text>
                )}
            </View>

            <View style={styles.installmentsContainer}>
                <Text style={styles.installmentsTitle}>Payment Options:</Text>
                <View style={styles.installmentsList}>
                    {quote.installments.map((months) => (
                        <Text key={months} style={styles.installment}>
                            {months}x RM{Math.round(quote.finalPrice / months)}
                        </Text>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectQuote(quote)}
            >
                <Text style={styles.selectButtonText}>Select This Quote</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (!quoteData) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="auto" />
                <View style={styles.loadingContainer}>
                    <Text>Loading quotes...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Insurance Quotes</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Quote Summary</Text>
                <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{quoteData.summary.totalQuotes}</Text>
                        <Text style={styles.summaryLabel}>Total Quotes</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>RM {quoteData.summary.priceRange.min}</Text>
                        <Text style={styles.summaryLabel}>Lowest Price</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>RM {quoteData.summary.averagePrice}</Text>
                        <Text style={styles.summaryLabel}>Average Price</Text>
                    </View>
                </View>
            </View>

            {/* Quotes List */}
            <ScrollView style={styles.quotesContainer} showsVerticalScrollIndicator={false}>
                {quoteData.quotes.map((quote, index) => renderQuoteCard(quote, index))}

                <View style={styles.bottomPadding} />
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
    summaryContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    quotesContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    quoteCard: {
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    popularCard: {
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        left: 20,
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    quoteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    insurerInfo: {
        flex: 1,
    },
    insurerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    finalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    savings: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    quoteDetails: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    featuresContainer: {
        marginBottom: 15,
    },
    featuresTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    feature: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    moreFeatures: {
        fontSize: 12,
        color: '#2196F3',
        fontStyle: 'italic',
    },
    installmentsContainer: {
        marginBottom: 15,
    },
    installmentsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    installmentsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    installment: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    selectButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    selectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomPadding: {
        height: 20,
    },
}); 