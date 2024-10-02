import React, { useState } from 'react'
import Layout from '../../components/Layout'
import CKEditor from '../../components/CKEditor';

function Create() {
    const [name,setName]= useState('');
    const [price,setPrice]= useState(0);
    const [compare_price,setComparePrice]= useState(0);
    const [content,setContent]= useState('');
  return (
    <>
    <Layout>
        <>
           <div className="row mt-5">
                <div className="col-md-3">
                    <label htmlFor="">Tên sản phẩm</label>
                    <input type="text" className="form-control"  value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <label htmlFor="">Giá sản phẩm</label>
                    <input type="number"  className="form-control"  value={compare_price} onChange={(e)=>setComparePrice(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <label htmlFor="">Giá khuyến mãi</label>
                    <input type="number" className="form-control"  value={price} onChange={(e)=>setPrice(e.target.value)} />
                </div>
           </div>
           <div className="row mt-3">
            <div className="col-md-9">
            <CKEditor
                value={content}
                onBlur={(newContent) => setContent(newContent)}
            />
            </div>
            <div className="col-md">
                <button className='btn btn-primary'>Tạo bài viết</button>
            </div>
           </div>
        </>

    </Layout>
    </>
  )
}

export default Create