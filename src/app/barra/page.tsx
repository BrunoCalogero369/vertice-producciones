"use client";

import { useState, useEffect } from "react";

// 1. CARTA EXACTA SEGÚN IMG_8138.jpg
const CATEGORIAS = ["Sin Alcohol", "Cervezas", "Tragos", "Combos", "Botellas"];

const PRODUCTOS = [
  // SIN ALCOHOL
  { id: "sa1", nombre: "Agua", precio: 10000, cat: "Sin Alcohol" },
  { id: "sa2", nombre: "Speed", precio: 10000, cat: "Sin Alcohol" },
  { id: "sa3", nombre: "Vaso Coca", precio: 10000, cat: "Sin Alcohol" },
  { id: "sa4", nombre: "Coca Cola 2.25 L", precio: 25000, cat: "Sin Alcohol" },
  { id: "sa5", nombre: "Baggio 1 L", precio: 20000, cat: "Sin Alcohol" },
  { id: "sa6", nombre: "Tonica 2.25 L", precio: 20000, cat: "Sin Alcohol" },

  // CERVEZAS
  { id: "ce1", nombre: "Budweiser", precio: 10000, cat: "Cervezas" },
  { id: "ce2", nombre: "Corona", precio: 15000, cat: "Cervezas" },

  // TRAGOS (Agregué los 2x como atajos rápidos para la caja)
  { id: "tr1", nombre: "Fernet", precio: 20000, cat: "Tragos" },
  { id: "tr1_2", nombre: "2x Fernet", precio: 30000, cat: "Tragos" },
  { id: "tr2", nombre: "Vodka Smirnoff", precio: 20000, cat: "Tragos" },
  { id: "tr2_2", nombre: "2x Vodka Smirnoff", precio: 30000, cat: "Tragos" },
  { id: "tr3", nombre: "Vodka Absolut", precio: 30000, cat: "Tragos" },
  { id: "tr3_2", nombre: "2x Vodka Absolut", precio: 40000, cat: "Tragos" },
  { id: "tr4", nombre: "Gin Beefeater", precio: 20000, cat: "Tragos" },
  { id: "tr4_2", nombre: "2x Gin Beefeater", precio: 30000, cat: "Tragos" },
  { id: "tr5", nombre: "Red Label c/speed", precio: 30000, cat: "Tragos" },
  { id: "tr5_2", nombre: "2x Red Label c/speed", precio: 40000, cat: "Tragos" },

  // COMBOS
  { id: "co1", nombre: "Combo Chandon", precio: 80000, cat: "Combos" },
  { id: "co2", nombre: "Combo Baron B", precio: 120000, cat: "Combos" },
  { id: "co3", nombre: "Combo Fernet", precio: 90000, cat: "Combos" },
  { id: "co4", nombre: "Combo Smirnoff", precio: 80000, cat: "Combos" },
  { id: "co5", nombre: "Combo Absolut", precio: 120000, cat: "Combos" },
  { id: "co6", nombre: "Combo Jagermeister", precio: 110000, cat: "Combos" },
  { id: "co7", nombre: "Combo Red Label", precio: 110000, cat: "Combos" },
  { id: "co8", nombre: "Combo Black Label", precio: 160000, cat: "Combos" },
  { id: "co9", nombre: "Combo Jack Daniels Apple", precio: 160000, cat: "Combos" },

  // BOTELLAS
  { id: "bo1", nombre: "Botella Nuvo", precio: 300000, cat: "Botellas" },
  { id: "bo2", nombre: "Botella Grey Goose", precio: 300000, cat: "Botellas" },
];

type ItemCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

type Venta = {
  id: string;
  hora: string;
  detalle: string;
  precioTotal: number;
  metodo: "Efectivo" | "Transferencia" | "Tarjeta";
};

export default function BarraPOS() {
  const [ventas, setVentas] = useState<Venta[]>(() => {
    if (typeof window !== "undefined") {
      const guardadas = localStorage.getItem("vertice_ventas");
      if (guardadas) {
        try {
          return JSON.parse(guardadas);
        } catch (e) {
          console.error("Error al leer localStorage", e);
        }
      }
    }
    return [];
  });

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  useEffect(() => {
    localStorage.setItem("vertice_ventas", JSON.stringify(ventas));
  }, [ventas]);

  const agregarAlCarrito = (producto: typeof PRODUCTOS[0]) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id: string, delta: number) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCant = item.cantidad + delta;
            return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
          }
          return item;
        })
        .filter(Boolean) as ItemCarrito[]
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalOrden = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const registrarCobro = (metodo: "Efectivo" | "Transferencia" | "Tarjeta") => {
    if (carrito.length === 0) return;

    const detalleTexto = carrito.map((i) => `${i.cantidad}x ${i.nombre}`).join(", ");
    const ahora = new Date();

    const nuevaVenta: Venta = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(ahora.getTime()),
      hora: ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      detalle: detalleTexto,
      precioTotal: totalOrden,
      metodo,
    };

    setVentas((prev) => [nuevaVenta, ...prev]);
    setCarrito([]);
    setMostrarModalPago(false);
  };

  const eliminarVenta = (id: string) => {
    if (confirm("¿Borrar este ticket del historial?")) {
      setVentas(ventas.filter((v) => v.id !== id));
    }
  };

  const totalGeneral = ventas.reduce((acc, v) => acc + v.precioTotal, 0);
  const totalEfectivo = ventas.filter((v) => v.metodo === "Efectivo").reduce((acc, v) => acc + v.precioTotal, 0);
  const totalTransf = ventas.filter((v) => v.metodo === "Transferencia").reduce((acc, v) => acc + v.precioTotal, 0);
  const totalTarjeta = ventas.filter((v) => v.metodo === "Tarjeta").reduce((acc, v) => acc + v.precioTotal, 0);

  const descargarCSV = () => {
    const headers = "Hora,Detalle Pedido,Total,Metodo\n";
    const rows = ventas.map((v) => `${v.hora},"${v.detalle}",${v.precioTotal},${v.metodo}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caja-vertice-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6 flex flex-col gap-6 font-sans select-none">
      
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-violet-500 tracking-wider">VERTICE • POS BARRA</h1>
          <p className="text-xs text-zinc-400">Control de Caja en Vivo</p>
        </div>
        <button
          onClick={descargarCSV}
          className="bg-zinc-800 hover:bg-zinc-700 text-xs px-4 py-2 rounded-lg font-bold border border-zinc-700 active:scale-95 transition-all"
        >
          📥 Exportar Excel/CSV
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL DE PRODUCTOS CON CATEGORÍAS */}
        <div className="lg:col-span-2 flex flex-col gap-8 h-[calc(100vh-140px)] overflow-y-auto pr-2 pb-20 md:pb-0">
          {CATEGORIAS.map((categoria) => {
            const prods = PRODUCTOS.filter((p) => p.cat === categoria);
            if (prods.length === 0) return null;

            return (
              <div key={categoria} className="flex flex-col gap-3">
                {/* Título de categoría con línea separadora */}
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest whitespace-nowrap">
                    {categoria}
                  </h2>
                  <div className="h-px bg-zinc-800 flex-1"></div>
                </div>

                {/* Grid de botones más chicos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {prods.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => agregarAlCarrito(prod)}
                      className="bg-zinc-900 hover:bg-violet-900/40 border border-zinc-800 hover:border-violet-500/50 p-2.5 rounded-xl flex flex-col justify-between text-left active:scale-95 transition-all min-h-[75px] shadow-sm"
                    >
                      <span className="text-sm font-bold leading-tight text-zinc-200">{prod.nombre}</span>
                      <span className="text-base font-black text-emerald-400 mt-1">${prod.precio.toLocaleString("es-AR")}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: CARRITO Y CAJA */}
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
          
          {/* TICKET ACTUAL / CARRITO */}
          <div className="bg-zinc-900 border-2 border-violet-500/30 p-4 rounded-2xl flex flex-col shadow-2xl shrink-0">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-violet-400 uppercase tracking-wider">🛒 Pedido Actual</h2>
              {carrito.length > 0 && (
                <button onClick={vaciarCarrito} className="text-[10px] text-red-400 hover:underline">
                  Vaciar
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1">
              {carrito.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center py-6 italic">Tocá los productos para agregar al pedido</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-bold block text-white">{item.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cambiarCantidad(item.id, -1)} className="w-6 h-6 bg-zinc-800 text-white rounded-lg font-bold flex items-center justify-center active:scale-95">-</button>
                      <span className="font-black text-violet-400 w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, 1)} className="w-6 h-6 bg-zinc-800 text-white rounded-lg font-bold flex items-center justify-center active:scale-95">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 mt-2">
              <button
                disabled={carrito.length === 0}
                onClick={() => setMostrarModalPago(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-3.5 rounded-xl text-lg uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-emerald-950/50 flex justify-between px-6 items-center"
              >
                <span>COBRAR</span>
                <span>${totalOrden.toLocaleString("es-AR")}</span>
              </button>
            </div>
          </div>

          {/* HISTORIAL TICKETS FINALIZADOS */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 flex flex-col min-h-[150px]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Historial ({ventas.length})</h3>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
              {ventas.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center py-4">Sin tickets cobrados</p>
              ) : (
                ventas.map((v) => (
                  <div key={v.id} className="flex justify-between items-center bg-zinc-950 p-2 rounded-xl border border-zinc-800/80 text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-white block truncate max-w-[150px]">{v.detalle}</span>
                      <span className="text-[10px] text-zinc-500">{v.hora} • {v.metodo}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-400">${v.precioTotal.toLocaleString("es-AR")}</span>
                      <button onClick={() => eliminarVenta(v.id)} className="text-zinc-600 hover:text-red-400 p-1">✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CARD TOTALES DE CAJA - AHORA ABAJO DE TODO */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2 shrink-0 shadow-inner">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recaudación Total</span>
            <span className="text-2xl font-black text-emerald-500">${totalGeneral.toLocaleString("es-AR")}</span>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-900 text-center">
              <div>
                <span className="text-[9px] text-zinc-500 block">Efec.</span>
                <span className="text-xs font-bold text-white">${totalEfectivo.toLocaleString("es-AR")}</span>
              </div>
              <div className="border-l border-r border-zinc-900">
                <span className="text-[9px] text-zinc-500 block">Transf.</span>
                <span className="text-xs font-bold text-white">${totalTransf.toLocaleString("es-AR")}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block">Tarj.</span>
                <span className="text-xs font-bold text-white">${totalTarjeta.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL SELECCION DE MEDIO DE PAGO */}
      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-3xl p-6 text-center flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-xs text-violet-400 font-bold uppercase tracking-widest">Cobrar Ticket</span>
              <h2 className="text-3xl font-black text-emerald-400 mt-2">${totalOrden.toLocaleString("es-AR")}</h2>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2 px-4">{carrito.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")}</p>
            </div>

            <p className="text-xs text-zinc-300 font-bold">Seleccioná el medio de pago:</p>

            <div className="flex flex-col gap-3">
              <button onClick={() => registrarCobro("Efectivo")} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow-lg shadow-emerald-900/30">💵 EFECTIVO</button>
              <button onClick={() => registrarCobro("Transferencia")} className="bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow-lg shadow-violet-900/30">📱 TRANSFERENCIA</button>
              <button onClick={() => registrarCobro("Tarjeta")} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow-lg shadow-blue-900/30">💳 TARJETA</button>
            </div>

            <button onClick={() => setMostrarModalPago(false)} className="text-xs text-zinc-500 hover:text-zinc-300 py-2">Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}