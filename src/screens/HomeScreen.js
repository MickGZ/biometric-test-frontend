import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Alert,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";

function HomeScreen({ navigation }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);

  const checkDeviceSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  // Detect if device supports face detection or fingerprint scan
  useEffect(() => {
    checkDeviceSupport();
  }, []);

  const fallBackToDefaultAuth = () => {
    console.log("Fall back to password autentication");
  };

  const errorMessageTimer = () => {
    setTimeout(() => {
      setErrorLogin(null);
    }, 5000);
  };

  const alertComponent = (title, messsage, btnText, btnFunc) => {
    return Alert.alert(title, messsage, [
      {
        text: btnText,
        onPress: btnFunc,
      },
    ]);
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const validateAuth = async (authValue) => {
    const data = { auth: authValue };
    try {
      const response = await fetch("http://192.168.0.167:3080/loginWithAuth", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const TwoButtonAlert = () =>
    Alert.alert("Welcome To Test App", "This is test", [
      {
        text: "Back",
        onPress: () => console.log("Cancel pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);

  const handleBiometricAuth = async () => {
    // check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Back to default authentication method (password) if FingerPrint is not available
    if (!isBiometricAvailable) {
      return alertComponent(
        "Please enter your password",
        "Biometric Authentication not supported",
        "OK",
        () => goToLogin()
      );
    }

    // Check biometrics type available
    let supportedBiometrics;
    if (isBiometricAvailable) {
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
    }

    // Check biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return alertComponent(
        "Biometric record not found",
        "Please login with your password",
        "OK",
        () => goToLogin()
      );
    }

    // Authenticate with biometrics

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    // Log the user in on success
    if (!biometricAuth.success) {
      setErrorLogin("Authentication error, please try again later.");
      errorMessageTimer();
      return;
    }

    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });

    const { ok } = await validateAuth(biometricAuth.success);
    if (ok) navigation.navigate("UserProfile");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>
        {isBiometricSupported
          ? "Your device is compatible with Biometrics"
          : "Face or Fingerprint scanner is available on this device"}
      </Text>
      <TouchableHighlight>
        <Button
          title="Login with Biometrics"
          color="black"
          onPress={handleBiometricAuth}
        />
      </TouchableHighlight>
      {errorLogin && <Text style={styles.message}>{errorLogin}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 200,
  },
  textContainer: {
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    color: "#FF334C",
    marginTop: 10,
  },
});

export default HomeScreen;
