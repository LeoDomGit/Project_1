import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

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

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (user && user.access_token) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                if (res.data.email) {
                    return axios.post('/checkLogin-email', { email: res.data.email });
                }
            })
            .then(res => {
                if (res.data.check === true) {
                    setTimeout(() => notyf.success('Đăng nhập thành công'), 1700);
                    window.location.href = '/admin/users';
                } else {
                    notyf.error(res.data.msg);
                }
            })
            .catch((err) => console.log(err));
        }
    }, [user]);

    const checkLogin = () => {
        axios.post('/checkLogin', { email, password })
            .then(res => {
                if (res.data.check === true) {
                    setTimeout(() => notyf.success('Đăng nhập thành công'), 1700);
                    window.location.href = '/admin/users';
                } else {
                    notyf.error(res.data.msg);
                }
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <section className="container px-0 pt-5 mt-5">
                <div className="card border-light-subtle shadow">
                    <div className="row g-0">
                        <div className="col-12 col-md-6 ">
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="col-10 col-xl-8 py-3">
                                    <img className='img-fluid' src="https://www.drupal.org/files/project-images/Disable%20Login%20Page-Icon.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="mb-5">
                                            <h3>Đăng Nhập</h3>
                                        </div>
                                    </div>
                                </div>
                                <form action="#!">
                                    <div className="row gy-3 gy-md-4 overflow-hidden">
                                        <div className="col-12">
                                            <label htmlFor="email" className="form-label">
                                                Địa chỉ Email <span className="text-danger">*</span>
                                            </label>
                                            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} name="email" id="email" placeholder="name@example.com" required="" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="password" className="form-label">
                                                Mật khẩu <span className="text-danger">*</span>
                                            </label>
                                            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} name="password" id="password" defaultValue="" required="" />
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid">
                                                <button className="btn bsb-btn-xl btn-dark" onClick={(e) => checkLogin()} type="button">
                                                    Đăng nhập
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="row">
                                    <div className="col-12">
                                        <hr className="mt-5 mb-4 border-secondary-subtle" />
                                        <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex gap-3 flex-column flex-xl-row">
                                            <a href="#!" onClick={login} className="btn bsb-btn-xl btn-outline-dark">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
</svg>
                                                <span className="ms-2 fs-6">Login with Google</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login