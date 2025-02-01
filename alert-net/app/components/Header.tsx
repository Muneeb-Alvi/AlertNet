"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border'>
      <div className='container mx-auto flex justify-between items-center h-16 px-4'>
        <Link href='/' className='flex items-center space-x-2'>
          <Bell className='h-6 w-6 text-primary' />
          <span className='text-xl font-bold text-foreground'>AlertNet</span>
        </Link>

        <nav className='hidden md:flex items-center space-x-8'>
          <button
            onClick={() => scrollToSection("features")}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
          >
            About
          </button>

          {isLoggedIn ? (
            <>
              <Link href='/create-alert'>
                <Button variant='secondary'>Create Alert</Button>
              </Link>
              <Button onClick={logout} variant='ghost'>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href='/login'>
                <Button variant='ghost'>Log in</Button>
              </Link>
              <Link href='/login'>
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
