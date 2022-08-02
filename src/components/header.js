import * as React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Helmet} from "react-helmet";
import {animated, useSpring} from 'react-spring'
//import Container from 'react-bootstrap/Container';

const NavItem = ({scale=2, timing=150, key, children}) => {
	const [isScaled, setIsScaled] = React.useState(false);
	const style = useSpring({
		transform: isScaled
      ? `scale(${scale})`
      : `scale(1)`,
		config: {
			tension: 300,
			friction: 20,
		}
	});

	const AnimatedNavItem = animated(({...props})=>(<Nav.Item {...props}></Nav.Item>));

	return(
		<AnimatedNavItem className="text-light" onMouseEnter={()=>setIsScaled(true)} onMouseLeave={()=>setIsScaled(false)} style={style} key={key}>
			{children}
		</AnimatedNavItem>
	);
};

const Navigation = ({menuLinks}) => {
	let navElems = null;
	navElems = menuLinks
	.sort((a, b)=>{
		return a.node.frontmatter.index - b.node.frontmatter.index;
	})
	.map(navElem=>(
			<NavItem key={navElem.node.frontmatter.id} scale="2" timing="200">
				<Nav.Link href={navElem.node.frontmatter.path}>
					{navElem.node.frontmatter.title}
				</Nav.Link>
			</NavItem>
	));
	return(
		//<Navbar bg="primary" variant="light" className="justify-content-center">
		<Navbar collapseOnSelect className="sticky-top" expand="lg">
			<Nav className="justify-content-around w-100">
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
			<h1 className="display-3 text-center fw-bolder">
				<a href="/" className="text-reset text-decoration-none">Ishan Deshpande</a>
			</h1>
			<Navigation menuLinks={menuLinks}></Navigation>
		</React.Fragment>
	)
}

export default Header