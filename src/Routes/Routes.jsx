// react
import { Routes, Route } from "react-router-dom";

// components
import { Generator } from "../Pages/Pages";

export function AppRoutes() {
    return (
        <Routes>
            <Route path='/gerador-carteirinha/generator' element={<Generator/>}/>
        </Routes>
    )
}