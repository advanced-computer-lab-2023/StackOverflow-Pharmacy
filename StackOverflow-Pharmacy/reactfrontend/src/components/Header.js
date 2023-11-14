import React from 'react';

const Header = () => {
  return (
    <header className="header"> {/* Apply the styles */}
      <nav>
        <ul className="nav">
          <li className="navItem">
            <a href="/" className="navLink">Pharmacy</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
