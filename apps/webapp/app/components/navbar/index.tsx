"use client";

import { Navbar } from "flowbite-react";
import { UserDropdown } from "./userDropdown";
import { Searchbar } from "./searchbar";

export default function AppNavbar() {
  return (
    <Navbar fluid>
      <Navbar.Brand href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          OnePlace
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <UserDropdown />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {/* <Searchbar /> */}
      </Navbar.Collapse>
    </Navbar>
  );
}
