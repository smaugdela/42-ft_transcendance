import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function SidebarElem(props : { 
	title: string,
	path: string,
	image: IconProp}) {
	return (
		<>
			<li className='nav-text'>
				<Link to={props.path} >
				<div className='item_image' >
					<FontAwesomeIcon className='item_image' icon={props.image} />
				</div>
				<span className='item_title'> {props.title}</span>	
				</Link>
			</li>
		</>
	);
}