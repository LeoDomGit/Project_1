import React, { useState } from 'react'
import Layout from '../../components/Layout'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';

function Index({ conversation }) {
  const [dataConversation, setDataConversation] = useState(conversation);
  const [chatName,setChatName] = useState(conversation.name);
  const [editName,setEditName] = useState(false);
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const notyf = new Notyf({
    duration: 1000,
    position: {
      x: 'right',
      y: 'top',
    },
    types: [
      {
        type: 'warning',
        background: 'orange',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'warning'
        }
      },
      {
        type: 'error',
        background: 'indianred',
        duration: 2000,
        dismissible: true
      },
      {
        type: 'success',
        background: 'green',
        color: 'white',
        duration: 2000,
        dismissible: true
      },
      {

        type: 'info',
        background: '#24b3f0',
        color: 'white',
        duration: 1500,
        dismissible: false,
        icon: '<i class="bi bi-bag-check"></i>'
      }
    ]
  });
  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      // Save user message to database
      await axios.post('/chat', {
        conversation_id: dataConversation.id,
        sender_id: 1, // Assuming the user is not authenticated, adjust if needed
        response: 0,
        content: message
      });

      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
          direction: 'incoming',
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);

        // Save bot response to database
        await axios.post('/chat', {
          conversation_id: dataConversation.id,
          sender_id: 0, // Assuming ChatGPT doesn't have a sender_id
          response: true,
          content: content
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      notyf.error('Error saving message or getting response');
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  const submitEditName = () => {
    if(chatName==''){
      notyf.error('Tên của cuộc đàm thoại không được để trống');
      return;
    }
    axios.put('/admin/conversations/'+dataConversation.id, {
      name: chatName
    }).then((response) => {
      setDataConversation(response.data);
      setChatName(response.data.name);
      setEditName(false);
      notyf.success('Tên của đàm thoại được thay đổi thành công');
    }).catch((error) => {
      notyf.error('Lỗi khi thay đổi tên của đàm thoại');
    });
  }

  return (
    <Layout>
      <>
        <div className="row mt-5">
          <div className="col-md-7" style={{ height: '700px' }}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                aria-label="chat_name"
                value={chatName}
                onChange={(e)=>setChatName(e.target.value)}
                disabled={editName==true?false:true}
                aria-describedby="button-addon2"
              />
              {editName==false ?
              <>
               <button
                className="btn btn-outline-primary"
                type="button"
                id="button-addon2"
                onClick={(e)=>setEditName(true)}
              >
                Edit 
              </button>
              </>
              :
              <button
              className="btn btn-outline-primary"
              type="button"
              id="button-addon2"
              onClick={(e)=>submitEditName()}
            >
              Submit 
            </button>
              }
             
            </div>

            <MainContainer>
              <div className="row">
                <div className="col-md-12">
                </div>
              </div>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                  {messages.map((message, i) => {
                    return (
                      <Message
                        key={i}
                        model={{
                          message: message.message,
                          direction: message.sender === "ChatGPT" ? 'incoming' : 'outgoing', // Incoming for ChatGPT, Outgoing for User
                        }}
                        style={{
                          color: 'white', // Keeping the text color white for consistency
                        }}
                      />
                    );
                  })}
                </MessageList>
                <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Index;
