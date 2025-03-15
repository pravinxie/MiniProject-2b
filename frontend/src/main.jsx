import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from '../Layout.jsx'
import HomePage from './HomePage/HomePage.jsx'
import Feature1 from './Feature1/Feature1.jsx'
import LoginPage from './LoginPage/LoginPage.jsx'
import SignupPage from './SignupPage/SignupPage.jsx'
import FindDoctorsNearMe from './FindDoctorsNearMe/FindDoctorsNearMe.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<HomePage/>} />
      <Route path='login' element={<LoginPage/>} />
      <Route path='one' element={<Feature1/>} />
      <Route path='signup' element={<SignupPage/>} />
      <Route path='FindDoctorsNearMe' element={<FindDoctorsNearMe/>} />
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

