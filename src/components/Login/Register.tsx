import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerMerchant } from '../../api/auth'; // ✅ make sure this function exists in auth.ts
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    category: 'men',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await registerMerchant(
        form.shopName,
        form.ownerName,
        form.email,
        form.phoneNumber,
        form.password,
        form.category
      );
      navigate('/merchant/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2 className="register-title">Merchant Registration</h2>

        {error && <div className="register-error">{error}</div>}

        <label>
          Shop Name
          <input name="shopName" value={form.shopName} onChange={handleChange} required />
        </label>

        <label>
          Owner Name
          <input name="ownerName" value={form.ownerName} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Phone Number
          <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
        </label>

        <label>
          Confirm Password
          <input name="confirmPassword" type="password" minLength={6} value={form.confirmPassword} onChange={handleChange} required />
        </label>

        <label>
          Shop Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="register-footer">
          Already have an account? <Link to="/merchant/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
