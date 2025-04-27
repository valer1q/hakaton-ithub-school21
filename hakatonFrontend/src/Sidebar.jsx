import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar_ul">
        <li className="sidebar_li">
          <Link to="/" className="sidebar_a">Main page</Link>
        </li>
        <li className="sidebar_li">
          <Link to="/statistics" className="sidebar_a">Statistics</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;