"use client";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


const SubscribeForm = ({ subscribe_text, subscribe_input_form, subscribe_post_url }) => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // null, 'success', or 'error'
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [inputFieldValue, setInputFieldValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputFieldValue)) {
        setSubscriptionStatus('error');
        console.error('Invalid email format');
        setSubscriptionError("Neteisingas el. pašto formatas.");
        return;
    }


    try {
      const response = await axios.post(subscribe_post_url, {
        email: inputFieldValue,
      });

      if (response.status === 200) {
        setSubscriptionStatus('success');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        console.log('Subscription successful');
      } else {
        setSubscriptionStatus('error');
        console.error('Subscription failed with status:', response.status);
        setSubscriptionError("Nepavyko prenumeruoti. Prašome bandyti vėliau.");
      }
    } catch (error) {
      setSubscriptionStatus('error');
      console.error('An error occurred:', error);
      setSubscriptionError("Nepavyko prenumeruoti. Prašome bandyti vėliau.");
    }
  };



  useEffect(() => {
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(showSuccessMessage);
  }, [showSuccessMessage]);




  return (
    <>
      <style jsx>
        {`
          .fade-out {
            animation: fadeOut 10s;
            -webkit-animation: fadeOut 10s;
            -moz-animation: fadeOut 10s;
            -o-animation: fadeOut 10s;
            -ms-animation: fadeOut 10s;
          }

          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}
      </style>
      <h6 className="flex justify-center" style={{marginBottom: 20}}>{subscribe_text}</h6>
      <div className="flex justify-center">
        <div className="sm:col-12 md:col-8 xl:col-6 2xl:col-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-nowrap">
              <input
                type="email"
                className="form-input rounded-r-none" 
                style={{backgroundColor: 'black'}} 
                placeholder={subscribe_input_form}
                value={inputFieldValue}
                onChange={(e) => setInputFieldValue(e.target.value)}
              />
              <button className="btn btn-primary rounded-l-none" type="submit">
                <KeyboardArrowRightIcon />
              </button>
              
            </div>
            <div style={{height: 50, marginTop: 5}}>
              {showSuccessMessage && (
                <p className="text-green-500 text-center fade-out">Prenumerata sėkminga!</p>
              )}
              {subscriptionStatus === 'error' && (
                <p className="text-red-500 text-center">{subscriptionError}</p>
              )}
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default SubscribeForm;
