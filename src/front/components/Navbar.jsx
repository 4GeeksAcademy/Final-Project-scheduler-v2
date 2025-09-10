import { useContext } from "react";
import { Link } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext.jsx";
import TimeTidyLogoImageUrl from "../assets/img/updatedLogoCropped.png";

export const Navbar = () => {
  const { userID, searchbar, setSearchbar, setFromNavbar } = useContext(NavbarContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={TimeTidyLogoImageUrl}
            alt="Time Tidy"
            style={{ maxHeight: "45px", objectFit: "contain" }}
          />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title fw-bold text-primary" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav ms-lg-auto justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/">Home</Link>
              </li>

              {/* Always show My Profile; route depends on auth */}
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to={userID ? `/profile/${userID}` : "/profile"}
                >
                  My Profile
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fw-semibold"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Navigate
                </a>
                <ul className="dropdown-menu shadow-sm rounded-3 border-0">
                  {userID && (
                    <li><Link className="dropdown-item" to="/goals">My Goals</Link></li>
                  )}
                  {userID && (
                    <li><Link className="dropdown-item" to={`/eventlist/${userID}`}>My Events</Link></li>
                  )}
                  {userID && (
                    <li><Link className="dropdown-item" to="/favoritesList">My Friends</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                </ul>
              </li>
            </ul>

            <form className="d-flex mt-3 mt-lg-0 ms-lg-3" role="search">
              <input
                className="form-control rounded-pill me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchbar}
                onChange={(e) => setSearchbar(e.target.value)}
              />
              <Link to="/search" onClick={() => setFromNavbar(true)}>
                <button
                  type="button"
                  className="btn rounded-pill px-4"
                  style={{ backgroundColor: "#7FC1E0", color: "white" }}
                >
                  Search
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};
