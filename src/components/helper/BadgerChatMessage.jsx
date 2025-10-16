import { Button, Text } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {

    const dt = new Date(props.created);
    
    function handleDelete() {
        props.handleDelete(props.id)
    }

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {props.poster === props.username?
            <Button
                title="DELETE POST" 
                color={"darkred"}
                onPress={handleDelete}
            />
        :
        null
        }
    </BadgerCard>
}

export default BadgerChatMessage;