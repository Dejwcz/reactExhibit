import { Link, useLocation } from "react-router-dom";
import buttonsList from "../buttonsList.json";
import Icons from "../components/Icons";
import NavLinks from "../components/NavLinks";
import { useRef } from "react";

const Navbar = ({ onButtonClick }) => {
  const navButtons = buttonsList.buttons;
  const location = useLocation();
  const collapseRef = useRef(null);

  const closeNavbar = () => {
    if (collapseRef.current) {
      const bsCollapse = Collapse.getInstance(collapseRef.current);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        new Collapse(collapseRef.current, { toggle: false }).hide();
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" role="navigation">
      <div className="container-fluid ">
        {/* icons */}
        <Icons />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Open navigation menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          ref={collapseRef}
          className="collapse navbar-collapse "
          id="navbarNav"
        >
          <NavLinks navButtons={navButtons} onLinkClick={closeNavbar} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
