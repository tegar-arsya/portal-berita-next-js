"use client";
import React, { useState } from "react";
import axios from "axios";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconRowInsertBottom } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "../../components/footer";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TambahBerita = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<FileList | null>(null);
  const [content, setContent] = useState("");
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !image || !content) {
      console.error("All fields are required");
      return; // Handle error
    }

    const formData = new FormData();
    formData.append("title", title);
    Array.from(image).forEach((image) => {
      formData.append("images", image);
    });
    formData.append("content", content);

    try {
      const token = localStorage.getItem("token");
      console.log("FormData sebelum dikirim:", Array.from(formData.entries()));
      await axios.post("/api/news/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berita berhasil diunggah',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/user/dashboard');
      });

    } catch (error) {
      console.error("Failed to post news:", error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal mengunggah berita',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full">
      <h1 className="text-2xl font-bold">Tambah Berita</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
            placeholder="Masukkan judul berita"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Gambar
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-neutral-700 dark:file:text-neutral-200 dark:hover:file:bg-neutral-600"
            multiple
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Naskah Berita
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
            config={{
              ckfinder: {
                uploadUrl: '/api/uploads'  // Endpoint untuk mengunggah gambar
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export function PostBerita() {
  const router = useRouter();  // Initialize router
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">LOADING</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Or redirect to login if needed
  }
  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');

    // Redirect to login page and replace the current URL
    window.location.replace('/');
  };

  const links = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Post Berita",
      href: "/user/postberita",
      icon: (
        <IconRowInsertBottom className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Daftar Berita",
      href: "/user/daftarberita",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex flex-1 flex-col h-full">
          <TambahBerita />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default PostBerita;
