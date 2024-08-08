import React, { useEffect, useState } from 'react';
import {Button, Form, Row, Col, Container} from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import startCase from 'lodash/startCase';

const ChatPage = () => {
    const [ws,setWs]=useState();
    const [userName,setUserName]=useState();

    const append = (message,position) => {
        const messageContainer=document.querySelector('.chat_box');
        const messageElement=document.createElement('div');
        messageElement.innerText=message;
        if (position === 'right'){
            messageElement.classList.add('message_send');
        } else {
            messageElement.classList.add('message_receive');
        }
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    };

    useEffect(()=>{
        const socket=new WebSocket('https://groupconnect-backend.onrender.com');
        setWs(socket);
        socket.onopen=()=>{
            const name=prompt('Enter your name to join: ');
            if (name !== null) {
                socket.send(JSON.stringify({type: 'new-user-joined', name: name}));
                setUserName(name);
            }
        }
        
        socket.onmessage = (event) => {
            const data=JSON.parse(event.data);
            const name=startCase(data.name);
            if (data.name !== null){
                if (data.type === 'user-joined') {
                    append(`${name} joined the chat`,'right');
                } else if (data.type === 'receive') {
                    append(`${name}: ${data.message}`,'left');
                }
            }
        }
        return () => {
            socket.close();
        };
    },[]);
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        const userMessage=document.getElementById('send_message').value;
        if (userMessage){
            append(`You: ${userMessage}`,'right');
            ws.send(JSON.stringify({type: 'send', message: userMessage, username: userName }));
            document.getElementById('send_message').value='';
        }
    }

    return (
        <>
            <Container className='container_page'>
                <Row>
                    <Col><div className='heading'><h1>Group Connect App</h1></div></Col>
                </Row>
                <Row>
                    <Col md="2"></Col>
                    <Col md="8">
                        <div className='chat_box'>
                            
                        </div>
                        <Form className='form_group' id='send-container' >
                            <Form.Group className="mb-2 d-flex align-items-center">
                                <Form.Control type="text" name="send_message" id="send_message" placeholder='Type your message...' />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Button type="submit" className='send_button' onClick={handleSendMessage}><i className="fa fa-paper-plane"></i></Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md="2"></Col>
                </Row>
                
            </Container>
        </>
    )
}

export default ChatPage;