import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Jumbo = ({children, imgSrc, align, theme}) => {
	const ImgComp=()=>{
		return (
		<Col md="auto">
			<Image fluid src={imgSrc} alt="alt"></Image>
		</Col>
		)
	}
	const TextComp=()=>{
		return (
		<Col>
			{children}
		</Col>
		)
	}

	if(align==="left"){
		return(
			<React.Fragment>
				<Container fluid className={"jumbotron p-5 "+theme}>
					<Row>
						<TextComp></TextComp>
						<ImgComp></ImgComp>
					</Row>
				</Container>
			</React.Fragment>
		)
	}
	else{
		return(
			<React.Fragment>
				<Container fluid className={"jumbotron p-5 "+theme}>
					<Row>
						<ImgComp></ImgComp>
						<TextComp></TextComp>
					</Row>
				</Container>
			</React.Fragment>
		)
	}
}

export default Jumbo