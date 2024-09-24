import React, { useState, useEffect, useRef } from 'react';
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
  Search,
} from '@chatscope/chat-ui-kit-react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';

function Index({ conversation, chats, conversations }) {
  const [dataConversations, setDataConversations] = useState(conversations);
  const [chatName, setChatName] = useState(conversation.name);
  const [editName, setEditName] = useState(false);
  const [messages, setMessages] = useState(chats);
  const [isTyping, setIsTyping] = useState(false);
  const [idConversation, setIdConversation] = useState(conversation.id);
  const [selectedMessageForThread, setSelectedMessageForThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState({});
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
  const [filterConversation, setFilterConversation] = useState(dataConversations);

  // Ref for auto-scrolling
  const messageListRef = useRef(null);

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
      parent_id: selectedMessageForThread ? selectedMessageForThread.id : null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      await axios.post('/chat', {
        conversation_id: idConversation,
        sender_id: 1,
        response: 0,
        content: message,
        parent_id: selectedMessageForThread ? selectedMessageForThread.id : null
      }).then((res) => {
        setMessages(res.data.data);
        setThreadMessages((prevThreads) => ({
          ...prevThreads,
          [selectedMessageForThread?.id]: [...(prevThreads[selectedMessageForThread?.id] || []), res.data.data]
        }));
        setSelectedMessageForThread(null);
      });

      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;

      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
          direction: 'incoming',
          parent_id: newMessage.parent_id,
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);

        await axios.post('/chat', {
          conversation_id: idConversation,
          sender_id: 0,
          response: true,
          content: content,
          parent_id: newMessage.parent_id,
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

  const handleSelectMessageForThread = (message) => {
    setSelectedMessageForThread(message);
  };

  const renderThreadMessages = (message) => {
    const threads = threadMessages[message.id] || [];
    return (
      <div className="thread-messages">
        {threads.map((thread, index) => (
          <Message
            key={index}
            model={{
              message: thread.content,
              direction: thread.sender_id !== 0 ? 'outgoing' : 'incoming',
              position: "single",
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    axios.get(`/chat/${idConversation}`).then((res) => {
      setMessages(res.data.data);
      setChatName(dataConversations.find((conversation) => conversation.id === idConversation).name);
    });
  }, [idConversation]);

  useEffect(() => {
    // Scroll to the bottom of the message list when messages change
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a helpful assistant." },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  const handleNewChat = (e) => {
    e.preventDefault();
    axios.post('/admin/conversations', { name: 'New Chat' })
      .then((res) => {
        setDataConversations(res.data.data);
        setFilterConversation(res.data.data);
        notyf.success('New chat created successfully');
      });
  };

  const submitEditName = () => {
    if (chatName === '') {
      notyf.error('Conversation name cannot be empty');
      return;
    }

    axios.put(`/admin/conversations/${idConversation}`, { name: chatName })
      .then((res) => {
        setChatName(res.data.data.name);
        setEditName(false);
        setDataConversations(res.data.conversations);
        setFilterConversation(res.data.conversations);
        notyf.success('Conversation name updated successfully');
      })
      .catch(() => notyf.error('Error updating conversation name'));
  };

  const handleDeleteConversation = (id) => {
    Swal.fire({
      icon: 'question',
      text: "Delete this conversation ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/admin/conversations/${id}`).then((res) => {
          setDataConversations(res.data.data);
          setFilterConversation(res.data.data);
          notyf.success('Conversation deleted successfully');
        });
      }
    });
  };

  const [info, setInfo] = useState('');
  useEffect(() => {
    setFilterConversation(dataConversations.filter((conversation) => {
      return conversation.name.toLowerCase().includes(info.toLowerCase());
    }));
  }, [info]);

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-md" style={{ height: '700px' }}>
          <MainContainer style={{ height: '600px' }} responsive>
            <Sidebar position="left" scrollable={false}>
              <Search onKeyUp={(e) => setInfo(e.target.value)} placeholder="Search..." />
              <div className="row justify-content-center">
                <div className="col-md-9">
                  <button className='btn btn-primary w-100' onClick={(e) => handleNewChat(e)}>New chat</button>
                </div>
              </div>
              <ConversationList className='mt-2'>
                {filterConversation.length > 0 && filterConversation.map((conversation) => (
                  <div key={conversation.id} className="d-flex align-items-center justify-content-between w-100">
                    <Conversation
                      onClick={() => setIdConversation(conversation.id)}
                      name={conversation.name}
                    >
                      <Avatar />
                    </Conversation>
                    <DeleteIcon onClick={() => handleDeleteConversation(conversation.id)} />
                  </div>
                ))}
              </ConversationList>
            </Sidebar>

            <ChatContainer>
              <ConversationHeader>
                <Avatar />
                <ConversationHeader.Content>
                  {!editName ?
                    <div className="d-flex align-items-center">
                      <strong className='me-3'>{chatName}</strong>
                      <button className='btn btn-sm btn-primary' onClick={() => setEditName(true)}>Edit name</button>
                    </div> :
                    <div className="d-flex align-items-center">
                      <input className="form-control me-3" value={chatName} onChange={(e) => setChatName(e.target.value)} />
                      <button className="btn btn-sm btn-primary me-1" onClick={submitEditName}>Save</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setEditName(false)}>Cancel</button>
                    </div>
                  }
                </ConversationHeader.Content>
              </ConversationHeader>

              <MessageList ref={messageListRef} typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing..." /> : null}>
                {messages.length > 0 && messages.map((message, index) => (
                  <div key={index}>
                    <Message
                      model={{
                        message: message.content,
                        direction: message.sender_id !== 0 ? 'outgoing' : 'incoming',
                        position: "single",
                      }}
                      onClick={() => handleSelectMessageForThread(message)} // Set thread parent message
                    />
                    {renderThreadMessages(message)} {/* Display thread messages */}
                  </div>
                ))}
              </MessageList>

              <MessageInput
                placeholder="Type message here"
                attachButton={false}
                onSend={handleSendRequest}
              >
                {selectedMessageForThread && (
                  <div className="replying-to">
                    <strong>Replying to:</strong> {selectedMessageForThread.content}
                  </div>
                )}
              </MessageInput>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
