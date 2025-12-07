import React, {useState, useEffect} from 'react';
import axios from 'axios';
const backend = process.env.REACT_APP_BACKEND || 'http://localhost:4000';

export default function AdminDashboard(){
  const token = localStorage.getItem('token');
  const [bookings,setBookings] = useState([]);
  const [name,setName] = useState('');
  const [duration,setDuration] = useState(60);

  useEffect(()=> load(), []);
  const load = async ()=>{
    try{
      const res = await axios.get(`${backend}/api/admin/bookings`, { headers: { Authorization: 'Bearer '+token }});
      setBookings(res.data);
    }catch(e){ console.error(e); setBookings([]) }
  };
  const approve = async (id, action) => {
    await axios.post(`${backend}/api/admin/bookings/${id}/approve`, { action }, { headers: { Authorization: 'Bearer '+token }});
    load();
  };
  const addService = async ()=>{
    await axios.post(`${backend}/api/admin/service`, { name, duration_minutes: duration }, { headers: { Authorization: 'Bearer '+token }});
    setName(''); setDuration(60);
    alert('Serviço adicionado');
  };

  return (
    <div className="container">
      <h2>Painel Admin</h2>
      <div className="card">
        <h3>Adicionar serviço</h3>
        <input placeholder="Nome do serviço" value={name} onChange={e=>setName(e.target.value)}/>
        <input placeholder="Duração(min)" value={duration} onChange={e=>setDuration(e.target.value)}/>
        <button className="btn" onClick={addService}>Adicionar</button>
      </div>

      <div className="card">
        <h3>Agendamentos</h3>
        <table className="list">
          <thead><tr><th>ID</th><th>Cliente</th><th>Serviço</th><th>Data</th><th>Hora</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {bookings.map(b=>(
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.client}</td><td>{b.service}</td><td>{b.date}</td><td>{b.time}</td><td>{b.status}</td>
                <td>
                  <button onClick={()=>approve(b.id,'APPROVE')}>Aprovar</button>
                  <button onClick={()=>approve(b.id,'REJECT')}>Rejeitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
