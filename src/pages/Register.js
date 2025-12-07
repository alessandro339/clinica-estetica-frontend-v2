import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();
  const backend = process.env.REACT_APP_BACKEND || 'http://localhost:4000';

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${backend}/api/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      nav('/');
    }catch(err){ alert(err.response?.data?.error || 'Erro') }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form onSubmit={submit} className="card">
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Cadastrar</button>
      </form>
    </div>
  );
}
