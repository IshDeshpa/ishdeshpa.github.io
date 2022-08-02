import * as React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Helmet} from "react-helmet";
import {animated, useSpring} from 'react-spring'

const NavItem = ({scale=2, timing=150, children, order}) => {
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

	return(
		<animated.div className="nav-item mx-3" onMouseEnter={()=>setIsScaled(true)} onMouseLeave={()=>setIsScaled(false)} style={style}>
			{children}
		</animated.div>
	);
};

const Navigation = ({menuLinks}) => {
	let navElems = null;
	navElems = menuLinks
	.map(navElem=>(
			<NavItem scale="1.5" timing="100">
				<Nav.Link className="text-uppercase fw-bolder" href={navElem.node.frontmatter.path}>
					{navElem.node.frontmatter.title}
				</Nav.Link>
			</NavItem>
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