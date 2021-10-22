import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";
import { AppStyles } from "../../AppStyles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const snackbarMessage = (message: any) => {
    setSnackbarText(message);
    setSnackbarVisible(true);
  };

  const login = async () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        return { user };
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoading(false);
        console.log(errorMessage);
        snackbarMessage(errorMessage);
      });
  };

  const resetPassword = async () => {
    // TODO: When user click on button, your app should send a reset password to the user's email
    if (!email) {
      snackbarMessage("To reset your password, enter your email.");
    }
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        snackbarMessage("Check your email for a password reset link.");
        return {};
      })
      .catch((error) => {
        console.log(error);
        snackbarMessage(error.message);
      });
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Sign In"></Appbar.Content>
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        style={AppStyles.text_input}
      />

      <TextInput
        secureTextEntry={true}
        label="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        style={AppStyles.text_input}
      />

      <Button loading={loading} style={AppStyles.button} mode="contained" onPress={() => login() }>
        Sign In
      </Button>

      <Button mode="text" style={AppStyles.button} onPress={() => navigation.navigate("SignUpScreen")}>
        Sign Up
      </Button>

      <Button mode="text" style={AppStyles.button} onPress={() => resetPassword()}>
        Reset Password
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarText}
      </Snackbar>
    </>
  );
}
