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

function Index() {
    const API_KEY =import.meta.env.VITE_OPEN_AI_KEY;
    const [messages, setMessages] = useState([
        {
          message: "Hello, I'm ChatGPT! Ask me anything!",
          sentTime: "just now",
          sender: "ChatGPT",
        },
      ]);
    const [isTyping, setIsTyping] = useState(false);
    
    const handleSendRequest = async (message) => {
        const newMessage = {
          message,
          direction: 'outgoing',  // User's message, on the right
          sender: "user",
        };
    
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsTyping(true);
    
        try {
          const response = await processMessageToChatGPT([...messages, newMessage]);
          const content = response.choices[0]?.message?.content;
          if (content) {
            const chatGPTResponse = {
              message: content,
              sender: "ChatGPT",
              direction: 'incoming', // Bot's message, on the left
            };
            setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
          }
        } catch (error) {
          console.error("Error processing message:", error);
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
    
    return (
    <Layout>
    <>
      <div className="row mt-5">
        <div className="col-md-7" style={{height: '700px'}}>
          <MainContainer>
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
