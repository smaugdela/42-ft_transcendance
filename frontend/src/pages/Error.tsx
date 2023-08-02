// import React from 'react';
import { useParams } from 'react-router-dom';
import "../styles/Error.css"

const ErrorPage = () => {
  const { status } = useParams();

  let errorMessage = '';
  switch (status) {
    case '400':
      errorMessage = 'Bad Request';
      break;
    case '401':
      errorMessage = 'Unauthorized';
      break;
    case '403':
      errorMessage = 'Forbidden';
      break;
    case '404':
      errorMessage = 'Page Not Found';
      break;
    case '500':
      errorMessage = 'Internal Server Error';
      break;
    default:
      errorMessage = 'Ressource Not Found';
  }

  return (
    <div className="Error">
		<div className="background"/>
		<form className="connection-error-form">
      		<h1>Error {status}</h1>
      		<p className="error-message">{errorMessage}</p>
	  	</form>
    </div>
  );
};

export default ErrorPage;
