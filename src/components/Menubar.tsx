// define a typescript functional compoonent called Menubar which takes
// three props: name, logo, and navItems. The Menubar component should
// return a div element with a class name of "menubar" and three children:
// a div element with a class name of "logo" and an img element with a src
// attribute set to the value of the logo prop, a h2 element with the text
// content of the name prop, and a ul element with a class name of "nav-items".

import React from 'react'

type MenubarProps = {
  name: string
  logo: string
  navItems: string[]
}

const Menubar: React.FC<MenubarProps> = ({ name, logo, navItems }) => {
  return (
    <div className="menubar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <h2>{name}</h2>
      <ul className="nav-items">
        {navItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default Menubar