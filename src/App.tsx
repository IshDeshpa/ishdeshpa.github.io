
import './scss/index.scss';
import MyNavbar from './components/navbar/Navbar';
import MyJumbotron from './components/jumbotron/Jumbotron';
import MyBlog from './components/pages/Blog';
import MyExperience from './components/pages/Experience';

function App() {
  return (
    <>
      <MyNavbar />
      <MyJumbotron />
      <MyExperience />
      <MyBlog />
    </>
  )
}

export default App
