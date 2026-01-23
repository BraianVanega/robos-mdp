"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/assets/logo.jpg"
              alt="robos-mdp"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://instagram.com/robos.mdp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">@robos.mdp</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} robos-mdp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
