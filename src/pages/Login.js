import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();
  const backend = process.env.REACT_APP_BACKEND || 'http://localhost:4000';

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${backend}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    }catch(err){ alert(err.response?.data?.error || 'Erro login') }
  };

  return (
    <div className="container">
      <h2>Entrar</h2>
      <form onSubmit={submit} className="card">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Entrar</button>
        <p>Não tem cadastro? <Link to="/register">Cadastre-se</Link></p>
      </form>
    </div>
  );
}
