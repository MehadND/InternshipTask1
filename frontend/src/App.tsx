import Navbar from "./components/navbar";
import InfiniteScrollComponent from "./components/todo-app/infinite-scrolling-view";
import TodoApp from "./components/todo-app/todo-app";

function App() {
  return (
    <>
      <Navbar />
      <TodoApp />
      {/* <InfiniteScrollComponent /> */}
    </>
  );
}

export default App;
