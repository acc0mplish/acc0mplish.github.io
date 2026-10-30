import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({root:'block-runtime',base:'./',plugins:[react(),tailwindcss()],server:{fs:{allow:['..']}},build:{outDir:'../build',emptyOutDir:true}});
