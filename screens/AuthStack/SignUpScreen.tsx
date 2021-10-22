import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";
import { AppStyles } from "../../AppStyles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const signUp = () => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        return { user };
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setLoading(false);
        setSnackbarText(errorMessage);
        setSnackbarVisible(true);
      });
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Create an Account"></Appbar.Content>
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View>
        <TextInput
          label="Email"
          value={email}
          mode={"flat"}
          onChangeText={(email) => setEmail(email)}
          style={AppStyles.text_input}
        />
        <TextInput
          secureTextEntry={true}
          label="Password"
          value={password}
          mode={"flat"}
          onChangeText={(password) => setPassword(password)}
          style={AppStyles.text_input}
        />
      </View>

      <Button
        loading={loading}
        mode="contained"
        onPress={() => signUp()}
        style={AppStyles.button}
      >
        Create an Account
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("SignInScreen")}
        style={AppStyles.button}
      >
        Or, Sign In Instead
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
      >
        {snackbarText}
      </Snackbar>
    </>
  );
}
