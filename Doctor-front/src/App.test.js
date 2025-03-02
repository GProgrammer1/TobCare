import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

/* DoctorSignup.css */

// body {
//   font-family: 'Inter', sans-serif;  
//   background: var(--background-gradient);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh; /* Ensures full height */
// }

// h2 {
//   margin: 0;
//   font-family: 'Poppins', sans-serif;
//   font-weight: 600;
// }


  
// .form-container {
//   max-width: 500px; /* Reduce width for better alignment */
//   margin: 20px;
//   background: white;
//   padding: 20px;
//   border-radius: 12px;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//   width: 90%; /* Makes it responsive on smaller screens */
// }

  
//   .form-title {
//     text-align: center;
//     font-size: 24px;
//     font-weight: bold;
//     margin-bottom: 20px;
//   }
  
//   .form-body {
//     display: flex;
//     flex-direction: column;
//   }

//   .form-body img{
//     margin: 0;
//   }

//   .Samira{
//     text-align: center;
//     color: rgb(55, 54, 53);
//   }
  
//   .form-grouppp {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;
//     gap: 5px;
//   }
  
//   .form-group input {
//     flex: 1; /* Makes both inputs equal width */
//     min-width: 45%; /* Prevents overlap */
//   }
  
//   .input {
//     width: 100%; /* Ensures all inputs take full width inside container */
//     padding: 10px;
//     margin: 5px 0;
//     border: 1px solid #ddd;
//     border-radius: 5px;
//     font-size: 16px;
//     box-sizing: border-box; /* Prevents extra width issues */
//   }
  
//   textarea.input {
//     height: 100px;
//   }
  
//   .checkbox-group {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 10px;
//     margin: 10px 0;
//   }
  
//   .file-upload {
//     display: block;
//     margin-top: 10px;
//   }
  
//   .submit-button {
//     background: #007bff;
//     color: white;
//     font-size: 18px;
//     padding: 10px;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     transition: background 0.3s ease;
//   }
  
//   .submit-button:hover {
//     background: #0056b3;
//   }
  
//   .toggle-p {
//     text-align: center;
//     margin-bottom: 0;
//     font-size: 12px;
//   }
//   .toggle-link {
//     color: #007bff;
//     cursor: pointer;
//   }
  
//   .toggle-link:hover {
//     text-decoration: underline;
//   }

//   .requiredstar{
//     color: red;
//   }
