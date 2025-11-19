import React from "react";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export function Header() {
  return (
    <header className="ocean-header" role="banner">
      <span style={{ color: theme.primary }} aria-hidden="true">
        <svg height={30} width={30} style={{marginRight:8,verticalAlign:"middle"}} viewBox="0 0 25 25" fill="none"><ellipse cx="12.5" cy="12.5" rx="12" ry="12.5" fill={theme.primary} strokeWidth="1.5"/><rect width="12" height="3.5" x="6.5" y="8.5" rx="1.5" fill={theme.secondary}/><rect width="12" height="3.5" x="6.5" y="13" rx="1.5" fill="#fff"/></svg>
      </span>
      <span style={{color:theme.text}}>Ocean Notes</span>
    </header>
  );
}
