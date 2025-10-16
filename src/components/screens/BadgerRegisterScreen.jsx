import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [confPin, setconfPin] = useState('');

    function checkPassword() {
        const reg = /^\d{7}$/;

        if (!reg.test(pin) || !reg.test(confPin)) {
            Alert.alert("Your pin must be a 7-digit number!");
            return false;
        }

        if (pin !== confPin) {
            Alert.alert("The pins do not match!");
            return false;
        }

        return true;
    }

    function handleSignup() {
        // Handle empty input
        if(!username || !pin) {
            Alert.alert("You must provide both a username and pin!")
            return;
        }

        // Handle password checking & notify parent
        if(checkPassword()) {
            props.handleSignup(username, pin)
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
        <Text>Confirm PIN</Text>
        <TextInput
            style={styles.textInput}
            value={confPin}
            onChangeText={p => setconfPin(p)}
            keyboardType="number-pad"
            secureTextEntry={true}
        />
        <Text/>
        <View style={styles.button}>
            <Button color="darkred" title="Signup" onPress={() => handleSignup()} />
            <Text>  </Text>
            <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;