import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  Sidebar,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Avatar,
  ConversationList,
  Conversation,
  InputToolbox,
  ExpansionPanel,
  AttachmentButton,
  SendButton,
  Search,
} from '@chatscope/chat-ui-kit-react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';

function Index({ conversation, chats,conversations }) {
  const [dataConversations, setDataConversations] = useState(conversations);
  const [chatName, setChatName] = useState(conversation.name);
  const [editName, setEditName] = useState(false);
  const [messages, setMessages] = useState(chats);
  const [isTyping, setIsTyping] = useState(false);
  const [idConversation,setIdConversation] = useState(conversation.id);
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
        conversation_id: idConversation,
        sender_id: 1, // Adjust if authenticated
        response: 0,
        content: message
      }).then((res) => {
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
          conversation_id: idConversation,
          sender_id: 0, // Bot sender ID
          response: true,
          content: content
        }).then((res) => {
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
  useEffect(()=>{
      axios.get(`/chat/${idConversation}`).then((res)=>{
        setMessages(res.data.data);
      })
  },[idConversation])
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
  const handleNewChat = (e) => {
    e.preventDefault();
    axios.post('/admin/conversations', { name: 'New Chat' })
      .then((res) => {
        setDataConversations(res.data.data);
        notyf.success('New chat created successfully');
      })
  }
  const submitEditName = () => {
    if (chatName === '') {
      notyf.error('Conversation name cannot be empty');
      return;
    }

    axios.put(`/admin/conversations/${conversation.id}`, { name: chatName })
      .then((res) => {
        setChatName(res.data.data.name);
        setEditName(false);
        setDataConversations(res.data.conversations);
        notyf.success('Conversation name updated successfully');
      })
      .catch(() => notyf.error('Error updating conversation name'));
  };

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-md" style={{ height: '700px' }}>
          <MainContainer style={{ height: '600px' }} responsive>
            {/* Left Sidebar for conversations */}
            <Sidebar position="left" scrollable={false}>
              <Search placeholder="Search..." /> 
              <button className='btn btn-primary' onClick={(e)=>handleNewChat(e)}>New chat</button>
              <ConversationList>
                {dataConversations.length > 0 && dataConversations.map((conversation) => (
                  <Conversation 
                  onClick={(e)=>setIdConversation(conversation.id)}
                    key={conversation.id} 
                    name={conversation.name} 
                    lastSenderName={conversation.name} 
                  >
                    <Avatar 
                      src='https://cdn.prod.website-files.com/6411daab15c8848a5e4e0153/6476e947d3fd3c906c9d4da6_4712109.png' 
                      name="Lilly" 
                      status="available" 
                    />
                  </Conversation>
                ))}
              </ConversationList>
            </Sidebar>

            {/* Chat Container */}
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar src={'https://cdn.prod.website-files.com/6411daab15c8848a5e4e0153/6476e947d3fd3c906c9d4da6_4712109.png'} name="Zoe" />
                <ConversationHeader.Content userName="User" />
                <ConversationHeader.Actions>
                  <AttachmentButton />
                  <SendButton />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}>
                {messages.map((message, i) => (
                  <Message
                    key={i}
                    model={{
                      message: message.content,
                      direction: message.sender_id !== 0 ? 'outgoing' : 'incoming',
                      position: "single",
                    }}
                  >
                    <Avatar src={message.sender === "ChatGPT" ? 'https://cdn.prod.website-files.com/6411daab15c8848a5e4e0153/6476e947d3fd3c906c9d4da6_4712109.png' : 'https://cdn.prod.website-files.com/6411daab15c8848a5e4e0153/6476e947d3fd3c906c9d4da6_4712109.png'} />
                  </Message>
                ))}
              </MessageList>
              <MessageInput placeholder="Type a message..." onSend={handleSendRequest} />
              <InputToolbox>
                <AttachmentButton />
                <SendButton />
              </InputToolbox>
            </ChatContainer>

            {/* Right Sidebar for info panels */}
            <Sidebar position="right">
              <ExpansionPanel open title="Chat Name">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
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

              </ExpansionPanel>
            </Sidebar>
          </MainContainer>

        </div>
      </div>
    </Layout>
  );
}

export default Index;
