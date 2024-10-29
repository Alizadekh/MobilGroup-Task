import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../assets/img/Logo.png";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoPeopleCircleOutline } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <div className="sidebar_content">
        <div className="sidebar_logo">
          <Link to="/customer">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div>
          <ul>
            <li>
              <Link to="/user">
                <RiAccountCircleLine /> <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/customer">
                <IoPeopleCircleOutline />
                <span>Customers</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
