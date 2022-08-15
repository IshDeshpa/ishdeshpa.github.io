import * as React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Helmet} from "react-helmet";
import {animated, useSpring} from 'react-spring'

const NavItem = ({scale=2, children, path, title}) => {
	const [isScaled, setIsScaled] = React.useState(false);
	const style = useSpring({
		transform: isScaled
      ? `scale(${scale})`
      : `scale(1)`,
		config: {
			tension: 500,
			friction: 20,
		}
	});
	const styleSel = {
		transform: `scale(${scale})`
	};

	if(window.location.pathname !== path){
		return(
			<React.Fragment>
				<animated.div className="nav-item mx-3 d-none d-md-inline" onMouseEnter={()=>setIsScaled(true)} onMouseLeave={()=>setIsScaled(false)} style={style}>
					<Nav.Link className="text-uppercase fw-bolder" href={path}>
								{title}
					</Nav.Link>
				</animated.div>
				<Nav.Item className="mx-3 d-inline d-md-none">
					<Nav.Link className="text-uppercase fw-bolder" href={path}>
							{title}
					</Nav.Link>
				</Nav.Item>
			</React.Fragment>
		);
	}
	else{
		return(
			<React.Fragment>
				<Nav.Item className="mx-3" style={styleSel}>
					<Nav.Link className="text-uppercase fw-bolder" href={path}>
							{title}
					</Nav.Link>
				</Nav.Item>
			</React.Fragment>
		);
	}
};

const Navigation = ({menuLinks}) => {
	let navElems = null;
	navElems = menuLinks
	.map(navElem=>(
			<NavItem scale="1.5" timing="100" path={navElem.node.frontmatter.path} title={navElem.node.frontmatter.title}/>
	));
	return(
		//<Navbar bg="primary" variant="light" className="justify-content-center">
		<Navbar collapseOnSelect className="sticky-top" expand="lg">
			<Nav className="justify-content-start w-100">
				{navElems}
			</Nav>
		</Navbar>
	)
}

const Header = ({siteTitle, menuLinks}) => {
	return(
		<React.Fragment>
			<Helmet>
				<title>{siteTitle}</title>
			</Helmet>
			{/*<h1 className="display-3 text-center fw-bolder">
				<a href="/" className="text-reset text-decoration-none">Ishan Deshpande</a>
			</h1>*/}
			<Navigation menuLinks={menuLinks}></Navigation>
		</React.Fragment>
	)
}

export default Header