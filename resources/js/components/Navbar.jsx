import React, { useState } from 'react'

function Navbar({ toggleSidebar, sidebar }) {
    return (
        <>
            <nav className={sidebar ? "main-nav on custom-scroll" : "main-nav custom-scroll"}>
                <div className="logo-warpper">
                    <a href="messenger.html">
                        <img src="../assets/images/logo/logo.png" alt="logo" />
                    </a>
                </div>
                <div className="sidebar-main">
                    <ul className="sidebar-top">
                        <li>
                            <a
                                className="button-effect"
                                href="status"
                                data-tippy-content="status"
                                data-intro="Check Status here"
                            >
                                <div className="user-popup status one">
                                    <div>
                                        {" "}
                                        <img
                                            className="bg-img"
                                            src="../assets/images/avtar/2.jpg"
                                            alt="Avatar"
                                        />
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                className="icon-btn btn-light button-effect"
                                href="favourite"
                                data-tippy-content="Favourite"
                            >
                                <i className="fa fa-star"> </i>
                            </a>
                        </li>
                        <li>
                            <a
                                className="icon-btn btn-light button-effect"
                                href="document"
                                data-tippy-content="Document"
                            >
                                {" "}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-archive"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                className="icon-btn btn-light button-effect"
                                href="contact-list"
                                data-tippy-content="Contact List"
                            >
                                {" "}
                                <i className="fa fa-users"></i>
                            </a>
                        </li>
                        <li>
                            <div className="dot-btn dot-danger grow">
                                <a
                                    className="icon-btn btn-light button-effect"
                                    href="notification"
                                    data-tippy-content="Notification"
                                >
                                    {" "}
                                    <i className="fa fa-bell" />
                                </a>
                            </div>
                        </li>
                        <li>
                            <a
                                className="icon-btn btn-light button-effect"
                                href="settings"
                                data-tippy-content="Setting"
                                data-intro="You can change settings by clicking here"
                            >
                                {" "}
                                <i className="fa fa-cog" />
                            </a>
                        </li>
                    </ul>
                    <ul className="sidebar-bottom">
                        <li>
                            <a
                                className="icon-btn btn-light button-effect mode"
                                href="#"
                                data-tippy-content="Theme Mode"
                                data-intro="Change mode"
                            >
                                <i className="fa fa-moon-o" />
                            </a>
                        </li>
                        <li>
                            <a
                                className="icon-btn btn-light"
                                href="login.html"
                                data-tippy-content=" SignOut"
                            >
                                {" "}
                                <i className="fa fa-power-off"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar