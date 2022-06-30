// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// var stompClient = null;
// const handlers = [];

// export function connect(id) {
//     const token = localStorage.getItem('user-token')
//     const socket = new SockJS('http://localhost:8086/ws')
//     stompClient = Stomp.over(socket);
//     stompClient.connect({Authorization: token}, frame => {
//         console.log('Connected:' + frame);
//         stompClient.subscribe('/user/'+ id + '/messages', message => {
//             co
//             handlers.forEach(handler => handler(JSON.parse(message)))
//         });
//     });
// }
// export function addHandler(handler) {
//     handlers.push(handler)
// }

// export function sendMessage(message) {
//     stompClient.send("/app/messages", {}, JSON.stringify(message))
//     // const newMessages = [...handlers];
//     handlers.push(message);
// }


