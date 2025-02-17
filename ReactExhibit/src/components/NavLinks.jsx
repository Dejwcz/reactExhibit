import { Link, useLocation } from "react-router-dom";

const NavLinks = ({ navButtons, onLinkClick }) => {
  return (
    <ul className="navbar-nav w-100 d-flex justify-content-center">
      {navButtons.map((button) => (
        <li className="nav-item" key={button.id}>
          <Link
            className={`nav-link btn btn-outline-primary border border-2 d-flex justify-content-center ${
              location.pathname === button.path ? "active" : ""
            }`}
            to={button.path}
            onClick={onLinkClick}
            aria-current={
              location.pathname === button.path ? "page" : undefined
            }
          >
            {button.name}
          </Link>
        </li>
      ))}
      <li className="nav-item">
        <div className="">
          <a
            href="https://x213.cz"
            className="nav-link btn btn-outline-primary border border-2 ms-lg-5"
          >
            🔙 Back to x213.cz
          </a>
        </div>
      </li>
    </ul>
  );
};

export default NavLinks;
