import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../common/cookieManager';
import MainComponent from '../components/Main';
import { getQueryById , addQueryById } from '../services/userService';

function MainPage() {
  const [error, setError] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [major_conditions, setMajor_conditions] = useState('');
  const [minor_conditions, setMinor_conditions] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const fetchQuery = async () => {
    if (name) { 
      try {
        const fetchedQuery = await getQueryById(token, id);
        if (fetchedQuery.length > 0) {
          setCompany(fetchedQuery[0].company);
          setCategory(fetchedQuery[0].category);
          setMajor_conditions(fetchedQuery[0].major_conditions);
          setMinor_conditions(fetchedQuery[0].minor_conditions);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (!userInfo) {
      alert('User is logging out');
      navigate('/');
      return;
    }
    setId(userInfo.id);
    setName(userInfo.name);
    setToken(userInfo.token);
    if (id > 0) fetchQuery();
  }, [name]);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 300000); // 5 minute
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    handleActivity(); // Initialize the timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }

  const handleMajorConditionsChange = (e) => {
    setMajor_conditions(e.target.value);
  }

  const handleMinorConditionsChange = (e) => {
    setMinor_conditions(e.target.value);
  }

  const handleLogout = () => {
    alert('User is logging out');
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };
 
  const handleResetQuery = () => {
    setError('');
    setCompany('');
    setCategory('');
    setMajor_conditions('');
    setMinor_conditions('');
  };
  
  const handleSaveProceed = async () => {
    try {
      await addQueryById(token, id, company, category, major_conditions, minor_conditions);
      alert('Query saved successfully');
      navigate('/products');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleReset = () => {
    handleResetQuery();
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <MainComponent 
          name={name}
          company={company}
          handleCompanyChange={handleCompanyChange}
          category={category}
          handleCategoryChange={handleCategoryChange}
          major_conditions={major_conditions}
          handleMajorConditionsChange={handleMajorConditionsChange}
          minor_conditions={minor_conditions}
          handleMinorConditionsChange={handleMinorConditionsChange}
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
          handleSaveProceed={handleSaveProceed}
          handleResetQuery={handleResetQuery}
        />
      </div>
    </div>
  );
}

export default MainPage;