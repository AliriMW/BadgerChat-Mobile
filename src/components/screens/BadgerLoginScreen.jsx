import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');

    function checkPassword() {
        const reg = /^\d{7}$/;

        if (!reg.test(pin)) {
            Alert.alert("Your pin must be a 7-digit number!");
            return false;
        }

        return true;
    }

    function handleLogin() {
        // Handle empty input
        if(!username || !pin) {
            Alert.alert("You must provide both a username and pin!")
            return;
        }

        // Handle password checking & notify parent
        if(checkPassword()) {
            props.handleLogin(username, pin)
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Usrename</Text>
        <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={name => setUsername(name)}
            autoCapitalize="none"
        />
        <Text>PIN</Text>
        <TextInput
            style={styles.textInput}
            value={pin}
            onChangeText={p => setPin(p)}
            keyboardType="number-pad"
            secureTextEntry={true}
        />
        <Text/>
        <Button color="darkred" title="Login" onPress={() => handleLogin()} />
        <Text style={{padding: 15}}>New here?</Text>
        <View style={styles.button}>
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
            <Text>  </Text>
            <Button color="grey" title="CONTINUE AS GUEST" onPress={() => props.setIsGuest(true)} />
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 35,
        width: 200,
        borderColor: 'black',
        borderWidth: 0.5,
        padding: 4,
      },
      button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    }
});

export default BadgerLoginScreen;