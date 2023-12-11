import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import { MENUITEMS } from "./Menu";

const SidebarMenuItems = ({ setMainMenu, sidebartoogle, setNavActive, activeClass }) => {
  const { layout } = useContext(CustomizerContext);
  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  // const id = window.location.pathname.split("/").pop();
  // const layoutId = id;
  const CurrentPath = window.location.pathname;

  const toggletNavActive = (item) => {
    if (window.innerWidth <= 991) {
      document.querySelector(".page-header").className = "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon ";
      // document.querySelector('.mega-menu-container').classList.remove('d-block');
      if (item.type === "sub") {
        document.querySelector(".page-header").className = "page-header";
        document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper";
      }
    }
    if (!item.active) {
      MENUITEMS().map((a) => {
        a.Items.filter((Items) => {
          if (a.Items.includes(item)) Items.active = false;
          if (!Items.children) return false;
          Items.children.forEach((b) => {
            if (Items.children.includes(item)) {
              b.active = false;
            }
            if (!b.children) return false;
            b.children.forEach((c) => {
              if (b.children.includes(item)) {
                c.active = false;
              }
            });
          });
          return Items;
        });
        return a;
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS() });
  };

  return (
    <>
      {MENUITEMS().map((Item, i) => (
        <Fragment key={i}>
          <li className="sidebar-main-title">
            <div>
              <h6 className="lan-1" >{(Item.menutitle)}</h6>
            </div>
          </li>
          {Item.Items.map((menuItem, i) => (
            <li className="sidebar-list" key={i}>
              {menuItem.type === "sub" ? (
                <a
                  href="javascript"
                  className={`sidebar-link sidebar-title ${CurrentPath.includes(menuItem.title.toLowerCase()) ? "" : ""} ${menuItem.active && "active"}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setNavActive(menuItem);
                    activeClass(menuItem.active);
                  }}>
                  
                   <i className= {`icofont  ${menuItem.icon}`  }></i> &nbsp; 
                  <span >{(menuItem.title)}</span>
                  {menuItem.badge ? <label className={menuItem.badge}>{menuItem.badgetxt}</label> : ""}
                  <div className="according-menu">{menuItem.active ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-right"></i>}</div>
                </a>
              ) : (
                ""
              )}

              {menuItem.type === "link" ? (
                <Link to={menuItem.path } className={`sidebar-link sidebar-title link-nav  ${CurrentPath.includes(menuItem.title.toLowerCase()) ? "" : ""}`} onClick={() => toggletNavActive(menuItem)} style={{ textDecoration: 'none' }}>
               
                 <i className= {`icofont  ${menuItem.icon}`  } style={{fontSize : '18px'}}></i> &nbsp; 
                  <span>{(menuItem.title)}</span>
                  {menuItem.badge ? <label className={menuItem.badge}>{menuItem.badgetxt}</label> : ""}
                </Link>
              ) : (
                ""
              )}

              {menuItem.children ? (
                <ul className="sidebar-submenu" style={layout1 !== "compact-sidebar compact-small" ? (menuItem?.active || CurrentPath.includes(menuItem?.title?.toLowerCase()) ? (sidebartoogle ? { opacity: 1, transition: "opacity 500ms ease-in" } : { display: "block" }) : { display: "none" }) : { display: "none" }}>
                  {menuItem.children.map((childrenItem, index) => {
                    return (
                      <li key={index}>
                        {childrenItem.type === "sub" ? (
                          <a
                            href="javascript"
                            className={`${CurrentPath.includes(childrenItem?.title?.toLowerCase()) ? "active" : ""}`}
                            // className={`${childrenItem.active ? 'active' : ''}`}
                            onClick={(event) => {
                              event.preventDefault();
                              toggletNavActive(childrenItem);
                            }}>
                            {(childrenItem.title)}
                            <span className="sub-arrow">
                              <i className="fa fa-chevron-right"></i>
                            </span>
                            <div className="according-menu">{childrenItem.active ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-right"></i>}</div>
                          </a>
                        ) : (
                          ""
                        )}

                        {childrenItem.type === "link" ? (
                          <Link
                            to={childrenItem.path}
                            className={`${CurrentPath.includes(childrenItem?.title?.toLowerCase()) ? "active" : ""}`}
                            // className={`${childrenItem.active ? 'active' : ''}`} bonusui
                            onClick={() => toggletNavActive(childrenItem)}>
                            {(childrenItem.title)}
                          </Link>
                        ) : (
                          ""
                        )}

                        {childrenItem.children ? (
                          <ul className="nav-sub-childmenu submenu-content" style={CurrentPath.includes(childrenItem?.title?.toLowerCase()) || childrenItem.active ? { display: "block" } : { display: "none" }}>
                            {childrenItem.children.map((childrenSubItem, key) => (
                              <li key={key}>
                                {childrenSubItem.type === "link" ? (
                                  <Link
                                    to={childrenSubItem.path}
                                    className={`${CurrentPath.includes(childrenSubItem?.title?.toLowerCase()) ? "active" : ""}`}
                                    // className={`${childrenSubItem.active ? 'active' : ''}`}
                                    onClick={() => toggletNavActive(childrenSubItem)}>
                                    {(childrenSubItem.title)}
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </li>
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default SidebarMenuItems;
