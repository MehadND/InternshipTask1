import Navbar from "./components/navbar/navbar";
import Login from "./components/navbar/login";
import NotFound from "./components/not-found";
import TodoApp from "./components/todo-app";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
