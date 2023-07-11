import { fetch2FA } from "../api/APIHandler";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const VerificationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extracting the code from the query parameters
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
	const userId = queryParams.get('userId');

    // Check if the code exists and is valid
    if (code && userId) {
      const verifyCode = async () => {
        try {
          const response = await fetch2FA(code, userId);

          if (response.status === 200) {
			setIsLoading(false);
			setIsSuccess(true);
            setTimeout(() => {
              navigate('/');
            }, 2000); // Delay before redirecting to the home page (2 seconds)
          } else {
            // Handle the case when the code is not valid
            console.log('Code verification failed');
			setIsLoading(false);
			setIsSuccess(false);
          }
        } catch (error) {
          console.log('Error occurred during code verification', error);
          setIsLoading(false);
		  setIsSuccess(false);
		//   navigate('/error/');
        }
      };

      verifyCode();
    } else {
      // Handle the case when the code is missing from the query parameters
      console.log('Code not found in the query parameters');
      setIsLoading(false);
    }
  }, [location.search, navigate]);

  return (
    <div className="DoubleFA">
		<div className="background"/>
		<form className="connection-form">
			{isLoading && <p>Loading...</p>}
			{!isLoading && isSuccess && <p>Verification successful! You will be redirected shortly to homepage.</p>}
			{!isLoading && !isSuccess && <p>Verification failed, please try again.</p>}
		</form>
	</div>
  );
};

export default VerificationPage;
