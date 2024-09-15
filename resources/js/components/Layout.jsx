/* eslint-disable */
import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from '@mui/icons-material/Group';

import ChatIcon from '@mui/icons-material/Chat';
import "../../css/app.css";
function Layout({ children }) {
  const { collapseSidebar } = useProSidebar();
  return (
    <>
      <div className='row w-100'>
      </div>
      <div style={({ height: "90vh" }, { display: "flex" })}>
        <Sidebar style={{ minHeight: "90vh" }}>
          <Menu>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={() => {
                collapseSidebar();
              }}
              style={{ textAlign: "center" }}
            >
              {" "}
              <h2>Admin</h2>
            </MenuItem>
            <SubMenu label="Tài khoản" icon={<GroupIcon />}>
            <a href={'/admin/permissions'}> <MenuItem icon={<GroupIcon />}>Quyền tài khoản</MenuItem></a>
           <a href={'/admin/roles'}> <MenuItem icon={<GroupIcon />}>Loại tài khoản</MenuItem></a>
           <a href={'/admin/users'}> <MenuItem icon={<GroupIcon />}>Tài khoản</MenuItem></a>
            </SubMenu>
            <Menu>
              <a href="/chat"><MenuItem icon={<ChatIcon />}>Chat</MenuItem></a>
            </Menu>
            <Menu>
              <a href="/logout"><MenuItem icon={<GroupIcon />}>Logout</MenuItem></a>
            </Menu>
          </Menu>
        </Sidebar>
        <main className='p-4 w-100'>
          {children}
        </main>
      </div>

    </>
  )
}

export default Layout