import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Feed from "./components/Feed";
import About from "./components/About";
import Profile from "./components/Profile";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/about" component={About} />
            <PrivateRoute exact path="/feed" component={Feed} />
            <PrivateRoute exact path="/profile/:id" component={Profile} />
          </Switch>
        </div>
      </HashRouter>
    </Provider>
  );
}

export default App;
