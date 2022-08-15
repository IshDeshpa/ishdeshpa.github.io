import * as React from 'react'
import Header from '../components/header'
import {graphql, useStaticQuery } from "gatsby"
import '../custom.scss';

//const shortcodes = {Jumbo}

const Layout = ({children}) => {
	const q = useStaticQuery(graphql`
		query{	
			allMdx(sort: {fields: frontmatter___index, order: ASC}) {
				edges {
					node {
						frontmatter {
							title
							path
							index
						}
					}
				}
			}
			site{
				siteMetadata{
					title
				}
			}
		}
	`)



	return (
		<React.Fragment>
			<Header menuLinks={q.allMdx.edges} siteTitle={q.site.siteMetadata.title}/>
			<main>
				{children}
			</main>
		</React.Fragment>
	)
}

export default Layout