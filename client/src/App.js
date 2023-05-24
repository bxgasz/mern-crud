import { Route, Routes } from "react-router-dom";
import Layout from './component/Layout'
import Public from "./component/Public";
import Dashboard from "./component/Dashboard";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import PreFetch from "./features/auth/PreFetch";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle('MERN APP')
  
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Public />}/>
        <Route path="login" element={<Login />}/>


        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
            <Route element={<PreFetch/>}>
              <Route path="dash" element={<Dashboard/>}>

                <Route index element={<Welcome/>}/>

                <Route path="notes">
                  <Route index element={<NotesList/>}/>
                  <Route path=":id" element={<EditNote />}/>
                  <Route path="new" element={<NewNote />}/>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]}/>}>
                  <Route path="users">
                    <Route index element={<UsersList/>}/>
                    <Route path=":id" element={<EditUser />}/>
                    <Route path="new" element={<NewUserForm />}/>
                  </Route>
                </Route>

              </Route>
            </Route>
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
