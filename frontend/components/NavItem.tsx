import Link from "next/link";
import * as React from "react";

type Props = {
  href: string;
  isActive: boolean;
};

const NavItem: React.FC<Props> = ({ href, isActive, children }) => {
  return (
    <li className="align-text-bottom bg-white">
      <Link href={href}>
        <a
          className={`block  ${isActive ? "bg-amber-100 text-amber-700" : ""}`}
        >
          {children}
        </a>
      </Link>
    </li>
  );
};

export default NavItem;
