const messages = [];
let nextid = 1;

export function getMessages(){
    return messages;
}

export function addMessages({ username, text}){
    const message = {
        id: nextid++,
        username,
        text,
        createAT: newData().tolSOString(),
    };
    message.push(message);
    return message;
};