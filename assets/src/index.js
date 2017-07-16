import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {AddEvents as sockAddEvents} from "./actions/socket";
import reducer from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
);


const socket = io('http://localhost:5000');
sockAddEvents({socket,dispatch:store.dispatch});

ReactDOM.render( <Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
