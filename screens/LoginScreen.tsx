import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../misc/themes";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import HomeScreen from "@/screens/HomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "217894428205-lkcc4hmsufelej1h9vvp127n6tie4vni.apps.googleusercontent.com",
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError();
    } catch (error) {
      setError(error);
    }
  };

  const logout = () => {
    setUserInfo();
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

  return (
    <SafeAreaView style={styles.Container}>
      {userInfo ? (
          <HomeScreen logout={logout}/>
      ) : (
        <View style={styles.Container}>
          <StatusBar backgroundColor={COLORS.primaryBlackHex} style='light' />
          <View style={styles.NekoAnimationContainer}>
            <LottieView
              style={styles.LottieStyle}
              source={require("../assets/lottie/panda1.json")}
              autoPlay
              loop
            />
          </View>
          <View style={styles.WelcomeContainer}>
            <View style={styles.WelcomeTextContainer}>
              <Text style={styles.IntroText1}>Welcome,</Text>
              <Text style={styles.IntroText2}>
                Sign In To See Hospitals Nearby
              </Text>
            </View>
            <View style={styles.NameInputContainer}>
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Standard}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
              />
            </View>
          </View>
        </View>
        
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.primaryBlackHex,
  },
  NekoAnimationContainer: {
    flex: 1,
    justifyContent: "center",
  },
  LottieStyle: {
    //backgroundColor: 'red',
    width: 300,
    height: 300,
  },
  WelcomeContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  WelcomeTextContainer: {
    alignItems: "flex-start",
  },
  IntroText1: {
    width: "100%",
    fontFamily: "Poppins-Bold",
    color: COLORS.primaryGreenHex,
    fontSize: FONTSIZE.size_28 * 2,
    textShadowColor: "black",
    textShadowOffset: { width: 6, height: 6 },
    textShadowRadius: 20,
  },
  IntroText2: {
    fontFamily: "Poppins-Medium",
    color: COLORS.primaryGreenHex,
    fontSize: FONTSIZE.size_24,
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  NameInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40%",
  },
  NameInput: {
    color: COLORS.primaryGreenHex,
    height: SPACING.space_30,
    fontFamily: "Poppins-Medium",
    fontSize: FONTSIZE.size_16,
  },
});
