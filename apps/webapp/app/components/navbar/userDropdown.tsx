"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, DarkThemeToggle, Dropdown } from "flowbite-react";

export function UserDropdown() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) return <AvatarSkeleton />;

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <img
          className="h-10 w-10 rounded-full"
          src={user?.picture}
          alt={user?.name}
          referrerPolicy="no-referrer"
        />
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{user?.name}</span>
        <span className="block truncate text-sm font-medium">
          {user?.email}
        </span>
      </Dropdown.Header>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>
        <DarkThemeToggle />
        Tema
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        onClick={() =>
          logout({ logoutParams: { returnTo: "http://localhost:3000" } })
        }
      >
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
}

function AvatarSkeleton() {
  return (
    <div role="status" className="animate-pulse">
      <svg
        className="me-4 size-8 text-gray-200 dark:text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
