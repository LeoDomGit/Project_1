import React, { useState } from 'react'
import Layout from '../../components/Layout';
import axios from 'axios';
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
function Index({roles,users}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(null);
    const [permission, setPermission] = useState("");
    const [show, setShow] = useState(false);
    const [data, setData] = useState(users);
    const submitRegister = () => {
        axios.post('/admin/users', {
            name: name,
            email: email,
            role: role,
        }).then((res)=>{
            if(res.data.check==true){
                notyf.success(
                    'Thêm thành công'
                );
                setData(res.data.data);
            }else{
                notyf.error(
                    res.data.msg
                );
            }
        })
    }
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
    return (
        <>
            <Layout>
                <div className="row pt-5">
                    <div className="col-md-6">
                        {show==true?
                        <div className="card border-0 shadow" style={{width:"100%"}}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label htmlFor="name" className="form-label">Email</label>
                                        <input type="text" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label htmlFor="name" className="form-label">Role</label>
                                        <select className="form-select" onChange={(e)=>setRole(e.target.value)} defaultValue={0} aria-label="Default select example">
                                            <option  disabled value={0}>Select a role</option>
                                            {roles.map((item, index) => (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <button className="btn btn-primary" onClick={()=>submitRegister()}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="card border-0 shadow" style={{width:"100%"}}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <button className="btn btn-primary" onClick={()=>setShow(true)}>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Index