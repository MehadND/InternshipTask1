import Navbar from "./components/navbar";
import Login from "./components/todo-app/login";
import NotFound from "./components/todo-app/not-found";
import TodoApp from "./components/todo-app/todo-app";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
