import React from "react";
import logo from "../images/logo.png";
import user from "../images/group-icon.png";
import whiteboard from "../images/white-board.png";

function Nav(){
    return(
            <div className="nav">
              <ul>
                  <li><img src = {user} className="user-img"/></li>
                  <li><img src = {whiteboard} className="whiteboard-img"/></li>
              </ul>
            </div>
    )
}

export default Nav;
