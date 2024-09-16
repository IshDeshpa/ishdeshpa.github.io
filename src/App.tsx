
import './scss/index.scss';
import MyNavbar from './components/navbar/Navbar';
import MyJumbotron from './components/jumbotron/Jumbotron';
import MyBlog from './components/pages/Blog';
import MyExperience from './components/pages/Experience';
import MyResume from './components/pages/Resume';

function App() {
  return (
    <>
      <MyNavbar />
      <MyJumbotron />
      <MyResume />
      <MyExperience />  
      <MyBlog />
    </>
  )
}

export default App
