import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen  } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { test } from "node:test";

// Import the jsdom package
import { TextEncoder } from 'text-encoding';
import { JSDOM } from 'jsdom';

// Set up the virtual DOM environment
const dom = new JSDOM();
global.document = dom.window.document;
// global.window = dom.window;

Object.assign(global, { Document, TextEncoder });

describe('Navbar Component', () => {

	test('renders the Navbar component', () => {
		render(
			<BrowserRouter>
				<Navbar theme="dark" toggleTheme={() => {}} />
			</BrowserRouter>
		);
		
		const navBar = screen.getByRole('navigation');
		expect(navBar).toBeInTheDocument();
	});
});




// describe('Navbar Component', () => {
// 	test('renders the Navbar component', () => {
// 	  render(
// 		<BrowserRouter>
// 		  <Navbar theme="dark" toggleTheme={() => {}} />
// 		</BrowserRouter>
// 	  );
	  
// 	  // Add your assertions here
// 	  // assert that the navbar is in the document	



// 	});

// 	// test('toggles the sidebar when the checkbox is clicked', () => {
// 	// 	const { getByLabelText } = render(
// 	// 		<BrowserRouter>
// 	// 		<Navbar theme="kawaii" toggleTheme={() => {}} />
// 	// 	</BrowserRouter>
// 	// 	);
		
// 	// 	const checkbox = getByLabelText('Toggle Sidebar');
// 	// 	fireEvent.click(checkbox);
		
// 	// 	// Add your assertions here
// 	// });

// 	test('Nav title is here', () => {

// 		// Act : look for the title
// 		const navTitle = screen.getByText(/CYBERPONG/);

// 		// Assert
// 		expect(navTitle).toBeInTheDocument();
// 	});
// });