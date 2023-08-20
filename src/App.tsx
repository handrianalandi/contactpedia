import "./App.css";
import ContactListContainer from "./Pages/ContactListContainer";
import { Route, Routes } from "react-router-dom";
import {Container} from "react-bootstrap";
import ContactDetailContainer from "./Pages/ContactDetailContainer";

function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<ContactListContainer />} />
        <Route path="/:id" element={<ContactDetailContainer />} />
      </Routes>
    </Container>
  );
}

export default App;
