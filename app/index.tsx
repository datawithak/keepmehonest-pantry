import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen';
import { getUser } from '../src/services/user-service';
import { Colors } from '../src/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function LandingScreen() {
  const router = useRouter();
  const [isReturning, setIsReturning] = useState<boolean | null>(null);

  const [fontsLoaded] = useFonts({ Caveat_700Bold });

  useEffect(() => {
    getUser().then((user) => {
      setIsReturning(!!user?.pantryCode);
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded && isReturning !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReturning]);

  if (!fontsLoaded || isReturning === null) return null;

  const handleArrow = () => {
    if (isReturning) {
      router.replace('/(pantry)');
    } else {
      router.push('/setup');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/landing-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>welcome to</Text>
          <Text style={styles.titleBig}>zuby's pantry</Text>
        </View>

        <TouchableOpacity onPress={handleArrow} style={styles.arrowBtn}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 32,
  },
  titleContainer: {
    marginBottom: 60,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 31,
    color: Colors.white,
  },
  titleBig: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 51,
    color: Colors.white,
    lineHeight: 56,
  },
  arrowBtn: {
    position: 'absolute',
    bottom: 48,
    right: 32,
    padding: 12,
  },
  arrow: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.charcoal,
  },
});
