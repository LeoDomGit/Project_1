import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
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

function Index({ conversation, chats }) {
  const [dataConversation, setDataConversation] = useState(conversation);
  const [chatName, setChatName] = useState(conversation.name);
  const [editName, setEditName] = useState(false);
  const [messages, setMessages] = useState(chats);
  const [isTyping, setIsTyping] = useState(false);
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

  const notyf = new Notyf({
    duration: 1000,
    position: { x: 'right', y: 'top' },
    types: [
      { type: 'warning', background: 'orange', icon: { className: 'material-icons', tagName: 'i', text: 'warning' } },
      { type: 'error', background: 'indianred', duration: 2000, dismissible: true },
      { type: 'success', background: 'green', color: 'white', duration: 2000, dismissible: true },
      { type: 'info', background: '#24b3f0', color: 'white', duration: 1500, dismissible: false, icon: '<i class="bi bi-bag-check"></i>' }
    ]
  });

  useEffect(() => {
    // Fetch messages from the server on load
    axios.get(`/api/messages/${dataConversation.id}`)
      .then(response => setMessages(response.data))
  }, [dataConversation.id]);

  const handleSendRequest = async (message) => {
    if (!message || message.trim() === '') {
      notyf.error('Message cannot be empty');
      return;
    }

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
        sender_id: 1, // Adjust if authenticated
        response: 0,
        content: message
      }).then((res)=>{
        setMessages(res.data.data);
      });

      // Get response from ChatGPT
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
          sender_id: 0, // Bot sender ID
          response: true,
          content: content
        }).then((res)=>{
          setMessages(res.data.data);
        });
      } else {
        throw new Error('ChatGPT response content is missing');
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
      // Ensure that message content is valid
      if (messageObject.message == null) {
        console.error("Message content is null or undefined:", messageObject);
        return null; // Skip invalid messages
      }
      return { role, content: messageObject.message };
    }).filter(message => message !== null); // Filter out invalid messages

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a helpful assistant." },
        ...apiMessages,
      ],
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API response error:", errorData);
        throw new Error("Error from API");
      }

      return response.json();
    } catch (error) {
      console.error("Error processing request:", error);
      throw error;
    }
  }

  const submitEditName = () => {
    if (chatName === '') {
      notyf.error('Conversation name cannot be empty');
      return;
    }

    axios.put(`/admin/conversations/${dataConversation.id}`, { name: chatName })
      .then((response) => {
        setDataConversation(response.data);
        setChatName(response.data.name);
        setEditName(false);
        notyf.success('Conversation name updated successfully');
      })
      .catch(() => notyf.error('Error updating conversation name'));
  };

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-md-7" style={{ height: '700px' }}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="chat_name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              disabled={!editName}
              aria-describedby="button-addon2"
            />
            {editName ? (
              <button className="btn btn-outline-primary" type="button" onClick={submitEditName}>
                Submit
              </button>
            ) : (
              <button className="btn btn-outline-primary" type="button" onClick={() => setEditName(true)}>
                Edit
              </button>
            )}
          </div>

          <MainContainer>
            <ChatContainer>
              <MessageList typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}>
                {messages.map((message, i) => (
                  <Message
                    key={i}
                    model={{
                      message: message.content,
                      direction: message.sender_id  !== 0 ? 'incoming' : 'outgoing',
                      position: "first"
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
