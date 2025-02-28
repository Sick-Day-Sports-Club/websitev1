import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2c2c2c] text-white py-12 text-center">
      <div className="container">
        <div className="mb-6 flex justify-center flex-wrap gap-8">
          <Link href="#" className="text-white hover:text-gray-300">
            About Us
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            For Guides
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Contact
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Privacy Policy
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Doctor&apos;s Notes
          </Link>
        </div>
        <div className="text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Sick Day Sports Club. All rights reserved. We won&apos;t tell your boss. Unless your boss is Yvon &ndash; in which case you should probably be surfing right now.</p>
        </div>
      </div>
    </footer>
  );
} 