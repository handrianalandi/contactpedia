import ContactListContainer from "./Pages/ContactListContainer";
import { Route, Routes } from "react-router-dom";
import {Container} from "react-bootstrap";
import ContactDetailContainer from "./Pages/ContactDetailContainer";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import styled from "@emotion/styled";

const ToastifyContainer = styled(ToastContainer)`
  padding: 10px;
  margin-bottom: 10px;
  & .Toastify__toast{
    border-radius: 15px;
    margin-bottom: 10px;
  }
`

function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<ContactListContainer />} />
        <Route path="/contact/:id" element={<ContactDetailContainer />} />
      </Routes>
      <ToastifyContainer />
    </Container>
  );
}

export default App;
