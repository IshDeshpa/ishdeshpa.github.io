
import './scss/index.scss';
import MyNavbar from './components/navbar/Navbar';

function App() {
  return (
    <>
      <MyNavbar />
      <div className="container">
        <h1>Welcome to my app</h1>
        <p>This is a simple app using React and Bootstrap</p>
      </div>
    </>
  )
}

export default App
