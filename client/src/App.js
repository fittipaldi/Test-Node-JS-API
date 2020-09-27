import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Stories from './componentes/Stories';
import NotFound from './componentes/NotFound';

function App(props) {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Stories}/>
                <Route exact path="/story/:id" component={Stories}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        </Router>
    );
}

export default App;
