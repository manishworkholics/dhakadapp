// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <Header title="Shivam Thakur" />
            <ScrollView contentContainerStyle={{ padding: 15 }}>
                {/* Profile Card */}
                <View style={styles.card}>
                    <Text style={styles.accountType}>Account: Free</Text>
                    <TouchableOpacity style={styles.upgradeBtn}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upgrade Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Premium Matches */}
                <Text style={styles.sectionTitle}>Premium Matches</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.profileCard}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
                            style={styles.profileImg}
                        />
                        <Text style={styles.profileName}>Jane Doe</Text>
                    </View>
                    <View style={styles.profileCard}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/2.jpg' }}
                            style={styles.profileImg}
                        />
                        <Text style={styles.profileName}>Mary Jane</Text>
                    </View>
                </ScrollView>

                {/* Success Story */}
                <Text style={styles.sectionTitle}>Success Stories</Text>
                <View style={styles.successCard}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/3.jpg' }}
                        style={styles.successImg}
                    />
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>Verite & Desendra</Text>
                        <Text>Got married successfully!</Text>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        elevation: 2,
    },
    accountType: { marginBottom: 10 },
    upgradeBtn: {
        backgroundColor: '#FF8C00',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, marginTop: 20 },
    profileCard: { width: 120, marginRight: 10 },
    profileImg: { width: 120, height: 120, borderRadius: 10 },
    profileName: { textAlign: 'center', marginTop: 5 },
    successCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 20,
        alignItems: 'center',
    },
    successImg: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
});

export default HomeScreen;
