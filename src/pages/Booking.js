import React, {useEffect, useState} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const backend = process.env.REACT_APP_BACKEND || 'http://localhost:4000';

export default function Booking(){
  const [services,setServices] = useState([]);
  const [selectedService,setSelectedService] = useState(null);
  const [date,setDate] = useState(new Date());
  const [slots,setSlots] = useState([]);
  const [selectedTime,setSelectedTime] = useState('');
  const [token,setToken] = useState(localStorage.getItem('token'));

  useEffect(()=>{ axios.get(`${backend}/api/bookings/services`).then(r=>setServices(r.data)); },[]);

  const checkAvailability = async () => {
    if(!selectedService) return alert('Escolha um serviço');
    const d = date.toISOString().slice(0,10);
    const res = await axios.get(`${backend}/api/bookings/availability`, { params: { date: d, service_id: selectedService }});
    setSlots(res.data);
  };

  const book = async () => {
    if(!token) return alert('Faça login antes de agendar');
    if(!selectedTime) return alert('Escolha horário');
    const d = date.toISOString().slice(0,10);
    await axios.post(`${backend}/api/bookings`, { service_id: selectedService, date: d, time: selectedTime }, { headers: { Authorization: 'Bearer '+token }});
    alert('Agendamento criado. O dono irá aprovar.');
  };

  return (
    <div className="container">
      <h2>Agende seu horário</h2>
      <div className="card">
        <label>Serviço</label>
        <select onChange={e=>setSelectedService(e.target.value)} value={selectedService || ''}>
          <option value="">-- selecione --</option>
          {services.map(s=> <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>)}
        </select>

        <label>Data</label>
        <DatePicker selected={date} onChange={(d)=>setDate(d)} dateFormat="yyyy-MM-dd" minDate={new Date()} />

        <button className="btn" onClick={checkAvailability}>Verificar horários</button>

        <label>Horários disponíveis</label>
        <div className="slots">
          {slots.length === 0 && <p>Nenhum horário disponível (clique em verificar).</p>}
          {slots.map(s => <button key={s} className={s===selectedTime ? 'slot selected' : 'slot'} onClick={()=>setSelectedTime(s)}>{s}</button>)}
        </div>

        <button className="btn primary" onClick={book}>Agendar</button>
      </div>
    </div>
  );
}
