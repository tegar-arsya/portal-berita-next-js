// components/Footer.tsx

'use client';
import Image from 'next/image'
const Footer = () => {
  return (
    <footer className="bg-red-600 p-4">
      <div className="container mx-auto text-center text-white flex justify-between">
        <p>
          &copy; {new Date().getFullYear()} PPID PROVINSI JAWA TENGAH. All rights reserved.
        </p>
        {/* <Image src="/image.png" alt="Logo" width={100} height={8} /> */}
      </div>
    </footer>
  );
};

export default Footer;

