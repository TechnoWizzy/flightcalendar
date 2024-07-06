import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./index.css";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ReactRouter6Adapter} from "use-query-params/adapters/react-router-6";
import { QueryParamProvider } from 'use-query-params';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryParamProvider adapter={ReactRouter6Adapter}>
                <Routes>
                    <Route path="/" element={<App />}/>
                </Routes>
            </QueryParamProvider>
        </BrowserRouter>
    </React.StrictMode>
);