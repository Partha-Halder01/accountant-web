import { useState, useEffect } from 'react';
import { Video, Building2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE_URL } from '../config/api';
import './Booking.css';

const STAFF_OPTIONS = [
  { id: 'any', name: 'Any staff', initial: 'Any' },
  { id: 'abusayed', name: 'Abusayed', initial: 'Ab' },
  { id: 'mostafa', name: 'MG Mostafa', initial: 'MG', img: '/owner.jpeg' }
];

const TIME_SLOTS = [
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45',
  '17:00',
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [blockedDates, setBlockedDates] = useState([]);
  const [weeklyOffDays, setWeeklyOffDays] = useState([]);
  const [bookedTimes, setBookedTimes] = useState({});
  
  const [formData, setFormData] = useState({
    staff_name: 'Any staff',
    appointment_date: '',
    appointment_time: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    purpose: '',
    meeting_type: 'Google Meet',
    file: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch blocked dates
    fetch(`${API_BASE_URL}/api/appointments/blocked-dates`)
      .then(res => res.json())
      .then(data => {
        if (data.blocked_dates) {
          setBlockedDates(data.blocked_dates);
        }
        if (data.weekly_off_days) {
          setWeeklyOffDays(data.weekly_off_days);
        }
        if (data.booked_times) {
          setBookedTimes(data.booked_times);
        }
      })
      .catch(err => console.error('Failed to fetch blocked dates', err));
  }, []);

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formPayload.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        body: formPayload,
        headers: {
            'Accept': 'application/json'
        }
      });
      
      const payload = await response.json();
      
      if (!response.ok) {
        throw new Error(payload.message || 'Something went wrong.');
      }
      
      setSuccess(true);
      setStep(4); // Confirmation step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodayStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <p>Schedule a time with our accounting professionals.</p>
        </div>

        <div className="booking-progress">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`progress-dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        {step === 1 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Select Staff</h2>
            <div className="staff-grid">
              {STAFF_OPTIONS.map(staff => (
                <div 
                  key={staff.id}
                  className={`staff-card ${formData.staff_name === staff.name ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, staff_name: staff.name})}
                >
                  {staff.img ? (
                    <img src={staff.img} alt={staff.name} className="staff-avatar-img" />
                  ) : (
                    <div className="staff-avatar">{staff.initial}</div>
                  )}
                  <div>
                    <strong>{staff.name}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="booking-nav">
              <div></div>
              <button className="btn-primary" onClick={handleNext}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Select Date & Time</h2>
            <div className="datetime-container">
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'bold'}}>Date</label>
                <DatePicker
                  selected={
                    formData.appointment_date 
                      ? new Date(formData.appointment_date.split('-')[0], formData.appointment_date.split('-')[1] - 1, formData.appointment_date.split('-')[2]) 
                      : null
                  }
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setFormData({...formData, appointment_date: `${year}-${month}-${day}`});
                    } else {
                      setFormData({...formData, appointment_date: ''});
                    }
                  }}
                  minDate={new Date()}
                  filterDate={(date) => {
                    const dayOfWeek = date.getDay();
                    if (weeklyOffDays.includes(dayOfWeek)) return false;
                    
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;
                    
                    if (blockedDates.includes(formattedDate)) return false;
                    
                    return true;
                  }}
                  className="calendar-input"
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date"
                />
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'bold'}}>Time</label>
                {formData.appointment_date ? (
                  <div className="time-grid">
                    {TIME_SLOTS.map(time => {
                      const isBooked = bookedTimes[formData.appointment_date]?.includes(time);
                      return (
                        <div 
                          key={time}
                          className={`time-slot ${formData.appointment_time === time ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                          onClick={() => {
                            if (!isBooked) {
                              setFormData({...formData, appointment_time: time});
                            }
                          }}
                          title={isBooked ? "This time is already booked" : ""}
                          style={isBooked ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#e2e8f0', color: '#64748b' } : {}}
                        >
                          {time}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{color: 'var(--ink-500)'}}>Please select a date first.</p>
                )}
              </div>
            </div>
            <div className="booking-nav">
              <button className="btn-secondary" onClick={handleBack}>Back</button>
              <button 
                className="btn-primary" 
                disabled={!formData.appointment_date || !formData.appointment_time}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Contact Info</h2>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group form-group-full">
                <label>Purpose of Appointment</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                  placeholder="E.g., Discuss individual tax return, consultation for new business..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group form-group-full">
                <label>Meeting Type</label>
                <div className="meeting-type-grid">
                  <div 
                    className={`meeting-type-card ${formData.meeting_type === 'Google Meet' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, meeting_type: 'Google Meet'})}
                  >
                    <Video size={24} />
                    <span>Google Meet</span>
                  </div>
                  <div 
                    className={`meeting-type-card ${formData.meeting_type === 'Office Visit' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, meeting_type: 'Office Visit'})}
                  >
                    <Building2 size={24} />
                    <span>Office Visit</span>
                  </div>
                </div>
              </div>
              <div className="form-group form-group-full">
                <label>Upload Document (Optional)</label>
                <input 
                  type="file" 
                  onChange={e => setFormData({...formData, file: e.target.files[0]})}
                />
                <small style={{color:'var(--ink-500)'}}>Upload any relevant tax documents or forms.</small>
              </div>

              <div className="booking-nav">
                <button type="button" className="btn-secondary" onClick={handleBack}>Back</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && success && (
          <div className="booking-step" style={{textAlign: 'center'}}>
            <h2 className="booking-step-title" style={{border: 'none', color: 'var(--forest-600)'}}>
              Thanks for booking!
            </h2>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>
              Your appointment request is pending. We will notify you when it is accepted.
            </p>
            <div style={{background: 'var(--cream-100)', padding: '1.5rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', minWidth: '300px'}}>
              <p><strong>Date:</strong> {formData.appointment_date}</p>
              <p><strong>Time:</strong> {formData.appointment_time}</p>
              <p><strong>Staff:</strong> {formData.staff_name}</p>
            </div>
            
            <div className="confirmation-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.0355447783935!2d-71.11337802422072!3d42.40564613354318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e376ccafca8101%3A0xc3f834925ce25941!2s43%20High%20St%2C%20Medford%2C%20MA%2002155!5e0!3m2!1sen!2sus!4v1704204561234!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="EasyAcct Location"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
