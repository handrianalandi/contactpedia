import "./App.css";
import ContactListContainer from "./Pages/ContactListContainer";
import { Route, Routes } from "react-router-dom";
import {Container} from "react-bootstrap";

function App() {
  return (
    // <ContactListContainer />
    <Container>
      <Routes>
        <Route path="/" element={<ContactListContainer />} />
      </Routes>
    </Container>
  );
}

export default App;
