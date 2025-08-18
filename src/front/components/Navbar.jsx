import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar bg-body-tertiary fixed-top">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">Time Tidy</Link>


				<button
					className="navbar-toggler"
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
					<div className="offcanvas-header">
						<h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
						<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>

					<div className="offcanvas-body">
						<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
							<li className="nav-item">
								<Link className="nav-link active" to="/">Home</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/profile">Profile</Link> 
							</li>
							<li className="nav-item dropdown">
								<a
									className="nav-link dropdown-toggle"
									href="#"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Navigate
								</a>
								<ul className="dropdown-menu">
									<li><Link className="dropdown-item" to="/goals">Goals</Link></li>
									<li><Link className="dropdown-item" to="/calendar">Calendar</Link></li>
									<li><Link className="dropdown-item" to="/friends">Friends</Link></li>
									<li>
										<hr className="dropdown-divider" />
									</li>
									<li><Link className="dropdown-item" to="/settings">Settings</Link></li>
									<li><Link className="dropdown-item" to="/support">Support</Link></li>
								</ul>
							</li>
						</ul>
						<form className="d-flex mt-3" role="search">
							<input
								className="form-control me-2"
								type="search"
								placeholder="Search"
								aria-label="Search"
							/>
							<button className="btn btn-outline-success" type="submit">Search</button>
						</form>
					</div>
				</div>
			</div>
		</nav>
	);
};
