App.js (BrowserRouter, Route, Switch)

Home
    Wether it is login or not, be there with login or not login data
Dashboard
    If not login on Dashboard redirect to login
Login
    After login success redirect to dashboard

App
    For all component, load login data on componentDidMount
        Pages to be redirected only after receiving of login data
    Share login data in props in all 3 component
    Main state is a part of App parent of all 3

