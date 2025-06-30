"use client";
import React, { useState } from "react";
import { Menu, X, Home, Users, BookOpen } from "lucide-react";
import Link from "next/link";
const NavbarSidebar = ({ classnames }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${classnames} transition-all`}>
      {open ? (
        <X onClick={() => setOpen(false)} className="cursor-pointer" />
      ) : (
        <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
      )}
      <div
        className={`absolute top-0 left-0 z-10 h-screen flex flex-col items bg-white border-gray-300 border space-x-4 opacity-0 -translate-x-10 ${
          open ? "animate-fade-in-left" : "animate-fade-out-left"
        }`}
      >
        <X onClick={() => setOpen(false)} className="cursor-pointer h-16 ml-8" />
        <Link
          href="/"
          className="flex items-center  rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Link>
        <Link
          href="/users"
          className="flex items-center rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
        >
          <Users className="w-4 h-4 mr-2" />
          Users
        </Link>
        <Link
          href="/topic"
          className="flex items-center rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Topics
        </Link>
      </div>
    </div>
  );
};

export default NavbarSidebar;
