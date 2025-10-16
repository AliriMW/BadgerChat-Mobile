import { useEffect, useState } from "react";
import { 
    Alert,
    Button, 
    FlatList, 
    Modal, 
    StyleSheet, 
    Text, 
    TextInput, 
    View } from "react-native";

import CS571 from '@cs571/mobile-client'
import BadgerChatMessage from "../helper/BadgerChatMessage"


function BadgerChatroomScreen(props) {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    function refresh() {
        setIsLoading(true);
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(msgs => {
            setMessages(msgs.messages)
            setIsLoading(false)
        })
    }
    
    function handlePost() {
        props.handlePost(title, body, props.name)
    }

    function handleDelete(id) {
        props.handleDelete(id)
    }

    useEffect(() => {
        refresh();
    }, [])

    useEffect(() => {
        if (props.postResult) {
            setIsVisible(false);
            refresh();
        }
    }, [props.postResult])

    return <View style={{ flex: 1 }}> 
        <FlatList
            data={messages}
            onRefresh={refresh}
            refreshing={isLoading}
            keyExtractor={msg => msg.id}
            renderItem={renderObj => <BadgerChatMessage 
                {...renderObj.item} 
                handleDelete={handleDelete} 
                username={props.username}
            />}
        />
        <Button 
            title="ADD POST" 
            color={"darkred"} 
            disabled={props.isGuest}
            onPress={() => setIsVisible(true)}
        />
        <Modal
            animationType="slide"
            visible={isVisible}
            transparent={true}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setIsVisible(false)
            }}
        >
            <View style={styles.container}>
                <Text style={{fontSize: 30}}>Create A Post</Text>
                <Text style={{fontSize: 20}}>Title</Text>
                <TextInput
                    style={styles.textInput}
                    value={title}
                    onChangeText={txt => setTitle(txt)}
                    clearTextOnFocus
                />
                <Text style={{fontSize: 20}}>Body</Text>
                <TextInput
                    style={styles.textInputBody}
                    value={body}
                    onChangeText={txt => setBody(txt)}
                    clearTextOnFocus
                />
                <View style={styles.button}>
                    <Button title="CREATE POST" color={'darkred'} disabled={!title || !body} onPress={handlePost}/>
                    <Button title="CANCEL" color={'grey'} onPress={() => setIsVisible(false)}/>
                </View>
            </View>
        </Modal>
    </View>
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
        width: 300,
        borderColor: 'black',
        borderWidth: 0.5,
        padding: 4,
      },
      textInputBody: {
        height: 100,
        width: 300,
        borderColor: 'black',
        borderWidth: 0.5,
        padding: 4,
        textAlignVertical: 'top'
      },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    }
});

export default BadgerChatroomScreen;