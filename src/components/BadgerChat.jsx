import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [key, setKey] = useState('')
  const [postResult, setPostResult] = useState(false) // A flag to help the child knows when to refresh chat messages
  const [isGuest, setIsGuest] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  function save(key, value) {
    SecureStore.setItemAsync(key, value).then(() => {
      // for debugging
      console.log("Secure Storage", "Saved a value to '" + key + "'")
    })
  }

  useEffect(() => {
    if(isGuest) {
      setIsLoggedIn(true)
    }

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms", {
      method: "GET",
      headers: {
          "X-CS571-ID": CS571.getBadgerId(),
      }
    })
    .then(res => res.json())
    .then(chats => {
      setChatrooms(chats)
    })
  }, [isGuest]);

  function handleLogin(username, pin) {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: "POST",
      headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          username: username,
          pin: pin
      })
    })
    .then(res => {
        if(res.status === 200) {
          return res.json();
        } else if(res.status === 500) {
          Alert.alert("An unexpected server error has occured!", "Please try again!")
        } else {
          Alert.alert("Incorrect username or PIN!", "Make sure your username and PIN are correct.")
        }
    })
    .then(data => {
      if(data) {
        setKey(data.user.username)
        save(data.user.username, data.token)
        setIsLoggedIn(true)
        Alert.alert("Login successful!", "Success!")
      }
    })
  }
  
  function handleSignup(username, pin) {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
      method: "POST",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        pin: pin
      })
    })
    .then(res => {
        if(res.status === 200) {
          return res.json();
        } else if(res.status === 500) {
          Alert.alert("An unexpected server error has occured!", "Please try again!")
        } else if(res.status === 409) {
          Alert.alert("The user already exists.", "Try another username.");
        } else {
          Alert.alert("An error occured", "Something went wrong!")
        }
    })
    .then(data => {
      if(data) {
        setKey(data.user.username)
        save(data.user.username, data.token)
        setIsLoggedIn(true)
        Alert.alert("Sign up was successful!", "You are logged in now!")
      }
    })
  }

  function handlePost(title, body, chatroom) {
    // Used ChatGPT to help with retrieving JWT from SecureStore
    SecureStore.getItemAsync(key).then((JWT) => {
      if (!JWT) {
        Alert.alert("You are not logged in!", "Please log in to post messages.");
        return;
      }
    
      setPostResult(false);
      const JWT_TOKEN = `Bearer ${JWT}`;

      fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${chatroom}`, {
        method: "POST", 
        headers: {
          "Authorization": JWT_TOKEN,
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          content: body
        })
      })
      .then(res => {
        if(res.status === 200) {
          Alert.alert("Post is successful!", "Success!")
          setPostResult(true);
        } else if(res.status === 401) {
          Alert.alert("You must be logged in to do that!")
        } else if(res.status === 404) {
          Alert.alert("The specified chatroom does not exist. Chatroom names are case-sensitive.");
        } else if(res.status === 413) {
          Alert.alert("'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer")
        } else {
          Alert.alert("Something went wrong!", "Please try again!")
        }
      })
    })
  }

  function handleDelete(id) {
    // Used ChatGPT to help with retrieving JWT from SecureStore
    SecureStore.getItemAsync(key).then((JWT) => {
      if (!JWT) {
        Alert.alert("You are not logged in!", "Please log in to post messages.");
        return;
      }
    
      setPostResult(false);
      const JWT_TOKEN = `Bearer ${JWT}`;

      fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${id}`, {
        method: "DELETE", 
        headers: {
          "Authorization": JWT_TOKEN,
          "X-CS571-ID": CS571.getBadgerId()
        }
      })
      .then(res => {
        if(res.status === 200) {
          Alert.alert("Delete is successful!", "The message was deleted!")
          setPostResult(true);
        } else if(res.status === 401) {
          Alert.alert("You may not delete another user's post!")
        } else if(res.status === 404) {
          Alert.alert("That message does not exist!")
        } else {
          Alert.alert("Something went wrong!", "Please try again!")
        }
      })
    })
  }

  function handleLogout() {
    SecureStore.deleteItemAsync(key).then(() => {
      Alert.alert("Logout Successful!", "You have been logged out from BadgerChat.")
      setIsLoggedIn(false)
      setIsRegistering(false)
    })
  }

  function rerouteGuest() {
    setIsLoggedIn(false);
    setIsRegistering(true);
    setIsGuest(false);
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen 
                  name={chatroom} 
                  handleDelete={handleDelete}
                  handlePost={handlePost} 
                  postResult={postResult} 
                  username={key}
                  isGuest={isGuest}
                />}
              </ChatDrawer.Screen>
            })
          }
          {
            isGuest?
            <>
              <ChatDrawer.Screen name="Signup" options={{drawerItemStyle: {backgroundColor: 'pink'}}}>
                {(props) => <BadgerLogoutScreen rerouteGuest={rerouteGuest} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            </>
            :
            <>
              <ChatDrawer.Screen name="Logout" options={{drawerItemStyle: {backgroundColor: 'pink'}}}>
                {(props) => <BadgerLogoutScreen handleLogout={handleLogout} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            </>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>
  }
}