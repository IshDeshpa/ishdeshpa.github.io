import * as React from 'react';
import Container from 'react-bootstrap/Container';


const Jumbo = ({children, theme}) => {
	return(
		<React.Fragment>
			<Container fluid className={"jumbotron p-5 "+theme}>
				{children}
			</Container>
		</React.Fragment>
	)
}

export default Jumbo