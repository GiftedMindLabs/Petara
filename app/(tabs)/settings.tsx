import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <IconSymbol name="gearshape.fill" size={20} color="#0D9488" />
      </View>
      <View style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <IconSymbol name="bell.fill" size={18} color="#4B5563" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#0D9488' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={[styles.settingItem, styles.border]}>
          <View style={styles.settingLeft}>
            <IconSymbol name="moon.fill" size={18} color="#4B5563" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#D1D5DB', true: '#0D9488' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <TouchableOpacity style={[styles.settingItem, styles.border]}>
          <View style={styles.settingLeft}>
            <IconSymbol name="arrow.down.circle.fill" size={18} color="#4B5563" />
            <Text style={styles.settingText}>Export Data</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.border]}>
          <View style={styles.settingLeft}>
            <IconSymbol name="questionmark.circle.fill" size={18} color="#4B5563" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.border]}>
          <View style={styles.settingLeft}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#DC2626" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Petara v1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  settingItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingText: {
    marginLeft: 12,
    color: '#1F2937'
  },
  signOutText: {
    marginLeft: 12,
    color: '#DC2626'
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  footer: {
    marginTop: 32,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280'
  },
  copyright: {
    marginTop: 4
  }
});

export default Settings;