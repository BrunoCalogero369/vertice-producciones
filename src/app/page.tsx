"use client"; // Necesario para Framer Motion

import Image from "next/image";
import { motion } from "framer-motion";

export default function Page() {
  // Variantes para la animación de entrada
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. Header con Logo Principal - Se mantiene igual */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="p-6 flex justify-center md:justify-start"
      >
        <div className="relative w-[120px] h-[40px] md:w-[150px] md:h-[50px]">
          <Image 
            src="/logo.png" 
            alt="VERTICE LOGO" 
            fill
            className="object-contain"
            priority 
          />
        </div>
      </motion.nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-10 md:py-16">
        
        {/* 2. Imagen VERTICE3 (PNG Transparente) - Agrandada */}
        <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
  variants={fadeInUp}
  className="relative w-[95%] max-w-[800px] aspect-square md:aspect-[16/9] mb-4"
>
  <Image 
    src="/vertice3.png" 
    alt="VERTICE INFO 1" 
    fill
    className="object-contain"
    priority
  />
</motion.div>

        {/* 3. Imagen VERTICE4 (JPEG con Fondo) - Agrandada y Ajustada */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          variants={fadeInUp}
          className="relative w-full max-w-[650px] aspect-[16/9] md:aspect-[4/3] mb-12 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50"
        >
          <Image 
            src="/complejo.jpeg" 
            alt="VERTICE INFO 2" 
            fill
            className="object-cover"
          />
          {/* Un degradado sutil encima del JPEG para que integre mejor con el fondo dark */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 to-transparent" />
        </motion.div>
      </main>

      {/* 4. Sección Ubicación con animación - Sin cambios */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        variants={fadeInUp}
        className="p-6 pb-20"
      >
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 tracking-widest text-violet-400">UBICACIÓN</h3>
            <p className="text-zinc-300 text-sm mb-6">Laprida 4454, Tortuguitas, Bs.As.</p>
            
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Laprida+4454+Tortuguitas" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-tighter active:scale-95 transition-all shadow-lg shadow-violet-500/20"
            >
              CÓMO LLEGAR
            </a>
          </div>
        </div>
      </motion.section>

      <footer className="py-6 text-center text-xs text-zinc-600 border-t border-zinc-900 mt-auto">
        © {new Date().getFullYear()} VÉRTICE
      </footer>
    </div>
  );
}