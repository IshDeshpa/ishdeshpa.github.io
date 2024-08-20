
import './scss/index.scss';
import MyNavbar from './components/navbar/Navbar';
import MyJumbotron from './components/jumbotron/Jumbotron';
import MyBlog from './components/pages/Blog';

function App() {
  return (
    <>
      <MyNavbar />
      <MyJumbotron />
      <MyBlog />
    </>
  )
}

export default App
