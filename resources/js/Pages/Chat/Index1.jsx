import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidechat from "../../components/Sidechat";
import Chat from "../../components/Chat";
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
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
function Index({conversation, chats, conversations}) {
    const [dataConversations, setDataConversations] = useState(conversations);
    const [chatName, setChatName] = useState(conversation.name);
    const [editName, setEditName] = useState(false);
    const [messages, setMessages] = useState(chats);
    const [isTyping, setIsTyping] = useState(false);
    const [idConversation, setIdConversation] = useState(conversation.id);
    const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
    const [filterConversation, setFilterConversation] = useState(dataConversations);
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
        axios.get(`/chat/${idConversation}`).then((res) => {
          setMessages(res.data.data);
          setChatName(dataConversations.find((conversation) => conversation.id === idConversation).name);
        })
      }, [idConversation])
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
        model: "GPT-4o mini",
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
          setFilterConversation(res.data.data);
          notyf.success('New chat created successfully');
        })
    }
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
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          axios.delete(`/admin/conversations/${id}`).then((res) => {
            setDataConversations(res.data.data);
            setFilterConversation(res.data.data);
            notyf.success('Conversation deleted successfully');
          })
        } 
      });
      
    }
    const [info, setInfo] = useState('');
    useEffect(() => {
      setFilterConversation(dataConversations.filter((conversation) => {
        return conversation.name.toLowerCase().includes(info.toLowerCase());
      }))
    }, [info])
  const [sidebar, setSidebar] = useState(true);

  const toggleSidebar = () => {
    setSidebar((prevSidebar) => !prevSidebar);
  };

  return (
    <>
      <div className="sidebar-active">
        <div className="chitchat-container sidebar-toggle">
        <Navbar toggleSidebar={toggleSidebar} sidebar={sidebar} />
        <Sidechat conversations={conversations} toggleSidebar={toggleSidebar} sidebar={sidebar} />
        <Chat datamessages={messages} conversation={conversation} />
          <aside className="chitchat-right-sidebar" id="slide-menu">
            <div className="custom-scroll right-sidebar">
              <div className="contact-profile">
                <div className="theme-title">
                  <div className="d-flex">
                    <div>
                      <h2>Profile</h2>
                      <h4>Personal Information</h4>
                    </div>
                    <div className="flex-grow-1">
                      {" "}
                      <a
                        className="icon-btn btn-outline-light btn-sm close-profile ms-3"
                        href="#"
                      >
                        {" "}
                        <i data-feather="x"> </i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="details">
                  <div className="contact-top">
                    <img
                      className="bg-img"
                      src="../assets/images/avtar/2.jpg"
                      alt=""
                    />
                  </div>
                  <div className="name">
                    <h3>{conversation.name}</h3>
                  </div>
                  <ul className="medialogo">
                    <li>
                      <a
                        className="icon-btn btn-danger button-effect"
                        href="https://www.google.com/"
                      >
                        <i className="fa fa-google" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-primary button-effect"
                        href="https://twitter.com/"
                      >
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-facebook button-effect"
                        href="https://www.facebook.com/"
                      >
                        <i className="fa fa-facebook-f" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="document">
                <div className="filter-block">
                  <div className="collapse-block open">
                    <h5 className="block-title">
                      Shared Document
                      <label className="badge badge-success sm ms-2">3</label>
                    </h5>
                    <div className="block-content">
                      <ul className="document-list">
                        <li>
                          <i className="ti-folder font-danger" />
                          <h5>Simple_practice_project-zip</h5>
                        </li>
                        <li>
                          <i className="ti-write font-success" />
                          <h5>Word_Map-jpg</h5>
                        </li>
                        <li>
                          <i className="ti-zip font-primary" />
                          <h5>Latest_Design_portfolio.pdf</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="media-gallery portfolio-section grid-portfolio">
                <div className="collapse-block open">
                  <h5 className="block-title">
                    Shared Media
                    <label className="badge badge-primary sm ms-2">2</label>
                  </h5>
                  <div className="block-content">
                    <div className="row share-media zoom-gallery">
                      <div className="col-12">
                        <h6 className="mb-2">22/03/2023</h6>
                      </div>
                      <div className="col-4 isotopeSelector filter">
                        <div className="media-big">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/1.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/1.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/2.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/2.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/3.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/3.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/4.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/4.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="media-small isotopeSelector filter fashion">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/5.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/5.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <h6 className="mb-2 mt-2">20/04/2023</h6>
                      </div>
                      <div className="col-4">
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/2.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/2.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/3.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/3.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="media-small isotopeSelector filter">
                          <div className="overlay">
                            <div className="border-portfolio">
                              <a href="../assets/images/gallery/4.jpg">
                                <div className="overlay-background">
                                  <i className="ti-plus" aria-hidden="true" />
                                </div>
                                <img
                                  className="img-fluid bg-img"
                                  src="../assets/images/gallery/4.jpg"
                                  alt="portfolio-image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="status">
                <div className="collapse-block open">
                  <h5 className="block-title">
                    Starred Messages
                    <label className="badge badge-outline-dark sm ms-2">
                      2
                    </label>
                  </h5>
                  <div className="block-content">
                    <div className="contact-chat p-0 m-0">
                      <ul className="str-msg">
                        <li>
                          <div className="d-flex">
                            <div className="profile me-4">
                              <img
                                className="bg-img"
                                src="../assets/images/contact/2.jpg"
                                alt="Avatar"
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="contact-name">
                                <h5>Alan josheph</h5>
                                <h6>01:35 AM</h6>
                                <ul className="msg-box">
                                  <li>
                                    <h5>Hi I am Alan,</h5>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="d-flex">
                            <div className="profile me-4">
                              <img
                                className="bg-img"
                                src="../assets/images/contact/3.jpg"
                                alt="Avatar"
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="contact-name">
                                <h5>Josephin water</h5>
                                <h6>01:35 AM</h6>
                                <ul className="msg-box">
                                  <li>
                                    <h5>
                                      Can you help me to find best chat app?.
                                    </h5>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="status">
                <div className="collapse-block open">
                  <h5 className="block-title">
                    Common groups
                    <label className="badge badge-outline-dark sm ms-2">
                      3
                    </label>
                  </h5>
                  <div className="block-content">
                    <ul className="group-main">
                      <li>
                        <div className="group-box">
                          <div className="profile">
                            <img
                              className="bg-img"
                              src="../assets/images/avtar/teq.jpg"
                              alt="Avatar"
                            />
                          </div>
                          <div className="details">
                            <h5>Tech Ninjas</h5>
                            <h6>johan, deo, Sufiya Elija, Pabelo &amp; you</h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="group-box">
                          <div className="profile">
                            <img
                              className="bg-img"
                              src="../assets/images/avtar/family.jpg"
                              alt="Avatar"
                            />
                          </div>
                          <div className="details">
                            <h5>Family Ties</h5>
                            <h6>Mukrani, deo &amp; you</h6>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="status other">
                <h5 className="block-title p-b-25">Contact info</h5>
                <ul>
                  <li>
                    <h5>
                      {" "}
                      <a href="#">
                        {" "}
                        <i data-feather="smartphone" />
                        +12 3456789587
                      </a>
                    </h5>
                  </li>
                  <li>
                    <h5>
                      <a href="https://themeforest.net/user/pixelstrap/portfolio">
                        {" "}
                        <i data-feather="crosshair" />
                        https://pixelstrap
                      </a>
                    </h5>
                  </li>
                  <li>
                    <h5>
                      <a href="#">
                        {" "}
                        <i data-feather="map-pin" />
                        1766 Fidler Drive Texas, 78238.
                      </a>
                    </h5>
                  </li>
                </ul>
              </div>
              <div className="status">
                <ul>
                  <li>
                    <input className="js-switch" type="checkbox" />
                    <h5>Block</h5>
                  </li>
                  <li>
                    <input className="js-switch1" type="checkbox" />
                    <h5>Mute</h5>
                  </li>
                  <li>
                    <input
                      className="js-switch2"
                      type="checkbox"
                      defaultChecked=""
                    />
                    <h5>Get Notification</h5>
                  </li>
                </ul>
              </div>
              <div className="status other">
                <ul>
                  <li>
                    <h5>
                      {" "}
                      <a href="#">
                        {" "}
                        <i data-feather="share-2" />
                        share Contact
                      </a>
                    </h5>
                  </li>
                  <li>
                    <h5>
                      <a href="#">
                        {" "}
                        <i data-feather="trash-2" />
                        Clear Chat
                      </a>
                    </h5>
                  </li>
                  <li>
                    <h5>
                      <a href="#">
                        {" "}
                        <i data-feather="external-link" />
                        Export Chat
                      </a>
                    </h5>
                  </li>
                  <li>
                    <h5>
                      <a href="#">
                        {" "}
                        <i data-feather="alert-circle" />
                        Report Contact{" "}
                      </a>
                    </h5>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <aside className="app-sidebar active">
            <div className="apps">
              <ul className="apps-ul">
                <li id="todo">
                  <div className="todo-main">
                    <div className="theme-title">
                      <div className="d-flex">
                        <div>
                          <h2>Todo</h2>
                          <h4>to create your task</h4>
                        </div>
                        <div className="flex-grow-1">
                          <a
                            className="icon-btn btn-sm btn-outline-light close-apps"
                            href="#"
                          >
                            <i data-feather="x" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="todo-name">
                      <form className="default-form">
                        <select
                          className="custom-scroll"
                          name="support[support_type]"
                        >
                          <option>All Conversations</option>
                          <option>Josephin water</option>
                          <option>Jony Lynetin</option>
                          <option>Sufiya Elija</option>
                          <option>Mukrani Pabelo</option>
                          <option>Jhon Deo</option>
                        </select>
                      </form>
                    </div>
                    <div className="todo-tab theme-tab custom-scroll">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a
                            className="nav-link button-effect active show"
                            data-bs-toggle="pill"
                            href="#todo1"
                          >
                            All
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link button-effect"
                            data-bs-toggle="pill"
                            href="#todo2"
                          >
                            My to-dos
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#todoModal"
                          >
                            <i data-feather="plus"> </i>
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active show" id="todo1">
                          <div className="tab-card text-start">
                            <div className="todo-task">
                              <h4>Designer Discussion </h4>
                              <div className="todo-main-content">
                                <div className="input-text">
                                  <input
                                    type="checkbox"
                                    aria-label="Checkbox for following text input"
                                  />
                                  <input
                                    id="user_input12"
                                    type="text"
                                    name="todo-text"
                                    placeholder="Give me review on our side"
                                  />
                                </div>
                                <div className="drop-picker">
                                  <div
                                    className="dropdown currency"
                                    tabIndex={1}
                                  >
                                    <div className="select">
                                      <span>Assign To</span>
                                    </div>
                                    <input type="hidden" name="currency" />
                                    <ul className="dropdown-menu">
                                      <li className="dropdown-divider">
                                        <div className="fa fa-user" />
                                        <h5 className="text-muted">
                                          Assign To
                                        </h5>
                                      </li>
                                      <li>
                                        <a href="#">Josephin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Lynetin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Sufiya john</a>
                                      </li>
                                      <li>
                                        <a href="#">Jhon john</a>
                                      </li>
                                    </ul>
                                  </div>
                                  <input
                                    className="datepicker-here form-control digits"
                                    type="url"
                                    data-language="en"
                                    placeholder="Due date"
                                  />
                                </div>
                              </div>
                              <div className="todo-list">
                                <div className="element" id="div_3">
                                  <span className="add add-to-do">
                                    Add-To-Do
                                  </span>
                                </div>
                              </div>
                              <div className="todo-main-content">
                                <div className="input-text">
                                  <input
                                    type="checkbox"
                                    aria-label="Checkbox for following text input"
                                  />
                                  <input
                                    id="user_input13"
                                    type="text"
                                    name="todo-text"
                                    placeholder="Redesign Your Design"
                                  />
                                </div>
                                <div className="drop-picker">
                                  <div
                                    className="dropdown currency"
                                    tabIndex={1}
                                  >
                                    <div className="select">
                                      <span>Assign To</span>
                                    </div>
                                    <input type="hidden" name="currency" />
                                    <ul className="dropdown-menu">
                                      <li className="dropdown-divider">
                                        <div className="fa fa-user" />
                                        <h5 className="text-muted">
                                          Assign To
                                        </h5>
                                      </li>
                                      <li>
                                        <a href="#">Josephin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Lynetin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Sufiya john</a>
                                      </li>
                                      <li>
                                        <a href="#">Jhon john</a>
                                      </li>
                                    </ul>
                                  </div>
                                  <input
                                    className="datepicker-here form-control digits"
                                    type="url"
                                    data-language="en"
                                    placeholder="Due date"
                                  />
                                </div>
                              </div>
                              <div className="todo-list">
                                <div className="element" id="div_2">
                                  <span className="add add-to-do">
                                    Add-To-Do
                                  </span>
                                </div>
                              </div>
                              <div className="todo-main-content">
                                <div className="input-text">
                                  <input
                                    type="checkbox"
                                    aria-label="Checkbox for following text input"
                                  />
                                  <input
                                    id="user_input14"
                                    type="text"
                                    name="todo-text"
                                    placeholder=" Complete Project report"
                                  />
                                </div>
                                <div className="drop-picker">
                                  <div
                                    className="dropdown currency"
                                    tabIndex={1}
                                  >
                                    <div className="select">
                                      <span>Assign To</span>
                                    </div>
                                    <input type="hidden" name="currency" />
                                    <ul className="dropdown-menu">
                                      <li className="dropdown-divider">
                                        <div className="fa fa-user" />
                                        <h5 className="text-muted">
                                          Assign To
                                        </h5>
                                      </li>
                                      <li>
                                        <a href="#">Josephin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Lynetin john</a>
                                      </li>
                                      <li>
                                        <a href="#">Sufiya john</a>
                                      </li>
                                      <li>
                                        <a href="#">Jhon john</a>
                                      </li>
                                    </ul>
                                  </div>
                                  <input
                                    className="datepicker-here form-control digits"
                                    type="url"
                                    data-language="en"
                                    placeholder="Due date"
                                  />
                                </div>
                              </div>
                              <div className="todo-list">
                                <div className="element" id="div_1">
                                  <span className="add add-to-do">
                                    Add-To-Do
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="todo2">
                          <div className="converstaion-docs tab-card">
                            <i className="fa fa-sticky-note-o" />
                            <h5 className="mb-3">No Open To-Dos Here </h5>
                            <a
                              className="btn btn-primary btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#createtodoModal"
                            >
                              Create A To-Do
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li id="files">
                  <div className="theme-title">
                    <div className="d-flex">
                      <div>
                        <h2>Files</h2>
                        <h4>Shared Media</h4>
                      </div>
                      <div className="flex-grow-1">
                        <a
                          className="icon-btn btn-sm btn-outline-light close-apps"
                          href="#"
                        >
                          <i data-feather="x"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="theme-tab">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className="nav-link button-effect active"
                          data-bs-toggle="pill"
                          href="#tab1"
                        >
                          Media
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link button-effect"
                          data-bs-toggle="pill"
                          href="#tab2"
                        >
                          Link
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link button-effect"
                          data-bs-toggle="pill"
                          href="#tab3"
                        >
                          Docs
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="file-tab">
                    <div className="tab-content custom-scroll">
                      <div className="tab-pane active" id="tab1">
                        <div className="media-gallery portfolio-section grid-portfolio">
                          <div className="collapse-block open">
                            <h5 className="block-title">
                              12/12/2023
                              <label className="badge badge-primary sm ms-2">
                                8
                              </label>
                            </h5>
                            <div className="block-content">
                              <div className="row share-media zoom-gallery">
                                <div className="col-4 isotopeSelector filter">
                                  <div className="media-big">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/1.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/1.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter fashion">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/5.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/5.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="block-title">
                              10/01/2024
                              <label className="badge badge-primary sm ms-2">
                                5
                              </label>
                            </h5>
                            <div className="block-content">
                              <div className="row share-media zoom-gallery">
                                <div className="col-4 isotopeSelector filter">
                                  <div className="media-big">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/1.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/1.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter fashion">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/5.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/5.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="block-title">
                              30/04/2024
                              <label className="badge badge-primary sm ms-2">
                                2
                              </label>
                            </h5>
                            <div className="block-content">
                              <div className="row share-media zoom-gallery">
                                <div className="col-4 isotopeSelector filter">
                                  <div className="media-big">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/1.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/1.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter fashion">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/5.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/5.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="block-title">
                              10/01/2024
                              <label className="badge badge-primary sm ms-2">
                                2
                              </label>
                            </h5>
                            <div className="block-content">
                              <div className="row share-media zoom-gallery mb-5">
                                <div className="col-4 isotopeSelector filter">
                                  <div className="media-big">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/1.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/1.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="media-small isotopeSelector filter fashion">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/5.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/5.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/2.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/2.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/3.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/3.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="media-small isotopeSelector filter">
                                    <div className="overlay">
                                      <div className="border-portfolio">
                                        <a href="../assets/images/gallery/4.jpg">
                                          <div className="overlay-background">
                                            <i
                                              className="ti-plus"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/gallery/4.jpg"
                                            alt="portfolio-image"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="tab2">
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Jquery Template</h5>
                              <h6>12:05 PM Today </h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/endless-react-admin-template/25365098">
                            https://themeforest.net/item/endless-react-admin-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/12.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>React Template</h5>
                              <h6 className="mt-0">
                                Functionality integration project.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Multikart Template</h5>
                              <h6>05:12 AM Today</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/multikart-responsive-vuejs-ecommerce-template/25174665">
                            https://themeforest.net/item/multikart-responsive-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/3.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Multipurpose Vuejs.</h5>
                              <h6 className="mt-0">
                                Template is a multi-use Vue template.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Unice-Multipurpose</h5>
                              <h6>03:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/unice-angular-multipurpose-template/24776272">
                            https://themeforest.net/item/unice-angular-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/8.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Angular Template.</h5>
                              <h6 className="mt-0">
                                Unice is a Perfect Respon.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Endless-Angular</h5>
                              <h6>02:26 AM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/endless-angular-admin-template/23884779">
                            https://themeforest.net/item/endless-angular-admin-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/12.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Endless Document.</h5>
                              <h6 className="mt-0">
                                Help you understand angular.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Bigdeal-eCommerce</h5>
                              <h6>04:00 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/bigdeal-ecommerce-htms-template/24809149">
                            https://themeforest.net/item/bigdeal-ecommerce-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/9.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>HTML Template.</h5>
                              <h6 className="mt-0">eCommerce HTML Template.</h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Multikart-Responsive.</h5>
                              <h6>11:05 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/multikart-responsive-react-ecommerce-template/23067773">
                            https://themeforest.net/item/multikart-responsive-react-ecommerce
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/3.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Multipurp eComme.</h5>
                              <h6 className="mt-0">
                                Well with multi-purpose websites.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Creative - Responsive</h5>
                              <h6>12:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/creative-responsive-admin-template/24978419">
                            https://themeforest.net/item/creative-responsive
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/11.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Dashboard Templa.</h5>
                              <h6 className="mt-0">
                                Creative Admin is a full featured.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">eComme Template</h5>
                              <h6>12:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/multikart-responsive-angular-ecommerce-template/22905358">
                            https://themeforest.net/item/multikart-responsive-angular
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/3.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Responsive Ang.</h5>
                              <h6 className="mt-0">
                                Multikart – Multipurpose.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <div className="d-flex" />
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Multikart Templat.</h5>
                              <h6>12:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/multikart-responsive-ecommerce-htms-template/22809967">
                            https://themeforest.net/item/multikart-responsive-ecommerce
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/10.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Multi Responsive.</h5>
                              <h6 className="mt-0">Ecommerce HTML Theme.</h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <div className="d-flex" />
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">BigBoost Template</h5>
                              <h6>04:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/bigboost-ecommerce-htms-template/24168053">
                            https://themeforest.net/item/bigboost-ecommerce-htms-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/7.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Fully Responsive.</h5>
                              <h6 className="mt-0">
                                Multiple Header Varations.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">App Landing </h5>
                              <h6>10:05 PM 20/05/2023</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/unice-app-landing-corporate-and-portfolio-multipurpose-template/24581311">
                            https://themeforest.net/item/unice-app-landing-corporate-and-portfolio-multipurpose-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/4.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Multi-Purpos theme.</h5>
                              <h6 className="mt-0">
                                Unice is a Perfect Responsive.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Reno - Tools Store</h5>
                              <h6>12:26 PM</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/reno-multipurpose-htms-template/24141678">
                            https://themeforest.net/item/reno-multipurpose-htms-template
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/6.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Reno Template is a busines.</h5>
                              <h6 className="mt-0">
                                Android Mobile or tablets.
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="link-group mb-5">
                          <div className="d-flex">
                            <i data-feather="link" />
                            <div className="flex-grow-1">
                              <h5 className="mt-0">Shop - Mart</h5>
                              <h6>12:26 PM 03/11/2023</h6>
                            </div>
                          </div>
                          <a href="https://themeforest.net/item/shopmart-multipurpose-shopify-theme/24040917?s_rank=12">
                            https://themeforest.net/item/shopmart-multipurpose-shopify-theme
                          </a>
                          <div className="d-flex">
                            <img
                              className="img-fluid"
                              src="../assets/images/file_icons/5.png"
                              alt="media-img"
                            />
                            <div className="flex-grow-1">
                              <h5>Shop Mart Landing Page.</h5>
                              <h6 className="mt-0">
                                This is App Landing Template.
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="tab3">
                        <ul className="chat-main">
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-danger btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-code-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>messenger.html</h5>
                                  <h6>2, octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/messenger.html"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-success btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-video-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>chapter1.MP4</h5>
                                  <h6>3, Octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/chapter1.MP4"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-primary btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-word-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>salary.xlsx</h5>
                                  <h6>5, Octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/salary.xlsx"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-warning btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-pdf-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>document.pdf</h5>
                                  <h6>7, Octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/document.pdf"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-danger btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-text-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>details.txt</h5>
                                  <h6>20, Octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/details.txt"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="chat-box">
                              <div className="d-flex">
                                <div className="profile">
                                  <a
                                    className="icon-btn btn-outline-success btn-xl pull-right rouded15"
                                    href="#"
                                  >
                                    <i className="fa fa-file-code-o" />
                                  </a>
                                </div>
                                <div className="details">
                                  <h5>messenger.html</h5>
                                  <h6>2, octomber 2023</h6>
                                </div>
                                <div className="flex-grow-1">
                                  <a
                                    className="icon-btn btn-outline-light btn-sm pull-right"
                                    href="../assets/doc/messenger.html"
                                    target="_blank"
                                  >
                                    <i data-feather="download" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
                <li id="notes">
                  <div className="notes-main">
                    <div className="theme-title">
                      <div className="d-flex">
                        <div>
                          <h2>Notes</h2>
                          <h4>Notes List</h4>
                        </div>
                        <div className="flex-grow-1">
                          <a
                            className="icon-btn btn-sm btn-outline-light close-apps"
                            href="#"
                          >
                            <i data-feather="x" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <form className="default-form">
                      <div className="form-group notes-content">
                        <select>
                          <option>Contact Or Channel</option>
                          <option>Weekdays (Mon-Fri)</option>
                          <option>Daily</option>
                          <option>Weekly (Custom)</option>
                        </select>
                        <ul>
                          <li>
                            <a
                              className="icon-btn btn-light button-effect btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#notesModal"
                            >
                              <i data-feather="plus" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </form>
                    <div className="notes-list">
                      <h6 className="mb-2 text-muted">
                        Joshephin Water.10 Jan
                      </h6>
                      <div className="d-flex">
                        <img
                          className="img-fluid me-3"
                          src="../assets/images/file_icons/5.png"
                          alt="media-img"
                        />
                        <div className="flex-grow-1">
                          <h5 className="mt-0">Joshephin Water</h5>
                        </div>
                      </div>
                      <h5 className="mb-2">Imporatnt project link</h5>
                      <h6 className="mb-2">
                        Please start testing task of your projects.
                      </h6>
                      <div className="forward-main">
                        <a className="line fa fa-mail-forward" href="#">
                          Forward{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
                <li id="reminder">
                  <div className="reminder-main">
                    <div className="theme-title">
                      <div className="d-flex">
                        <div>
                          <h2>Reminders</h2>
                          <h4>Set reminders</h4>
                        </div>
                        <div className="flex-grow-1">
                          <a
                            className="icon-btn btn-sm btn-outline-light close-apps"
                            href="#"
                          >
                            <i data-feather="x" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="reminder-content tab-card">
                      <i className="ti-alarm-clock" />
                      <p>
                        Never forget important tasks. Set personal and group
                        reminders.
                      </p>
                      <a
                        className="setreminder btn btn-primary button-effect btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#setReminder"
                      >
                        set reminder
                      </a>
                    </div>
                    <div className="reminder-list-disp">
                      <h5>Themeforest Discusssion</h5>
                      <h6>Project Discussion</h6>
                      <span>11:22 PM | 15 FAB</span>
                      <ul className="reminder-disp">
                        <li className="reminder-list-toggle">
                          <a className="icon-btn bg-transparent" href="#">
                            <i data-feather="more-vertical" />
                          </a>
                          <div className="reminder-contentlist-toggle">
                            <ul>
                              <li>
                                <a className="icon-btn btn-sm" href="#">
                                  <i data-feather="trash" />
                                </a>
                                <h5>Delete</h5>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="reminder-list">
                      <button className="Show-reminder">Show Completed</button>
                      <button className="Hide-reminder">Hide Completed</button>
                      <div className="target-reminder-list">
                        <h5>Session Start</h5>
                        <h6>Project Discussion</h6>
                        <h6>05:22 PM | 1 JAN</h6>
                        <ul className="reminder-disp">
                          <li className="reminder-toggle">
                            <a
                              className="icon-btn bg-transparent"
                              href="#"
                              data-tippy-content="Quick action"
                            >
                              <i data-feather="more-vertical" />
                            </a>
                            <div className="reminder-content-toggle">
                              <ul>
                                <li>
                                  <a className="icon-btn btn-sm" href="#">
                                    <i data-feather="trash" />
                                  </a>
                                  <h5>Delete</h5>
                                </li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="app-list">
              <ul className="app-list-ul custom-scroll">
                <li className="title apps-toggle">
                  <i data-feather="grid" />
                  <h5>Apps</h5>
                </li>
                <li>
                  <a
                    className="icon-btn btn-outline-success btn-sm button-effect"
                    href="files"
                  >
                    <i class="bi bi-file-earmark-arrow-up"></i>
                  </a>
                  <h5>Files </h5>
                </li>
                <li>
                  <a
                    className="icon-btn btn-outline-primary btn-sm button-effect"
                    href="notes"
                  >
                    <i class="bi bi-card-heading"></i>
                  </a>
                  <h5>Notes </h5>
                </li>
                <li>
                  <a
                    className="icon-btn btn-outline-danger btn-sm button-effect"
                    href="todo"
                  >
                    <i class="bi bi-journal-text"></i>
                  </a>
                  <h5>Todo </h5>
                </li>
                <li>
                  <a
                    className="icon-btn btn-outline-warning btn-sm button-effect"
                    href="reminder"
                  >
                    <i class="bi bi-alarm"></i>
                  </a>
                  <h5>Reminder</h5>
                </li>
                <li className="close-app">
                  <a
                    className="icon-btn btn-danger"
                    href="#"
                    onclick="removedefault()"
                  >
                    <i class="bi bi-x"></i>
                  </a>
                  <h5>close</h5>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <div
          className="modal fade add-popup add-contact-modal"
          id="exampleModalCenter"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Contact</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <div className="form-group text-center">
                    <h5>Email or Username</h5>
                    <input
                      className="form-control"
                      id="exampleInputEmail1"
                      type="text"
                      placeholder="Josephin water"
                    />
                  </div>
                  <div className="form-group mb-0 text-center">
                    <h5>Contact number</h5>
                    <input
                      className="form-control"
                      id="examplemsg"
                      type="number"
                      placeholder={12345678912}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger button-effect btn-sm"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary button-effect btn-sm"
                  type="button"
                >
                  Add contact
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal pol-modal-main add-popup"
          id="pollModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <i data-feather="bar-chart-2" />
                  poll
                </h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <h3>create poll</h3>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="ask que"
                    />
                    <input
                      className="form-control"
                      type="text"
                      placeholder="add commatn"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="option 1"
                    />
                    <input
                      className="form-control"
                      type="text"
                      placeholder="option 2"
                    />
                    <a className="add-option" href="#">
                      add an option
                    </a>
                  </div>
                  <div className="form-group">
                    <div className="post-poll">
                      <ul>
                        <li>
                          post poll in
                          <p className="pt-0">test name</p>
                        </li>
                        <li>
                          poll expier in 7 days
                          <p className="pt-0">test name</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="allow-group">
                      <input className="allow-check" type="checkbox" />
                      Allow users to vote anonymously
                    </div>
                  </div>
                  <div className="creat-poll-btn">
                    <a
                      className="btn btn-primary button-effect btn-sm"
                      href="#"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Create poll
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal notes-modal-main add-popup"
          id="notesModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <i className="ti-bookmark-alt" />
                  notes
                </h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body custom-scroll p-0">
                <div className="card">
                  <div className="card-header">
                    <h5>Inline Editor</h5>
                  </div>
                  <div className="card-body">
                    <div
                      className="cke_editable cke_editable_inline cke_contents_ltr cke_show_borders"
                      id="area1"
                      contentEditable="true"
                      tabIndex={0}
                      spellCheck="false"
                      role="textbox"
                      aria-label="Rich Text Editor, area1"
                      title="Rich Text Editor, area1"
                    >
                      <h1>Your title</h1>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec at vulputate urna, sed dignissim arcu. Aliquam at
                        ligula imperdiet, faucibus ante a, interdum enim. Sed in
                        mauris a lectus lobortis condimentum. Sed in nunc magna.
                        Quisque massa urna, cursus vitae commodo eget, rhoncus
                        nec erat. Sed sapien turpis, elementum sit amet elit
                        vitae, elementum gravida eros. In ornare tempus nibh ut
                        lobortis. Nam venenatis justo ex, vitae vulputate neque
                        laoreet a.
                      </p>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn btn-danger button-effect btn-sm"
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-primary button-effect btn-sm"
                      type="button"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal reminder-modal-main add-popup"
          id="setReminder"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content custom-scrollbar">
              <div className="modal-header">
                <h2 className="modal-title">Set redminders</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="form default-form">
                  <div className="lable">Reminder for (Groups or contacts)</div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="contact or channel"
                    />
                  </div>
                  <div className="lable">Remind about</div>
                  <div className="form-group">
                    <textarea
                      className="form-control dib"
                      rows={3}
                      placeholder="Some details about task"
                      defaultValue={""}
                    />
                  </div>
                  <div className="lable">Remind about</div>
                  <div className="form-group">
                    <ul className="reminder-count">
                      <li className="active">
                        <div className="reminder-box">
                          <h3 className="remi-num">15</h3>
                          <h5 className="remi-val">minutes</h5>
                        </div>
                      </li>
                      <li>
                        <div className="reminder-box">
                          <h3 className="remi-num">1</h3>
                          <h5 className="remi-val">hour</h5>
                        </div>
                      </li>
                      <li>
                        <div className="reminder-box">
                          <h3 className="remi-num">5 PM</h3>
                          <h5 className="remi-val">today</h5>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="form-group mb-0">
                    <div className="lable">select custom time</div>
                    <div className="custom-remider-main">
                      <div className="custom-remider-content">
                        <div className="custom-reminder-inline">
                          <input className="form-control" type="date" />
                          <input className="form-control" type="time" />
                        </div>
                        <div className="custom-reminder-block">
                          <select>
                            <option>Do not repeat</option>
                            <option>Weekdays (Mon-Fri)</option>
                            <option>Daily</option>
                            <option>Weekly (Custom)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="reminder-btn mb-3">
                    <a className="btn btn-primary button-effect">
                      set reminder
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal snippet-modal-main add-popup"
          id="snippetModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <i className="fa fa-code" />
                  code snippets
                </h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <h3>creat snippets</h3>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="title(optional)"
                    />
                  </div>
                  <div className="form-group">
                    <select className="mb-0">
                      <option>ebnf</option>
                      <option>c++</option>
                      <option>diff</option>
                      <option>dart</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={5}
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control mb-0"
                      type="text"
                      placeholder="add commant (optional)"
                    />
                  </div>
                  <div className="form-group mb-0">
                    <div className="btn-snipate">
                      <a
                        className="btn btn-danger button-effect btn-sm me-3"
                        href="#"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        Cancel
                      </a>
                      <a
                        className="btn btn-primary button-effect btn-sm"
                        href="#"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        Create &amp; post
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="audiocall"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-body">
              <div className="audiocall1 call-modal">
                <img
                  className="bg-img"
                  src="../assets/images/avtar/big/audiocall.jpg"
                  alt="Avatar"
                />
                <div className="center-con text-center">
                  <div className="title2">Josephin water</div>
                  <h6>log angelina california</h6>
                  <ul>
                    <li>
                      <a
                        className="icon-btn btn-success button-effect btn-xl is-animating"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#audiorcvcall"
                        data-bs-dismiss="modal"
                      >
                        {" "}
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      {" "}
                      <a
                        className="icon-btn btn-danger button-effect btn-xl is-animating cancelcall"
                        href="#"
                        data-bs-dismiss="modal"
                      >
                        {" "}
                        <i data-feather="phone" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="viddiolog modal fade"
          id="videocall"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-body">
              <div className="videocall call-modal">
                <img
                  className="bg-img"
                  src="../assets/images/avtar/big/videocall_bg.jpg"
                  alt="Avatar"
                />
                <div className="small-image">
                  <img
                    className="bg-img"
                    src="../assets/images/avtar/big/videocall.jpg"
                    alt="Avatar"
                  />
                </div>
                <div className="d-flex gap-3 videocall-details">
                  <div className="usersprof">
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/2.jpg"
                        alt="Avatar"
                      />
                    </div>
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/3.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h5>Josephin water</h5>
                    <h6>America ,California</h6>
                  </div>
                  <div id="basicUsage">00:00:00</div>
                  <div className="zoomcontent">
                    <a
                      className="text-dark"
                      href="#!"
                      onclick="javascript:toggleFullScreen()"
                      data-tippy-content="Zoom Screen"
                    >
                      <img
                        src="../assets/images/logo/maximize.svg"
                        alt="zoom screen"
                      />
                    </a>
                  </div>
                </div>
                <div className="center-con text-center">
                  <ul>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect pause"
                        href="#"
                        data-tippy-content="Hold"
                      >
                        <i className="ti-control-pause" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-danger button-effect btn-xl is-animating"
                        href="#"
                        data-bs-dismiss="modal"
                        data-tippy-content="Hangup"
                      >
                        {" "}
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect mic"
                        href="#"
                        data-tippy-content="Mute"
                      >
                        <i className="fa fa-microphone" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="confercall"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-body">
              <div className="conferencecall call-modal">
                <img
                  className="bg-img"
                  src="../assets/images/avtar/big/audiocall.jpg"
                  alt="Avatar"
                />
                <div className="center-con text-center">
                  <div className="usersprof">
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/2.jpg"
                        alt="Avatar"
                      />
                    </div>
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/3.jpg"
                        alt="Avatar"
                      />
                    </div>
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/5.jpg"
                        alt="Avatar"
                      />
                    </div>
                    <div className="profile">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/big/videocall_bg.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <p>Incoming Call</p>
                  <h3>Conference Call</h3>
                  <ul>
                    <li>
                      {" "}
                      <a
                        className="icon-btn btn-danger button-effect btn-xl is-animating cancelcall"
                        href="#"
                        data-bs-dismiss="modal"
                      >
                        {" "}
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-success button-effect btn-xl is-animating"
                        href="#"
                      >
                        {" "}
                        <i data-feather="video" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="confvideocl"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="row confimg">
                  <div className="col-6">
                    <div className="vclimg">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/big/videocall_bg.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="vclimg">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/5.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="vclimg">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/2.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="vclimg">
                      <img
                        className="bg-img"
                        src="../assets/images/avtar/3.jpg"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer clfooter">
                <div id="basicUsage3">00:00:00</div>
                <ul>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect"
                      href="#"
                      data-tippy-content="speaker"
                    >
                      <i data-feather="volume-2" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect"
                      href="#"
                      data-tippy-content="Camera"
                    >
                      <i data-feather="camera-off" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect"
                      href="#"
                      data-tippy-content="Add Call"
                    >
                      <i data-feather="user-plus" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-danger button-effect btn-sm is-animating"
                      href="#"
                      data-bs-dismiss="modal"
                      data-tippy-content="Hangup"
                    >
                      <i data-feather="phone" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect"
                      href="#"
                      data-tippy-content="Disable Video"
                    >
                      <i data-feather="video-off" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect mic"
                      href="#"
                      data-tippy-content="Mute"
                    >
                      <i data-feather="mic-off" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="icon-btn btn-light button-effect"
                      href="#"
                      data-tippy-content="Hold"
                    >
                      <i data-feather="pause" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade audiorcvcall"
          id="audiorcvcall"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-body">
              <div className="audiocall2 call-modal">
                <img
                  className="bg-img"
                  src="../assets/images/avtar/big/audiocall.jpg"
                  alt="Avatar"
                />
                <div className="center-con text-center">
                  <div id="basicUsage2">00:00:00</div>
                  <div className="title2">Josephin water</div>
                  <h6>log angelina california</h6>
                  <ul>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect mute"
                        href="#"
                        data-tippy-content="Mute"
                      >
                        <i className="fa fa-microphone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect mute"
                        href="#"
                        data-tippy-content="Speaker"
                      >
                        <i className="fa fa-volume-up" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-danger button-effect btn-xl is-animating"
                        href="#"
                        data-tippy-content="Hangup"
                        data-bs-dismiss="modal"
                      >
                        {" "}
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Add Call"
                      >
                        <i data-feather="user-plus" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Pause"
                      >
                        <i data-feather="pause" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade fev-addcall-main add-popup"
          id="addcallmodal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Contact</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <div className="form-group text-center">
                    <h5>Email or Username</h5>
                    <input
                      className="form-control"
                      id="exampleInputEmail12"
                      type="text"
                      placeholder="Josephin water"
                    />
                  </div>
                  <div className="form-group text-center">
                    <h5>Contact number</h5>
                    <input
                      className="form-control"
                      id="examplemsg2"
                      type="number"
                      placeholder={12345678912}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger button-effect btn-sm"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary button-effect btn-sm"
                  type="button"
                >
                  Add contact
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade add-popup todo-main-modal"
          id="todoModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Welcome to Chitchat</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <div className="todo-task">
                    <h5>Felling Lonely</h5>
                    <div className="todo-main-content">
                      <div className="form-group">
                        <input
                          type="checkbox"
                          aria-label="Checkbox for following text input"
                        />
                        <input
                          className="w-100"
                          id="user_input123"
                          type="text"
                          placeholder="Fill Your Fillings "
                        />
                      </div>
                      <div className="drop-picker">
                        <div className="dropdown currency" tabIndex={1}>
                          <div className="select">
                            <span>Assign To</span>
                          </div>
                          <input type="hidden" name="currency" />
                          <ul className="dropdown-menu">
                            <li className="dropdown-divider">
                              <div className="fa fa-user text-muted" />
                              <h5 className="text-muted">Assign To</h5>
                            </li>
                            <li>Josephin john</li>
                            <li>Lynetin john</li>
                            <li>Sufiya john</li>
                            <li>Jhon john</li>
                          </ul>
                        </div>
                        <input
                          className="datepicker-here form-control digits"
                          type="url"
                          data-language="en"
                          placeholder="Due date"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger button-effect btn-sm"
                  type="button"
                >
                  Save
                </button>
                <button
                  className="btn btn-primary button-effect btn-sm"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade add-popup create-todo-main-modal"
          id="createtodoModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Today's ToDo</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form className="default-form">
                  <div className="todo-task">
                    <h5>Felling Lonely</h5>
                    <div className="todo-main-content">
                      <div className="form-group">
                        <input
                          type="checkbox"
                          aria-label="Checkbox for following text input"
                        />
                        <input
                          className="w-100"
                          id="user_input123"
                          type="text"
                          placeholder="Fill Your Fillings "
                        />
                      </div>
                      <div className="drop-picker">
                        <div className="dropdown currency" tabIndex={1}>
                          <div className="select">
                            <span>Assign To</span>
                          </div>
                          <input type="hidden" name="currency" />
                          <ul className="dropdown-menu">
                            <li className="dropdown-divider">
                              <div className="fa fa-user text-muted" />
                              <h5 className="text-muted">Assign To</h5>
                            </li>
                            <li>Josephin john</li>
                            <li>Lynetin john</li>
                            <li>Sufiya john</li>
                            <li>Jhon john</li>
                          </ul>
                        </div>
                        <input
                          className="datepicker-here form-control digits"
                          type="url"
                          data-language="en"
                          placeholder="Due date"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger button-effect btn-sm"
                  type="button"
                >
                  Save
                </button>
                <button
                  className="btn btn-primary button-effect btn-sm"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade add-popup msg-chat-modal"
          id="msgchatModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Create New Message</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="chat-msg-search">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon21"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon21">
                        @
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="chat-main custom-scroll">
                  <li className="active" data-to="chating">
                    <div className="chat-box">
                      <div className="profile online">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>Typing................</h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>30/11/23</h6>
                        <div className="badge badge-primary sm">8</div>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile unreachable">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/3.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Sufiya Elija</h5>
                        <h6>I need job, please help me.</h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>15/06/23</h6>
                        <h6 className="font-dark status"> Sending</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile busy">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/4.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Mukrani Pabelo</h5>
                        <h6>
                          Hi, i am josephin. How are you.. ! There are many
                          variations of passages.
                        </h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>04/06/23</h6>
                        <h6 className="font-danger status"> Failed</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile busy">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jhon Deo</h5>
                        <h6>
                          Hi, i am josephin. How are you.. ! There are many
                          variations of passages.
                        </h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>04/06/23</h6>
                        <h6 className="font-danger status"> Failed</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile busy">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/1.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Pabelo Mukrani</h5>
                        <h6>
                          Hi, i am josephin. How are you.. ! There are many
                          variations of passages.
                        </h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>04/06/23</h6>
                        <h6 className="font-danger status"> Failed</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile unreachable">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/3.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Sufiya Elija</h5>
                        <h6>I need job, please help me.</h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>15/06/23</h6>
                        <h6 className="font-dark status"> Sending</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile busy">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/4.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Mukrani Pabelo</h5>
                        <h6>
                          Hi, i am josephin. How are you.. ! There are many
                          variations of passages.
                        </h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>04/06/23</h6>
                        <h6 className="font-danger status"> Failed</h6>
                      </div>
                    </div>
                  </li>
                  <li data-to="blank">
                    <div className="chat-box">
                      <div className="profile busy">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jhon Deo</h5>
                        <h6>
                          Hi, i am josephin. How are you.. ! There are many
                          variations of passages.
                        </h6>
                      </div>
                      <div className="date-status">
                        <i className="ti-pin2" />
                        <h6>04/06/23</h6>
                        <h6 className="font-danger status"> Failed</h6>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade add-popup msg-chat-modal"
          id="msgcallModal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Create New Message</h2>
                <button
                  className="close"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="chat-msg-search">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon20"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon20">
                        @
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="call-log-main custom-scroll">
                  <li className="active">
                    <div className="call-box">
                      <div className="profile offline">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i data-feather="arrow-down-left" />
                          3:30 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-success button-effect btn-sm">
                          <i data-feather="phone" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="call-box">
                      <div className="profile online">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/1.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i data-feather="arrow-down-right" />
                          3:10 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-success button-effect btn-sm">
                          <i data-feather="video" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="call-box">
                      <div className="profile offline">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i
                            className="missed"
                            data-feather="corner-left-down"
                          />
                          3:00 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-danger button-effect btn-sm">
                          <i data-feather="phone" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="call-box">
                      <div className="profile online">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/1.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i data-feather="arrow-down-right" />
                          3:00 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-success button-effect btn-sm">
                          <i data-feather="video" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="call-box">
                      <div className="profile offline">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i data-feather="arrow-down-right" />
                          3:00 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-success button-effect btn-sm">
                          <i data-feather="phone" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="call-box">
                      <div className="profile online">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/1.jpg"
                          alt="Avatar"
                        />
                      </div>
                      <div className="details">
                        <h5>Jony Lynetin</h5>
                        <h6>
                          {" "}
                          <i data-feather="arrow-down-right" />
                          3:00 pm
                        </h6>
                      </div>
                      <div className="call-status">
                        <div className="icon-btn btn-outline-success button-effect btn-sm">
                          <i data-feather="video" />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
