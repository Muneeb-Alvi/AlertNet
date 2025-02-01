"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/");
  };

  return (
    <div className='flex flex-col bg-background'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <Link href='/' className='text-primary hover:underline mb-8 inline-block'>
            ← Back to Home
          </Link>
          <h1 className='text-3xl font-bold mb-8 text-foreground'>
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-1 text-foreground'>
                Email
              </label>
              <input
                type='email'
                id='email'
                required
                className='w-full p-2 border rounded bg-input text-foreground'
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-1 text-foreground'>
                Password
              </label>
              <input
                type='password'
                id='password'
                required
                className='w-full p-2 border rounded bg-input text-foreground'
              />
            </div>
            <Button type='submit' className='w-full'>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <p className='mt-4 text-center text-muted-foreground'>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className='text-primary hover:underline'>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
