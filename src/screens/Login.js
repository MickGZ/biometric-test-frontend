import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";

function Login({ navigation }) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const errorMessageTimer = () => {
    setTimeout(() => {
      setLoginError(null);
    }, 5000);
  };

  const handleSubmit = async () => {
    console.log("Formulario enviado...");
    console.log(username);
    console.log(password);

    const data = {
      usernameData: username,
      passwordData: password,
    };

    try {
      const response = await fetch("http://192.168.0.167:3080/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      console.log("SUBMIT RESPONSE");
      console.log(result);
      if (!result.ok) {
        setLoginError("User Credentials are wrong!");
        errorMessageTimer();
        return;
      }
      navigation.navigate("HomeMenu", { screen: "UserProfile" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <Button title="Log In" color="black" onPress={handleSubmit} />
      {loginError && <Text style={styles.message}>{loginError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  message: {
    textAlign: "center",
    color: "#FF334C",
    marginTop: 10,
  },
});

export default Login;
