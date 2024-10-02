/* eslint-disable */
import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from '@mui/icons-material/Group';
import "@chatscope/chat-ui-kit-styles/themes/default/main.scss";
import ChatIcon from '@mui/icons-material/Chat';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import "../../css/app.css";
function Layout({ children }) {
  const { collapseSidebar } = useProSidebar();
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div className='row w-100 '>
      </div>
      <div style={({ height: "90vh" }, { display: "flex" })}>
        <Sidebar collapsed={collapsed} style={{ minHeight: "90vh" }}>
          <Menu>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              style={{ textAlign: "center" }}
            >
              {" "}
             <img src="https://cdn.bitrix24.com/b15917383/landing/965/965caaa6885d393138add44f2d57cd50/logo_text_1x.png"  className='img-fluid' style={{height: "40px"}} alt="" />
            </MenuItem>
            <SubMenu label="Tài khoản" className='rounded border-2' icon={<GroupIcon />}>
            <a href={'/admin/permissions'}> <MenuItem icon={<GroupIcon />}>Quyền tài khoản</MenuItem></a>
           <a href={'/admin/roles'}> <MenuItem icon={<GroupIcon />}>Loại tài khoản</MenuItem></a>
           <a href={'/admin/users'}> <MenuItem icon={<GroupIcon />}>Tài khoản</MenuItem></a>
            </SubMenu>

            <SubMenu label="Products" className='rounded border-2' icon={<CategoryIcon />}>
            <a href={'/admin/brands'}> <MenuItem icon={<CategoryIcon />}>Thương hiệu</MenuItem></a>
           <a href={'/admin/categories'}> <MenuItem icon={<CategoryIcon />}>Loại sản phẩm</MenuItem></a>
           <SubMenu label="Sản phẩm" className='rounded border-2' icon={<Inventory2Icon />}>
            <a href={'/admin/products/create'}> <MenuItem icon={<CategoryIcon />}>Tạo sản phẩm</MenuItem></a>
           <a href={'/admin/products'}> <MenuItem icon={<Inventory2Icon />}>Sản phẩm</MenuItem></a>
            </SubMenu>
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