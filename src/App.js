import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {Home} from "./pages/home";
import {CharacterProfile} from "./pages/character-profile";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/character-profile/:name" component={CharacterProfile} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
