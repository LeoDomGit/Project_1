import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import CKEditor from '../../components/CKEditor';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

function Create() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [compare_price, setComparePrice] = useState(0);
  const [content, setContent] = useState('');
  const [timer, setTimer] = useState(null); // To manage the 3s delay
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

  const notyf = new Notyf({
    duration: 1000,
    position: { x: 'right', y: 'top' },
    types: [
      { type: 'error', background: 'indianred', duration: 2000, dismissible: true },
      { type: 'success', background: 'green', color: 'white', duration: 2000, dismissible: true },
    ],
  });

  // Function to handle content creation
  const handleCreateContent = async () => {
    if (!name) {
      notyf.error('Product name cannot be empty');
      return;
    }

    try {
      const prompt = `Create a product introduction in vietnamese for ${name}, including its features, price of ${price} VND, and a compare price of ${compare_price} VND. The content should be around 1200 words and engaging. And make html css for it as a content with paragraphs, font-size of text min 16px`;

      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        throw new Error('Error generating content');
      }

      const data = await response.json();
      const generatedContent = data.choices[0]?.message?.content || '';

      setContent(generatedContent);
      notyf.success('Content generated successfully');
    } catch (error) {
      console.error('Error:', error);
      notyf.error('Failed to generate content');
    }
  };

  // UseEffect to run handleCreateContent 3 seconds after name change
  useEffect(() => {
    if (!name) return;

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      handleCreateContent();
    }, 3000);

    setTimer(newTimer);

    return () => {
      clearTimeout(newTimer); // Cleanup on component unmount or before new setTimeout
    };
  }, [name]); // Dependency array listens for changes in 'name'

  return (
    <>
      <Layout>
        <>
        <div className="row">
          <div className="col-md-8">
          <div class="card text-start border-0 shadow">
            <div class="card-body">
            <div className="row mt-5">
            <div className="col-md-3">
              <label htmlFor="">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="">Giá sản phẩm</label>
              <input
                type="number"
                className="form-control"
                value={compare_price}
                onChange={(e) => setComparePrice(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="">Giá khuyến mãi</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md">
              <CKEditor value={content} onBlur={(newContent) => setContent(newContent)} />
            </div>
          </div>
            </div>
          </div>
          </div>
        </div>
          
        </>
      </Layout>
    </>
  );
}

export default Create;
