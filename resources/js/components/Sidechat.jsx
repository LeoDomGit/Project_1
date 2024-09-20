import React, { useState } from 'react'

function Sidechat({ conversations, toggleSidebar, sidebar }) {
    const [filterConversation, setFilterConversation] = useState(conversations);
    return (
        <>
            <aside className="chitchat-left-sidebar left-disp">
                <div className="recent-default dynemic-sidebar active">
                    <div className="recent">
                        <div className="theme-title">
                            <div className="d-flex">
                                <div>
                                    <h2>Recent</h2>
                                    <h4>Chat from your friends 😘</h4>
                                </div>
                                <div className="flex-grow-1">
                                    <a
                                        className="icon-btn btn-outline-light button-effect pull-right mobile-back"
                                        href="#"
                                    >
                                        <i className="ti-angle-right" />
                                    </a>
                                    <a
                                        className="icon-btn btn-outline-light button-effect pull-right mainnav"
                                        href="#"

                                    >
                                        <i onClick={toggleSidebar} className="ti-layout-grid2" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="recent-slider recent-chat owl-carousel owl-theme">
                            <div className="item">
                                <div className="recent-box">
                                    <div className="dot-btn dot-danger grow" />
                                    <div className="recent-profile">
                                        <img
                                            className="bg-img"
                                            src="../assets/images/avtar/1.jpg"
                                            alt="Avatar"
                                        />
                                        <h6> John deo</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="recent-box">
                                    <div className="dot-btn dot-success grow" />
                                    <div className="recent-profile online">
                                        <img
                                            className="bg-img"
                                            src="../assets/images/avtar/big/audiocall.jpg"
                                            alt="Avatar"
                                        />
                                        <h6> John </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="recent-box">
                                    <div className="dot-btn dot-warning grow" />
                                    <div className="recent-profile">
                                        <img
                                            className="bg-img"
                                            src="../assets/images/avtar/2.jpg"
                                            alt="Avatar"
                                        />
                                        <h6> Jpny</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat custom-scroll">
                        <ul className="chat-cont-setting">
                            <li>
                                {" "}
                                <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#msgchatModal"
                                >
                                    <span>new chat</span>
                                    <div className="icon-btn btn-outline-primary button-effect btn-sm">
                                        <i data-feather="message-square" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#msgcallModal"
                                >
                                    <span>new call</span>
                                    <div className="icon-btn btn-outline-success button-effect btn-sm">
                                        <i data-feather="phone" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalCenter"
                                >
                                    <span>new Contact</span>
                                    <div className="icon-btn btn-outline-danger button-effect btn-sm">
                                        <i data-feather="users" />
                                    </div>
                                </a>
                            </li>
                        </ul>
                        <div className="theme-title">
                            <div className="d-flex">
                                <div>
                                    <h2>Chat</h2>
                                    <h4>Start New Conversation</h4>
                                </div>
                                <div className="flex-grow-1">
                                    <a
                                        className="icon-btn btn-outline-light btn-sm search contact-search"
                                        href="#"
                                    >
                                        {" "}
                                        <i class="bi bi-search"></i>
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
                                                <i data-feather="x"> </i>
                                            </div>
                                        </div>
                                    </form>
                                    <a
                                        className="icon-btn btn-primary btn-fix chat-cont-toggle outside"
                                        href="#"
                                    >
                                        <i data-feather="plus" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="theme-tab tab-sm chat-tabs">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" data-to="chat-content">
                                    <a
                                        className="nav-link button-effect active"
                                        id="chat-tab"
                                        data-bs-toggle="tab"
                                        href="#chat"
                                        role="tab"
                                        aria-controls="chat"
                                        aria-selected="true"
                                        data-intro="Start chat"
                                    >
                                        <i data-feather="message-square"> </i>Chat
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="chat"
                                    role="tabpanel"
                                    aria-labelledby="chat-tab"
                                >
                                    <div className="theme-tab">
                                        <ul className="nav nav-tabs" id="myTab1" role="tablist">
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link button-effect active"
                                                    id="direct-tab"
                                                    data-bs-toggle="tab"
                                                    href="#direct"
                                                    role="tab"
                                                    aria-controls="direct"
                                                    aria-selected="false"
                                                    data-to="chating"
                                                >
                                                    Direct
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link button-effect"
                                                    id="group-tab"
                                                    data-bs-toggle="tab"
                                                    href="#group"
                                                    role="tab"
                                                    aria-controls="group"
                                                    aria-selected="true"
                                                    data-to="group_chat"
                                                >
                                                    Group
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabContent1">

                                            <div
                                                className="tab-pane fade show active"
                                                id="direct"
                                                role="tabpanel"
                                                aria-labelledby="direct-tab"
                                            >
                                                <ul className="chat-main">
                                                    {filterConversation.length > 0 && filterConversation.map((conversation) => (

                                                        <li className="active">
                                                            <div className="chat-box">
                                                                <div className="profile offline">
                                                                    <img
                                                                        className="bg-img"
                                                                        src="../assets/images/contact/1.jpg"
                                                                        alt="Avatar"
                                                                    />
                                                                </div>
                                                                <div className="details">
                                                                    <h5>{conversation.name}</h5>
                                                                </div>
                                                                <div className="date-status">
                                                                    <i className="ti-pin2" />
                                                                    <h6 className="font-success status"> Seen</h6>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="group"
                                                role="tabpanel"
                                                aria-labelledby="group-tab"
                                            >
                                                <div className="search2">
                                                    <div>
                                                        <div className="input-group">
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">
                                                                    <i className="fa fa-search" />
                                                                </span>
                                                            </div>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Start Chat"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul className="group-main">
                                                    <li className="active" data-to="group_chat">
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
                                                                <h6>
                                                                    Lorem Ipsum is simply dummy text the
                                                                    printing and typesetting industry.
                                                                </h6>
                                                            </div>
                                                            <div className="date-status">
                                                                <ul className="grop-icon">
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Josephin"
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/1.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Jony "
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/2.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Pabelo"
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/3.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>+ 35</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li data-to="group_blank">
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
                                                                <h6>
                                                                    Lorem Ipsum is simply dummy text the
                                                                    printing and typesetting industry.
                                                                </h6>
                                                            </div>
                                                            <div className="date-status">
                                                                <ul className="grop-icon">
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Josephin"
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/1.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Jony "
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/2.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="group-tp"
                                                                            href="#"
                                                                            data-tippy-content="Pabelo"
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                src="../assets/images/contact/3.jpg"
                                                                                alt="group-icon-img"
                                                                            />
                                                                        </a>
                                                                    </li>
                                                                    <li>+ 12</li>
                                                                </ul>
                                                                <div className="badge badge-primary" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li data-to="group_blank">
                                                        <div className="group-box">
                                                            <div className="profile bg-danger">
                                                                <span>HT</span>
                                                            </div>
                                                            <div className="details">
                                                                <h5>Hungry for Trouble</h5>
                                                                <h6>
                                                                    Lorem Ipsum is simply dummy text the
                                                                    printing and typesetting industry.
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li data-to="group_blank">
                                                        <div className="group-box">
                                                            <div className="profile">
                                                                <img
                                                                    className="bg-img"
                                                                    src="../assets/images/avtar/girls.jpg"
                                                                    alt="Avatar"
                                                                />
                                                            </div>
                                                            <div className="details">
                                                                <h5>Staunch Ladies</h5>
                                                                <h6>
                                                                    Lorem Ipsum is simply dummy text the
                                                                    printing and typesetting industry.
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li data-to="group_blank">
                                                        <div className="group-box">
                                                            <div className="profile bg-success">
                                                                <span>CE</span>
                                                            </div>
                                                            <div className="details">
                                                                <h5>Crazy Engineers</h5>
                                                                <h6>
                                                                    Lorem Ipsum is simply dummy text the
                                                                    printing and typesetting industry.
                                                                </h6>
                                                            </div>
                                                            <div className="date-status" />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="call"
                                    role="tabpanel"
                                    aria-labelledby="call-tab"
                                >
                                    <div className="theme-tab tab-icon">
                                        <ul
                                            className="nav nav-tabs"
                                            id="contactTab"
                                            role="tablist"
                                        >
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link active"
                                                    id="con1-tab"
                                                    data-bs-toggle="tab"
                                                    href="#con1"
                                                    role="tab"
                                                    aria-controls="con1"
                                                    aria-selected="true"
                                                >
                                                    All
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    id="con3-tab"
                                                    data-bs-toggle="tab"
                                                    href="#con3"
                                                    role="tab"
                                                    aria-controls="con3"
                                                    aria-selected="false"
                                                >
                                                    {" "}
                                                    <i data-feather="phone-incoming" />
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    id="con4-tab"
                                                    data-bs-toggle="tab"
                                                    href="#con4"
                                                    role="tab"
                                                    aria-controls="con4"
                                                    aria-selected="false"
                                                >
                                                    {" "}
                                                    <i data-feather="phone-outgoing" />
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    id="con2-tab"
                                                    data-bs-toggle="tab"
                                                    href="#con2"
                                                    role="tab"
                                                    aria-controls="con2"
                                                    aria-selected="false"
                                                >
                                                    {" "}
                                                    <i data-feather="phone-missed" />
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="contactTabContent">
                                            <div
                                                className="tab-pane fade show active"
                                                id="con1"
                                                role="tabpanel"
                                                aria-labelledby="con1-tab"
                                            >
                                                <ul className="call-log-main">
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
                                            <div
                                                className="tab-pane fade"
                                                id="con2"
                                                role="tabpanel"
                                                aria-labelledby="con2-tab"
                                            >
                                                <ul className="call-log-main">
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
                                                                    <i
                                                                        className="missed"
                                                                        data-feather="corner-left-down"
                                                                    />
                                                                    3:30 pm
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
                                                                    <i
                                                                        className="missed"
                                                                        data-feather="corner-left-down"
                                                                    />
                                                                    3:10 pm
                                                                </h6>
                                                            </div>
                                                            <div className="call-status">
                                                                <div className="icon-btn btn-outline-danger button-effect btn-sm">
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
                                                                    <i
                                                                        className="missed"
                                                                        data-feather="corner-left-down"
                                                                    />
                                                                    3:00 pm
                                                                </h6>
                                                            </div>
                                                            <div className="call-status">
                                                                <div className="icon-btn btn-outline-danger button-effect btn-sm">
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
                                                                    <i
                                                                        className="missed"
                                                                        data-feather="corner-left-down"
                                                                    />
                                                                    3:00 pm
                                                                </h6>
                                                            </div>
                                                            <div className="call-status">
                                                                <div className="icon-btn btn-outline-danger button-effect btn-sm">
                                                                    <i data-feather="video" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="con3"
                                                role="tabpanel"
                                                aria-labelledby="con3-tab"
                                            >
                                                <ul className="call-log-main">
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
                                            <div
                                                className="tab-pane fade"
                                                id="con4"
                                                role="tabpanel"
                                                aria-labelledby="con4-tab"
                                            >
                                                <ul className="call-log-main">
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
                                                                    <i data-feather="arrow-up-right" />
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
                                                                    <i data-feather="arrow-up-right" />
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
                                                                    <i data-feather="arrow-up-right" />
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
                                                                    <i data-feather="arrow-up-right" />
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
                                                                    <i data-feather="arrow-up-right" />
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
                                <div
                                    className="tab-pane fade"
                                    id="contact"
                                    role="tabpanel"
                                    aria-labelledby="contact-tab"
                                >
                                    <ul className="contact-log-main">
                                        <li>
                                            <div className="contact-box">
                                                <div className="profile offline">
                                                    <img
                                                        className="bg-img"
                                                        src="../assets/images/contact/2.jpg"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="details">
                                                    <h5>Jony Lynetin</h5>
                                                    <h6>+21 3523 25544 </h6>
                                                </div>
                                                <div className="contact-action">
                                                    <div className="icon-btn btn-outline-primary btn-sm button-effect">
                                                        <i data-feather="phone" />
                                                    </div>
                                                    <div className="icon-btn btn-outline-success btn-sm button-effect">
                                                        <i data-feather="video" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="active">
                                            <div className="contact-box">
                                                <div className="profile online">
                                                    <img
                                                        className="bg-img"
                                                        src="../assets/images/contact/1.jpg"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="details">
                                                    <h5>Jony Lynetin</h5>
                                                    <h6>+54 541447 255 </h6>
                                                </div>
                                                <div className="contact-action">
                                                    <div className="icon-btn btn-outline-primary btn-sm button-effect">
                                                        <i data-feather="phone" />
                                                    </div>
                                                    <div className="icon-btn btn-outline-success btn-sm button-effect">
                                                        <i data-feather="video" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-box">
                                                <div className="profile busy">
                                                    <img
                                                        className="bg-img"
                                                        src="../assets/images/contact/3.jpg"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="details">
                                                    <h5>Jony Lynetin</h5>
                                                    <h6>+58 2564 02554</h6>
                                                </div>
                                                <div className="contact-action">
                                                    <div className="icon-btn btn-outline-primary btn-sm button-effect">
                                                        <i data-feather="phone" />
                                                    </div>
                                                    <div className="icon-btn btn-outline-success btn-sm button-effect">
                                                        <i data-feather="video" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-box">
                                                <div className="profile unreachable">
                                                    <img
                                                        className="bg-img"
                                                        src="../assets/images/contact/4.jpg"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="details">
                                                    <h5>Jony Lynetin</h5>
                                                    <h6>+44 55124 2524</h6>
                                                </div>
                                                <div className="contact-action">
                                                    <div className="icon-btn btn-outline-primary btn-sm button-effect">
                                                        <i data-feather="phone" />
                                                    </div>
                                                    <div className="icon-btn btn-outline-success btn-sm button-effect">
                                                        <i data-feather="video" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-box">
                                                <div className="profile online">
                                                    <img
                                                        className="bg-img"
                                                        src="../assets/images/contact/4.jpg"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="details">
                                                    <h5>Jony Lynetin</h5>
                                                    <h6>+54 541447 255 </h6>
                                                </div>
                                                <div className="contact-action">
                                                    <div className="icon-btn btn-outline-primary btn-sm button-effect">
                                                        <i data-feather="phone" />
                                                    </div>
                                                    <div className="icon-btn btn-outline-success btn-sm button-effect">
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
                <div
                    className="fevorite-tab custom-scrollbar dynemic-sidebar"
                    id="favourite"
                >
                    <div className="theme-title">
                        <div className="d-flex">
                            <div>
                                <h2>Favourite</h2>
                                <h4>Last Recent</h4>
                            </div>
                            <div className="flex-grow-1">
                                <a
                                    className="icon-btn btn-outline-light btn-sm m-r-15 search"
                                    href="#"
                                >
                                    {" "}
                                    <i class="bi bi-search"></i>
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
                                <a
                                    className="icon-btn btn-outline-light btn-sm m-r-15"
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addcallmodal"
                                >
                                    <i data-feather="plus"> </i>
                                </a>
                                <a
                                    className="icon-btn btn-outline-light btn-sm close-panel"
                                    href="#"
                                >
                                    <i data-feather="x" />
                                </a>
                            </div>
                        </div>
                    </div>
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
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="d-flex">
                                    <div className="profile online">
                                        <img
                                            className="bg-img"
                                            src="../assets/images/contact/2.jpg"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="details">
                                        <h5>Jony Lynetin</h5>
                                        <h6>Los Angeles, California</h6>
                                    </div>
                                    <div className="flex-grow-1">
                                        <a
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="d-flex">
                                    <div className="profile busy">
                                        <img
                                            className="bg-img"
                                            src="../assets/images/contact/3.jpg"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="details">
                                        <h5>Sufiya Elija</h5>
                                        <h6>Glasgow , Scotland</h6>
                                    </div>
                                    <div className="flex-grow-1">
                                        <a
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
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
                                        <h5>Pabelo Mukrani</h5>
                                        <h6>Leicester , England</h6>
                                    </div>
                                    <div className="flex-grow-1">
                                        <a
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
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
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="d-flex">
                                    <div className="profile online">
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
                                            className="icon-btn btn-outline-primary btn-sm pull-right favourite"
                                            href="#"
                                        >
                                            {" "}
                                            <i data-feather="star"> </i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="document-tab dynemic-sidebar" id="document">
                    <div className="theme-title">
                        <div className="d-flex">
                            <div>
                                <h2>Document</h2>
                                <h4>List of document</h4>
                            </div>
                            <div className="flex-grow-1">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm m-r-15 search"
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
                                            <i data-feather="x"> </i>
                                        </div>
                                    </div>
                                </form>
                                <a
                                    className="icon-btn btn-outline-light btn-sm close-panel"
                                    href="#"
                                >
                                    <i data-feather="x" />
                                </a>
                            </div>
                        </div>
                    </div>
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
                                            {" "}
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
                                            {" "}
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
                                            {" "}
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
                                            {" "}
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
                <div
                    className="contact-list-tab dynemic-sidebar custom-scroll"
                    id="contact-list"
                >
                    <div className="theme-title">
                        <div className="d-flex">
                            <div>
                                <h2>Contact</h2>
                                <h4>Start talking now</h4>
                            </div>
                            <div className="flex-grow-1">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm m-r-15 search"
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
                                            <i data-feather="x"> </i>
                                        </div>
                                    </div>
                                </form>
                                <a
                                    className="icon-btn btn-outline-light btn-sm close-panel"
                                    href="#"
                                >
                                    <i data-feather="x" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <ul className="chat-main">
                        <li className="active">
                            <div className="chat-box">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/1.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <h5>Josephin water</h5>
                                    <h6>
                                        Hi, i am josephin. How are you.. ! There are many
                                        variations of passages.
                                    </h6>
                                </div>
                                <div className="date-status">
                                    <h6>22/10/23</h6>
                                    <h6 className="font-success status"> Seen</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>15/06/23</h6>
                                    <h6 className="font-dark status"> Sending</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="profile busy">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/4.jpg"
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
                                    <h6>04/06/23</h6>
                                    <h6 className="font-danger status"> Failed</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/1.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <h5>Josephin water</h5>
                                    <h6>
                                        Hi, i am josephin. How are you.. ! There are many
                                        variations of passages.
                                    </h6>
                                </div>
                                <div className="date-status">
                                    <h6>22/10/23</h6>
                                    <h6 className="font-success status"> Seen</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>15/06/23</h6>
                                    <h6 className="font-dark status"> Sending</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/1.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <h5>Josephin water</h5>
                                    <h6>
                                        Hi, i am josephin. How are you.. ! There are many
                                        variations of passages.
                                    </h6>
                                </div>
                                <div className="date-status">
                                    <h6>22/10/23</h6>
                                    <h6 className="font-success status"> Seen</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>15/06/23</h6>
                                    <h6 className="font-dark status"> Sending</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="profile busy">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/4.jpg"
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
                                    <h6>04/06/23</h6>
                                    <h6 className="font-danger status"> Failed</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/1.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <h5>Josephin water</h5>
                                    <h6>
                                        Hi, i am josephin. How are you.. ! There are many
                                        variations of passages.
                                    </h6>
                                </div>
                                <div className="date-status">
                                    <h6>22/10/23</h6>
                                    <h6 className="font-success status"> Seen</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>15/06/23</h6>
                                    <h6 className="font-dark status"> Sending</h6>
                                </div>
                            </div>
                        </li>
                        <li>
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
                                    <h6>Hello</h6>
                                </div>
                                <div className="date-status">
                                    <h6>30/11/23</h6>
                                    <div className="badge badge-primary sm">8</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    className="notification-tab dynemic-sidebar custom-scroll"
                    id="notification"
                >
                    <div className="theme-title">
                        <div className="d-flex">
                            <div>
                                <h2>Notification</h2>
                                <h4>List of notification</h4>
                            </div>
                            <div className="flex-grow-1">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm close-panel"
                                    href="#"
                                >
                                    <i data-feather="x" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <ul className="chat-main">
                        <li>
                            <div className="chat-box notification">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/1.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <span>Josephin water</span>
                                    <h5>Upload New Photos</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing.</p>
                                </div>
                                <div className="date-status">
                                    <h6>Now</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box notification">
                                <div className="profile bg-success offline">
                                    <span>J</span>
                                </div>
                                <div className="details">
                                    <span>Jony Today Birthday</span>
                                    <h5>Upload New Photos</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing.</p>
                                </div>
                                <div className="date-status">
                                    <h6>1 hour ago</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box notification">
                                <div className="profile offline">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/2.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <span>Sufiya Elija</span>
                                    <h5>Comment On your Photo</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing.</p>
                                </div>
                                <div className="date-status">
                                    <h6>5 hour ago</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box notification">
                                <div className="profile unreachable">
                                    <img
                                        className="bg-img"
                                        src="../assets/images/contact/3.jpg"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="details">
                                    <span>Pabelo Mukrani</span>
                                    <h5>Invite Your New Friend</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing.</p>
                                </div>
                                <div className="date-status">
                                    <h6>6 hour ago</h6>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="chat-box notification">
                                <div className="profile bg-success offline">
                                    <span>PM</span>
                                </div>
                                <div className="details">
                                    <span>Pabelo Mukrani</span>
                                    <h5>Update Profile Picture</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing.</p>
                                </div>
                                <div className="date-status">
                                    <h6>6 hour ago</h6>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    className="settings-tab dynemic-sidebar custom-scroll"
                    id="settings"
                >
                    <div className="theme-title">
                        <div className="d-flex">
                            <div>
                                <h2>Settings</h2>
                                <h4>Change your app setting.</h4>
                            </div>
                            <div className="flex-grow-1">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm close-panel"
                                    href="#"
                                >
                                    <i data-feather="x" />
                                </a>
                            </div>
                        </div>
                        <div className="profile-box">
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
                                <div className="details edit">
                                    <form className="form-radious form-sm">
                                        <div className="form-group mb-2">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="username"
                                                defaultValue="Josephin water"
                                            />
                                        </div>
                                        <div className="form-group mb-0">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="address"
                                                defaultValue="Alabma , USA"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="flex-grow-1">
                                    <a
                                        className="icon-btn btn-outline-light btn-sm pull-right edit-btn"
                                        href="#"
                                    >
                                        {" "}
                                        <i data-feather="edit"> </i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-block">
                        <div className="block">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3>Account</h3>
                                </div>
                                <div className="media-right">
                                    <a
                                        className="icon-btn btn-outline-light btn-sm pull-right previous"
                                        href="#"
                                    >
                                        {" "}
                                        <i data-feather="chevron-left"> </i>
                                    </a>
                                </div>
                            </div>
                            <div className="theme-according" id="accordion">
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingTwo"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo"
                                        aria-expanded="true"
                                        aria-controls="collapseTwo"
                                    >
                                        <a>
                                            Security
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse show"
                                        id="collapseTwo"
                                        aria-labelledby="headingTwo"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <div className="flex-grow-1">
                                                    <h5>Show Security notification</h5>
                                                </div>
                                                <div className="media-right">
                                                    <input className="js-switch8" type="checkbox" />
                                                </div>
                                            </div>
                                            <p>
                                                {" "}
                                                <b>Note : </b>turn on this setting to recive
                                                notification when a contact's security code has been
                                                changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingOne"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                        aria-expanded="false"
                                        aria-controls="collapseOne"
                                    >
                                        <a>
                                            Privacy
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="collapseOne"
                                        aria-labelledby="headingOne"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <ul className="privacy">
                                                <li>
                                                    <h5>Last seen</h5>
                                                    <input
                                                        className="js-switch10"
                                                        type="checkbox"
                                                        defaultChecked=""
                                                    />
                                                    <p>
                                                        {" "}
                                                        <b>Note : </b>turn on this setting to whether
                                                        your contact can see last seen or not.
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Profile Photo</h5>
                                                    <input className="js-switch11" type="checkbox" />
                                                    <p>
                                                        turn on this setting to whether your contact can
                                                        see your profile or not.
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>About</h5>
                                                    <input className="js-switch12" type="checkbox" />
                                                    <p>
                                                        {" "}
                                                        <b>Note : </b>turn on this setting to whether
                                                        your contact can see about status or not.
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Status</h5>
                                                    <input className="js-switch14" type="checkbox" />
                                                    <p>
                                                        {" "}
                                                        <b>Note : </b>turn on this setting to whether
                                                        your contact can see your status or not.{" "}
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Read receipts</h5>
                                                    <input className="js-switch16" type="checkbox" />
                                                    <p>
                                                        {" "}
                                                        <b>Note : </b>If turn off this option you won't
                                                        be able to see read recipts from contact. read
                                                        receipts are always sent for group chats.{" "}
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Groups</h5>
                                                    <input
                                                        className="js-switch13"
                                                        type="checkbox"
                                                        defaultChecked=""
                                                    />
                                                    <p>
                                                        {" "}
                                                        <b>Note : </b>turn on this setting to whether
                                                        your contact can add in groups or not.
                                                    </p>
                                                </li>
                                                <li>
                                                    <h5>Screen Lock(Require Touch ID)</h5>
                                                    <input className="js-switch17" type="checkbox" />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingThree"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree"
                                        aria-expanded="false"
                                        aria-controls="collapseThree"
                                    >
                                        <a>
                                            Two Step verification
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="collapseThree"
                                        aria-labelledby="headingThree"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <div className="flex-grow-1">
                                                    <h5>Enable</h5>
                                                </div>
                                                <div className="media-right">
                                                    <input className="js-switch9" type="checkbox" />
                                                </div>
                                            </div>
                                            <p>
                                                {" "}
                                                <b>Note : </b>For added security, enable two-step
                                                verifiation, which will require a PIN when
                                                registering your phone number with Chitchat again.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingFour"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseFour"
                                        aria-expanded="false"
                                        aria-controls="collapseFour"
                                    >
                                        <a>
                                            Change Number
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="collapseFour"
                                        aria-labelledby="headingFour"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body change-number">
                                            <h5>Your old country code &amp; phone number</h5>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control m-0">
                                                        +
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control country-code"
                                                    type="number"
                                                    placeholder={"01"}
                                                />
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder={1234567895}
                                                />
                                            </div>
                                            <h5>Your new country code &amp; phone number</h5>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control m-0">
                                                        +
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control country-code"
                                                    type="number"
                                                    placeholder={"01"}
                                                />
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="text-end">
                                                {" "}
                                                <a
                                                    className="btn btn-outline-primary button-effect btn-sm"
                                                    href="#"
                                                >
                                                    confirm
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingFive"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseFive"
                                        aria-expanded="false"
                                        aria-controls="collapseFive"
                                    >
                                        <a>
                                            Request account info
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="collapseFive"
                                        aria-labelledby="headingFive"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <a
                                                className="p-0 req-info"
                                                id="demo"
                                                href="#"
                                                onclick='document.getElementById("demo").innerHTML = "Request sent"'
                                            >
                                                Request Info{" "}
                                            </a>
                                            <p>
                                                {" "}
                                                <b>Note : </b>Create a report of your account
                                                information and settings, which you can access ot
                                                port to another app.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div
                                        className="card-header"
                                        id="headingSix"
                                        role="heading"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseSix"
                                        aria-expanded="false"
                                        aria-controls="collapseSix"
                                    >
                                        <a>
                                            Delete My account
                                            <i className="fa fa-angle-down" />
                                        </a>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="collapseSix"
                                        aria-labelledby="headingSix"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body">
                                            <a className="p-0 req-info font-danger" href="#">
                                                Delete Account{" "}
                                            </a>
                                            <p>
                                                {" "}
                                                <b>Note :</b>Deleting your account will delete your
                                                account info, profile photo, all groups &amp; chat
                                                history.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <h3>Account</h3>
                                <h4>Update Your Account Details</h4>
                            </div>
                            <div className="media-right">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm pull-right next"
                                    href="#"
                                >
                                    {" "}
                                    <i data-feather="chevron-right"> </i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="setting-block">
                        <div className="block">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3>Chat</h3>
                                </div>
                                <div className="media-right">
                                    <a
                                        className="icon-btn btn-outline-light btn-sm pull-right previous"
                                        href="#"
                                    >
                                        {" "}
                                        <i data-feather="chevron-left"> </i>
                                    </a>
                                </div>
                            </div>
                            <ul className="help">
                                <li>
                                    <h5>Chat Backup</h5>
                                    <ul className="switch-list">
                                        <li>
                                            <input
                                                className="js-switch5"
                                                type="checkbox"
                                                defaultChecked=""
                                            />
                                            <h5>Auto Backup</h5>
                                        </li>
                                        <li>
                                            <input className="js-switch6" type="checkbox" />
                                            <h5>Include document</h5>
                                        </li>
                                        <li>
                                            <input className="js-switch7" type="checkbox" />
                                            <h5>Include Videos</h5>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h5>Chat wallpaper</h5>
                                    <ul className="wallpaper">
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/2.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/1.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/3.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/4.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/5.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                        <li>
                                            <img
                                                className="bg-img"
                                                src="../assets/images/wallpaper/6.jpg"
                                                alt="Avatar"
                                            />
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#">Archive all chat</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#"> Clear all chats</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a className="font-danger" href="#">
                                            Delete all chats
                                        </a>
                                    </h5>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <h3>Chat</h3>
                                <h4>Control Your Chat Backup</h4>
                            </div>
                            <div className="media-right">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm pull-right next"
                                    href="#"
                                >
                                    {" "}
                                    <i data-feather="chevron-right"> </i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="setting-block">
                        <div className="block">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3>Integratin</h3>
                                </div>
                                <div className="media-right">
                                    {" "}
                                    <a
                                        className="icon-btn btn-outline-light btn-sm pull-right previous"
                                        href="#"
                                    >
                                        {" "}
                                        <i data-feather="chevron-left"> </i>
                                    </a>
                                </div>
                            </div>
                            <ul className="integratin">
                                <li>
                                    <div className="d-flex">
                                        <div className="media-left">
                                            {" "}
                                            <a
                                                className="fb"
                                                href="https://www.facebook.com/login"
                                                target="_blank"
                                            >
                                                <i className="fa fa-facebook" />
                                                <h5>Facebook </h5>
                                            </a>
                                        </div>
                                        <div className="media-right">
                                            <div className="profile">
                                                <img
                                                    className="bg-img"
                                                    src="../assets/images/contact/1.jpg"
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="d-flex">
                                        <div className="media-left">
                                            {" "}
                                            <a
                                                className="insta"
                                                href="https://www.instagram.com/accounts/login/?hl=en"
                                                target="_blank"
                                            >
                                                <i className="fa fa-instagram" />
                                                <h5>instagram</h5>
                                            </a>
                                        </div>
                                        <div className="media-right">
                                            <div className="profile">
                                                <img
                                                    className="bg-img"
                                                    src="../assets/images/contact/2.jpg"
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="d-flex">
                                        <div className="media-left">
                                            {" "}
                                            <a
                                                className="twi"
                                                href="https://twitter.com/login"
                                                target="_blank"
                                            >
                                                <i className="fa fa-twitter" />
                                                <h5>twitter </h5>
                                            </a>
                                        </div>
                                        <div className="media-right">
                                            <div className="profile">
                                                <img
                                                    className="bg-img"
                                                    src="../assets/images/contact/3.jpg"
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="d-flex">
                                        <div className="media-left">
                                            {" "}
                                            <a
                                                className="ggl"
                                                href="https://accounts.google.com/signin/v2/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
                                                target="_blank"
                                            >
                                                <i className="fa fa-google" />
                                                <h5>google </h5>
                                            </a>
                                        </div>
                                        <div className="media-right">
                                            <div className="profile">
                                                <img
                                                    className="bg-img"
                                                    src="../assets/images/contact/2.jpg"
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="d-flex">
                                        <div className="media-left">
                                            {" "}
                                            <a className="slc" href="#">
                                                <i className="fa fa-slack" />
                                                <h5>Slack </h5>
                                            </a>
                                        </div>
                                        <div className="media-right">
                                            <div className="profile">
                                                <a
                                                    href="https://slack.com/get-started#/"
                                                    target="_blank"
                                                >
                                                    <i data-feather="plus-circle" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <h3>Integratin</h3>
                                <h4>Sync Your Other Social Account</h4>
                            </div>
                            <div className="media-right">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm pull-right next"
                                    href="#"
                                >
                                    {" "}
                                    <i data-feather="chevron-right"> </i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="setting-block">
                        <div className="block">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3>Help</h3>
                                </div>
                                <div className="media-right">
                                    {" "}
                                    <a
                                        className="icon-btn btn-outline-light btn-sm pull-right previous"
                                        href="#"
                                    >
                                        {" "}
                                        <i data-feather="chevron-left"> </i>
                                    </a>
                                </div>
                            </div>
                            <ul className="help">
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#">FAQ</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#"> Contact Us</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#">Terms and Privacy Policy</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#">Licenses</a>
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        {" "}
                                        <a href="#">2023 - 20 Powered by Pixelstrap</a>
                                    </h5>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <h3>Help</h3>
                                <h4>You are Confusion, Tell me</h4>
                            </div>
                            <div className="media-right">
                                {" "}
                                <a
                                    className="icon-btn btn-outline-light btn-sm pull-right next"
                                    href="#"
                                >
                                    {" "}
                                    <i data-feather="chevron-right" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="status-tab custom-scroll dynemic-sidebar"
                    id="status"
                >
                    <div className="my-status-box">
                        <div className="status-content">
                            <div className="d-flex">
                                <div className="img-status">
                                    <div className="user-status two">
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/avtar/girls.jpg"
                                            alt="status"
                                        />
                                    </div>
                                    <div className="upload-img">
                                        <input type="file" />
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h3>my status</h3>
                                    <p>tap to add status Update</p>
                                </div>
                                <div>
                                    <a
                                        className="icon-btn btn-outline-light btn-sm close-panel"
                                        href="#"
                                    >
                                        <i data-feather="x" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-status-box">
                        <div className="theme-title">
                            <h3>Recent Update</h3>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-1.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox">
                                        <img
                                            src="../assets/images/status-img/large/lg-1.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Josephin water</h5>
                                    <p>today , 8:30am</p>
                                </li>
                            </ul>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox2"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-2.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox2">
                                        <img
                                            src="../assets/images/status-img/large/lg-2.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Jony Lynetin</h5>
                                    <p>today , 10:30am</p>
                                </li>
                            </ul>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox3"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-3.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox3">
                                        <img
                                            src="../assets/images/status-img/large/lg-3.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Sufiya Elija</h5>
                                    <p>today , 11:00am</p>
                                </li>
                            </ul>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox4"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-4.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox4">
                                        <img
                                            src="../assets/images/status-img/large/lg-4.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Mukrani Pabelo </h5>
                                    <p>today , 9:55am</p>
                                </li>
                            </ul>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox5"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-5.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox5">
                                        <img
                                            src="../assets/images/status-img/large/lg-5.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Pabelo Mukrani</h5>
                                    <p>today , 12:05am</p>
                                </li>
                            </ul>
                        </div>
                        <div className="status-content">
                            <ul>
                                <li className="user-status">
                                    <a
                                        className="lightbox img-status status"
                                        href="#statusbox6"
                                    >
                                        <img
                                            className="img-fluid bg-img"
                                            src="../assets/images/status-img/small/sm-3.jpg"
                                            alt="status"
                                        />
                                    </a>
                                    <div className="lightbox-target" id="statusbox6">
                                        <img
                                            src="../assets/images/status-img/large/lg-3.jpg"
                                            alt="status"
                                        />
                                        <a className="lightbox-close" href="#" />
                                    </div>
                                </li>
                                <li>
                                    <h5>Sufiya Elija</h5>
                                    <p>today , 11:00am</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidechat