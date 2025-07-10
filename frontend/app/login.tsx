import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import axios from '../utils/axiosInstance';

const API_URL = 'http://192.168.72.255:3000';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();

    // Handle OAuth2 callback token
    useEffect(() => {
        if (params.token) {
            handleOAuthCallback(params.token as string);
        }
    }, [params.token]);

    const handleOAuthCallback = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token);
            Alert.alert('Login Success', 'GitHub login successful!');
            setTimeout(() => {
                router.push('/');
            }, 100);
        } catch (error) {
            Alert.alert('Login Failed', 'Error saving login information');
        }
    };

    // Local login
    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter username and password');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/login', { username, password });
            await AsyncStorage.setItem('token', response.data.token);
            Alert.alert('Login Success', `Welcome back, ${response.data.user.name}!`);
            setTimeout(() => {
                router.push('/');
            }, 100);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.error || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    // GitHub OAuth2 login
    const handleGitHubLogin = async () => {
        setGithubLoading(true);
        try {
            const redirectUri = AuthSession.makeRedirectUri();
            const authUrl = `${API_URL}/api/oauth2/github/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`;

            const result = await AuthSession.startAsync({ authUrl });

            if (result.type === 'success' && result.params.token) {
                await AsyncStorage.setItem('token', result.params.token);
                Alert.alert('Login Success', 'GitHub login successful!');
                setTimeout(() => {
                    router.push('/');
                }, 100);
            } else if (result.type === 'cancel') {
                Alert.alert('Login Cancelled', 'You cancelled GitHub login');
            } else {
                Alert.alert('Login Failed', 'Error during GitHub login process');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Network error during GitHub login');
        } finally {
            setGithubLoading(false);
        }
    };

    const handleLogout = async () => {
        console.log('Logout button pressed in quote page'); // Debug log
        try {
            const res = await axios.post('/api/logout');
            console.log('Logout API response:', res.data);
        } catch (error) {
            console.log('Logout API error:', error);
        }
        await AsyncStorage.removeItem('token');
        console.log('Token removed from AsyncStorage');
        router.push('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>🚗 BJAK</Text>
                    <Text style={styles.subtitle}>Vehicle Insurance Platform</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.formTitle}>Login to Your Account</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="log-in-outline" size={20} color="white" />
                                <Text style={styles.loginButtonText}>Login</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={[styles.githubButton, githubLoading && styles.disabledButton]}
                        onPress={handleGitHubLogin}
                        disabled={githubLoading}
                    >
                        {githubLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="logo-github" size={20} color="white" />
                                <Text style={styles.githubButtonText}>Login with GitHub</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.testInfo}>
                        <Text style={styles.testInfoText}>Test Account:</Text>
                        <Text style={styles.testInfoText}>Username: test</Text>
                        <Text style={styles.testInfoText}>Password: 123456</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        backgroundColor: 'white',
        padding: 24,
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
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
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
    loginButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
        fontSize: 14,
    },
    githubButton: {
        backgroundColor: '#24292e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 8,
        gap: 8,
    },
    githubButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    testInfo: {
        marginTop: 24,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    testInfoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
}); 