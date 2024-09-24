import axios from "axios";
import { useState, useEffect, useRef } from "react";

// Format date function
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-CA');
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${formattedDate} ${formattedTime}`;
}

const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

function Chat({ datamessages, conversation }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const [messages, setMessages] = useState(datamessages);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        conversation_id: conversation.id,
        sender_id: 1, // Adjust if authenticated
        response: 0,
        content: message
      }).then((res) => {
        setMessages(res.data.data);
        setMessage('');
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
          conversation_id: conversation.id,
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
    // Format the conversation history for the API request
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      if (messageObject.message == null) {
        console.error("Message content is null or undefined:", messageObject);
        return null;
      }
      return { role, content: messageObject.message };
    }).filter(message => message !== null);

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a helpful assistant." },
        ...apiMessages,  // Include the whole conversation history
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

  return (
    <>
      <div className="chitchat-main small-sidebar" id="content">
        <div className="chat-content tabto active">
          <div className="messages custom-scroll active" id="chating">
            <div className="contact-details">
              <div className="row">
                <form className="form-inline search-form">
                  <div className="form-group">
                    <input
                      className="form-control-plaintext"
                      type="search"
                      placeholder="Search.."
                    />
                    <div className="icon-close close-search">
                      {" "}
                      <i data-feather="x"> </i>
                    </div>
                  </div>
                </form>
                <div className="col-7">
                  <div className="d-flex left">
                    <div className="media-left">
                      <div className="profile online menu-trigger">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-0">{conversation.name}</h5>
                      <div className="badge badge-success">Active</div>
                    </div>
                    <div className="media-right">
                      <ul>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mute"
                            href="#"
                          >
                            <i className="fa fa-volume-up" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light search-right"
                            href="#"
                          >
                            <i class="bi bi-search"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mobile-sidebar"
                            href="#"
                          >
                            <i data-feather="chevron-left" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col px-0">
                  <ul className="calls text-end">
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Audio Call"
                        data-bs-toggle="modal"
                        data-bs-target="#audiocall"
                      >
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Video Call"
                        data-bs-toggle="modal"
                        data-bs-target="#videocall"
                      >
                        <i data-feather="video" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect apps-toggle"
                        href="#"
                        data-tippy-content="All Apps"
                      >
                        <i className="ti-layout-grid2" />
                      </a>
                    </li>
                    <li className="chat-friend-toggle">
                      <a
                        className="icon-btn btn-light bg-transparent button-effect outside"
                        href="#"
                        data-tippy-content="Quick action"
                      >
                        <i data-feather="more-vertical" />
                      </a>
                      <div className="chat-frind-content">
                        <ul>
                          <li>
                            <a
                              className="icon-btn btn-outline-primary button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="user" />
                            </a>
                            <h5>Profile</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-success button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="plus-circle" />
                            </a>
                            <h5>Archive</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-danger button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="trash-2" />
                            </a>
                            <h5>Delete</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-light button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="slash" />
                            </a>
                            <h5>Block</h5>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="contact-chat">
              <ul className="chatappend">
                {messages.length > 0 && messages.map((message, index) => (
                  message.sender_id != 0 ? (
                    <li className="replies" key={index}>
                      <div className="d-flex">
                        <div className="profile">
                          <img className="bg-img" src="../assets/images/contact/2.jpg" alt="Avatar" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="contact-name">
                            <h5>Person</h5>
                            <h6>{formatDate(message.created_at)}</h6>
                            <ul className="msg-box">
                              <li className="msg-setting-main">
                              <h5 dangerouslySetInnerHTML={{ __html: message.content }}></h5>  
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li className="sent">
                      <div className="d-flex">
                        <div className="profile">
                          <img
                            className="bg-img"
                            src="../assets/images/avtar/1.jpg"
                            alt="Avatar"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="contact-name">
                            <h5>GPT</h5>
                            <h6>{formatDate(message.created_at)}</h6>
                            <ul className="msg-box">
                              <li className="msg-setting-main">
                                <div className="msg-dropdown-main">
                                  <div className="msg-setting">
                                    <i className="ti-more-alt" />
                                  </div>
                                  <div className="msg-dropdown">
                                    <ul>
                                      <li>
                                        <a href="#">
                                          <i className="fa fa-share" />
                                          forward
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <i className="fa fa-clone" />
                                          copy
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <i className="fa fa-star-o" />
                                          rating
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <i className="ti-trash" />
                                          delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <h5>
                                <h5 dangerouslySetInnerHTML={{ __html: message.content }}></h5>
                                </h5>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                ))}
                 <div ref={messagesEndRef} />
              </ul>
            </div>
          </div>
          <div className="messages custom-scroll" id="blank">
            <div className="contact-details">
              <div className="row">
                <div className="col">
                  <div className="d-flex left">
                    <div className="media-left me-3">
                      <div className="profile online menu-trigger">
                        <img
                          className="bg-img"
                          src="../assets/images/contact/2.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5>Josephin water</h5>
                      <h6>Last Seen 5 hours</h6>
                    </div>
                    <div className="media-right">
                      <ul>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mute"
                            href="#"
                          >
                            <i className="fa fa-volume-up" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light search search-right"
                            href="#"
                          >
                            {" "}
                            <i data-feather="search" />
                          </a>
                          <form className="form-inline search-form">
                            <div className="form-group">
                              <input
                                className="form-control-plaintext"
                                type="search"
                                placeholder="Search.."
                              />
                              <div className="icon-close close-search">
                                {" "}
                                <i data-feather="x" />
                              </div>
                            </div>
                          </form>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mobile-sidebar"
                            href="#"
                          >
                            <i data-feather="chevron-left" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <ul className="calls text-end">
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Audio Call"
                        data-bs-toggle="modal"
                        data-bs-target="#audiocall"
                      >
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Video Call"
                        data-bs-toggle="modal"
                        data-bs-target="#videocall"
                      >
                        <i data-feather="video" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect apps-toggle"
                        href="#"
                        data-tippy-content="All Apps"
                      >
                        <i className="ti-layout-grid2" />
                      </a>
                    </li>
                    <li className="chat-friend-toggle">
                      <a
                        className="icon-btn btn-light bg-transparent button-effect outside"
                        href="#"
                        data-tippy-content="Quick action"
                      >
                        <i data-feather="more-vertical" />
                      </a>
                      <div className="chat-frind-content">
                        <ul>
                          <li>
                            <a
                              className="icon-btn btn-outline-primary button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="user" />
                            </a>
                            <h5>profile</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-success button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="plus-circle" />
                            </a>
                            <h5>archive</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-danger button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="trash-2" />
                            </a>
                            <h5>delete</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-light button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="slash" />
                            </a>
                            <h5>block</h5>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="contact-chat">
              <div className="rightchat animat-rate">
                <div className="bg_circle">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
                <div className="cross" />
                <div className="cross1" />
                <div className="cross2" />
                <div className="dot" />
                <div className="dot1"> </div>
              </div>
            </div>
            <div className="call-list-center">
              <img src="../assets/images/chat.png" alt="" />
              <div className="animated-bg">
                <i />
                <i />
                <i />
              </div>
              <p>Select a chat to read messages</p>
            </div>
          </div>
          <div className="messages custom-scroll" id="group_chat">
            <div className="contact-details">
              <div className="row">
                <div className="col">
                  <div className="d-flex left">
                    <div className="media-left me-3">
                      <div className="profile online menu-trigger">
                        <img
                          className="bg-img"
                          src="../assets/images/avtar/teq.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5>Tech Ninjas</h5>
                      <div className="badge badge-success">Active</div>
                    </div>
                    <div className="media-right">
                      <ul>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mute"
                            href="#"
                          >
                            <i className="fa fa-volume-up" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light search search-right"
                            href="#"
                          >
                            {" "}
                            <i data-feather="search" />
                          </a>
                          <form className="form-inline search-form">
                            <div className="form-group">
                              <input
                                className="form-control-plaintext"
                                type="search"
                                placeholder="Search.."
                              />
                              <div className="icon-close close-search">
                                <i data-feather="x" />
                              </div>
                            </div>
                          </form>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mobile-sidebar"
                            href="#"
                          >
                            <i data-feather="chevron-left" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <ul className="calls text-end">
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Start Audio Conference"
                        data-bs-toggle="modal"
                        data-bs-target="#confercall"
                      >
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Start Video Conference"
                        data-bs-toggle="modal"
                        data-bs-target="#confvideocl"
                      >
                        <i data-feather="video" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect apps-toggle"
                        href="#"
                        data-tippy-content="All Apps"
                      >
                        <i className="ti-layout-grid2" />
                      </a>
                    </li>
                    <li className="chat-friend-toggle">
                      <a
                        className="icon-btn btn-light bg-transparent button-effect outside"
                        href="#"
                        data-tippy-content="Quick action"
                      />
                      <div className="chat-frind-content">
                        <ul>
                          <li>
                            <a
                              className="icon-btn btn-outline-primary button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="user" />
                            </a>
                            <h5>profile</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-success button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="plus-circle" />
                            </a>
                            <h5>archive</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-danger button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="trash-2" />
                            </a>
                            <h5>delete</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-light button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="slash" />
                            </a>
                            <h5>block</h5>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="contact-chat">
              <ul className="chatappend">
                <li className="groupuser">
                  <h4>Jewellery project</h4>
                  <div className="gr-chat-friend-toggle">
                    <a
                      className="icon-btn btn-sm pull-right add-grbtn outside"
                      href="#"
                      data-tippy-content="Add User"
                    >
                      <i class="bi bi-plus-lg"></i>
                    </a>
                    <div className="gr-chat-frind-content">
                      <ul className="chat-main">
                        <li>
                          <div className="chat-box">
                            <div className="d-flex">
                              <div className="profile offline">
                                <img
                                  className="bg-img"
                                  src="../assets/images/contact/1.jpg"
                                  alt="Avatar"
                                />
                              </div>
                              <div className="details">
                                <h5>Josephin water</h5>
                                <h6>Alabma , USA</h6>
                              </div>
                              <div className="flex-grow-1">
                                <a
                                  className="icon-btn btn-outline-primary btn-sm"
                                  href="#"
                                  data-tippy-content="Add User"
                                >
                                  <i className="fa fa-plus" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="chat-box">
                            <div className="d-flex">
                              <div className="profile">
                                <img
                                  className="bg-img"
                                  src="../assets/images/contact/2.jpg"
                                  alt="Avatar"
                                />
                              </div>
                              <div className="details">
                                <h5>Josephin water</h5>
                                <h6>Alabma , USA</h6>
                              </div>
                              <div className="flex-grow-1">
                                <a
                                  className="icon-btn btn-outline-primary btn-sm"
                                  href="#"
                                  data-tippy-content="Add User"
                                >
                                  <i className="fa fa-plus" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="chat-box">
                            <div className="d-flex">
                              <div className="profile">
                                <img
                                  className="bg-img"
                                  src="../assets/images/contact/3.jpg"
                                  alt="Avatar"
                                />
                              </div>
                              <div className="details">
                                <h5>Josephin water</h5>
                                <h6>Alabma , USA</h6>
                              </div>
                              <div className="flex-grow-1">
                                <a
                                  className="icon-btn btn-outline-primary btn-sm"
                                  href="#"
                                  data-tippy-content="Add User"
                                >
                                  <i className="fa fa-plus" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="chat-box">
                            <div className="d-flex">
                              <div className="profile unreachable">
                                <img
                                  className="bg-img"
                                  src="../assets/images/contact/4.jpg"
                                  alt="Avatar"
                                />
                              </div>
                              <div className="details">
                                <h5>Josephin water</h5>
                                <h6>Alabma , USA</h6>
                              </div>
                              <div className="flex-grow-1">
                                <a
                                  className="icon-btn btn-outline-primary btn-sm"
                                  href="#"
                                  data-tippy-content="Add User"
                                >
                                  <i className="fa fa-plus" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="gr-profile dot-btn dot-success grow">
                    <img
                      className="bg-img"
                      src="../assets/images/avtar/3.jpg"
                      alt="Avatar"
                    />
                  </div>
                  <div className="gr-profile dot-btn dot-success grow">
                    <img
                      className="bg-img"
                      src="../assets/images/avtar/5.jpg"
                      alt="Avatar"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="messages custom-scroll" id="group_blank">
            <div className="contact-details">
              <div className="row">
                <div className="col">
                  <div className="d-flex left">
                    <div className="media-left me-3">
                      <div className="profile online menu-trigger">
                        <img
                          className="bg-img"
                          src="../assets/images/avtar/family.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5>Family Ties</h5>
                      <h6>Last Seen 2 hours</h6>
                    </div>
                    <div className="media-right">
                      <ul>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mute"
                            href="#"
                          >
                            <i className="fa fa-volume-up" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light search search-right"
                            href="#"
                          >
                            {" "}
                            <i data-feather="search" />
                          </a>
                          <form className="form-inline search-form">
                            <div className="form-group">
                              <input
                                className="form-control-plaintext"
                                type="search"
                                placeholder="Search.."
                              />
                              <div className="icon-close close-search">
                                {" "}
                                <i data-feather="x" />
                              </div>
                            </div>
                          </form>
                        </li>
                        <li>
                          <a
                            className="icon-btn btn-light button-effect mobile-sidebar"
                            href="#"
                          >
                            <i data-feather="chevron-left" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <ul className="calls text-end">
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Audio Call"
                        data-bs-toggle="modal"
                        data-bs-target="#confercall"
                      >
                        <i data-feather="phone" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect"
                        href="#"
                        data-tippy-content="Quick Video Call"
                        data-bs-toggle="modal"
                        data-bs-target="#confvideocl"
                      >
                        <i data-feather="video" />
                      </a>
                    </li>
                    <li>
                      <a
                        className="icon-btn btn-light button-effect apps-toggle"
                        href="#"
                        data-tippy-content="All Apps"
                      >
                        <i className="ti-layout-grid2" />
                      </a>
                    </li>
                    <li className="chat-friend-toggle">
                      <a
                        className="icon-btn btn-light bg-transparent button-effect outside"
                        href="#"
                        data-tippy-content="Quick action"
                      >
                        <i data-feather="more-vertical" />
                      </a>
                      <div className="chat-frind-content">
                        <ul>
                          <li>
                            <a
                              className="icon-btn btn-outline-primary button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="user" />
                            </a>
                            <h5>profile</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-success button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="plus-circle" />
                            </a>
                            <h5>archive</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-danger button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="trash-2" />
                            </a>
                            <h5>delete</h5>
                          </li>
                          <li>
                            <a
                              className="icon-btn btn-outline-light button-effect btn-sm"
                              href="#"
                            >
                              <i data-feather="slash" />
                            </a>
                            <h5>block</h5>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="contact-chat">
              <div className="rightchat animat-rate">
                <div className="bg_circle">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
                <div className="cross" />
                <div className="cross1" />
                <div className="cross2" />
                <div className="dot" />
                <div className="dot1"> </div>
              </div>
            </div>
            <div className="call-list-center">
              <img src="../assets/images/chat.png" alt="" />
              <div className="animated-bg">
                <i />
                <i />
                <i />
              </div>
              <p>Select a chat to read messages</p>
            </div>
          </div>
          <div className="message-input">
            <div className="wrap emojis-main">
              <a
                className="icon-btn btn-outline-primary button-effect toggle-sticker outside"
                href="#"
              >
                <svg
                  id="Layer_1"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="2158px"
                  height="2148px"
                  viewBox="0 0 2158 2148"
                  enableBackground="new 0 0 2158 2148"
                  xmlSpace="preserve"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="none"
                    stroke="#000000"
                    strokeWidth={60}
                    strokeMiterlimit={10}
                    d="M699,693                        c0,175.649,0,351.351,0,527c36.996,0,74.004,0,111,0c18.058,0,40.812-2.485,57,1c11.332,0.333,22.668,0.667,34,1                        c7.664,2.148,20.769,14.091,25,20c8.857,12.368,6,41.794,6,62c0,49.329,0,98.672,0,148c175.649,0,351.351,0,527,0                        c0-252.975,0-506.025,0-759C1205.692,693,952.308,693,699,693z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M886,799c59.172-0.765,93.431,25.289,111,66c6.416,14.867,14.612,39.858,9,63                        c-2.391,9.857-5.076,20.138-9,29c-15.794,35.671-47.129,53.674-90,63c-20.979,4.563-42.463-4.543-55-10                        c-42.773-18.617-85.652-77.246-59-141c10.637-25.445,31.024-49,56-60c7.999-2.667,16.001-5.333,24-8                        C877.255,799.833,882.716,801.036,886,799z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1258,799c59.172-0.765,93.431,25.289,111,66c6.416,14.867,14.612,39.858,9,63                        c-2.391,9.857-5.076,20.138-9,29c-15.794,35.671-47.129,53.674-90,63c-20.979,4.563-42.463-4.543-55-10                        c-42.773-18.617-85.652-77.246-59-141c10.637-25.445,31.024-49,56-60c7.999-2.667,16.001-5.333,24-8                        C1249.255,799.833,1254.716,801.036,1258,799z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1345,1184c-0.723,18.71-11.658,29.82-20,41c-18.271,24.489-50.129,37.183-83,47                        c-7.333,1-14.667,2-22,3c-12.013,2.798-33.636,5.15-44,3c-11.332-0.333-22.668-0.667-34-1c-15.332-3-30.668-6-46-9                        c-44.066-14.426-80.944-31.937-110-61c-22.348-22.353-38.992-45.628-37-90c0.667,0,1.333,0,2,0c9.163,5.585,24.723,3.168,36,6                        c26.211,6.583,54.736,7.174,82,14c34.068,8.53,71.961,10.531,106,19c9.999,1.333,20.001,2.667,30,4c26.193,6.703,54.673,7.211,82,14                        C1304.894,1178.445,1325.573,1182.959,1345,1184z"
                  />
                  <polygon
                    fillRule="evenodd"
                    clipRule="evenodd"
                    points="668.333,1248.667 901.667,1482 941.667,1432 922.498,1237.846                         687,1210.667 "
                  />
                </svg>
              </a>
              <div className="dot-btn dot-primary">
                <a
                  className="icon-btn btn-outline-primary button-effect toggle-emoji"
                  href="#"
                >
                  <i class="bi bi-emoji-laughing"></i>
                </a>
              </div>
              <div className="contact-poll">
                <a
                  className="icon-btn btn-outline-primary outside"
                  href="#"
                >
                  <i className="fa fa-plus" />
                </a>
                <div className="contact-poll-content">
                  <ul>
                    <li>
                      <a href="#">
                        <i data-feather="image" />
                        gallery
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i data-feather="camera" />
                        camera
                      </a>
                    </li>
                    <li>
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#snippetModal"
                      >
                        <i data-feather="code"> </i>Code Snippest
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i data-feather="user"> </i>contact
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i data-feather="map-pin"> </i>location
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i data-feather="clipboard"> </i>document
                      </a>
                    </li>
                    <li>
                      <a data-bs-toggle="modal" data-bs-target="#pollModal">
                        <i data-feather="bar-chart-2"> </i>poll
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i data-feather="paperclip"> </i>attach
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <input
                className="setemoj"
                id="setemoj"
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendRequest(message);
                  
                  }
                }}
                placeholder="Write your message..."
              />
              <a
                className="icon-btn btn-outline-primary button-effect me-2 ms-2"
                href="#"
              >
                <i class="bi bi-mic"></i>
              </a>
              <button
                className="submit icon-btn btn-primary disabled"
                id="send-msg"
                disabled="disabled"
              >
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat