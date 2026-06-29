import { useState, useEffect } from "react";

// ─── DATOS INICIALES ───────────────────────────────────────────────────────────
const PRODUCTOS_DEMO = [
  { id: 1, nombre: "Cuaderno profesional", precio: 35, stock: 48, categoria: "Papelería" },
  { id: 2, nombre: "Bolígrafo azul", precio: 8, stock: 120, categoria: "Papelería" },
  { id: 3, nombre: "Folder tamaño carta", precio: 12, stock: 60, categoria: "Papelería" },
  { id: 4, nombre: "Resma papel bond", precio: 95, stock: 22, categoria: "Papelería" },
  { id: 5, nombre: "Pluma gel negro", precio: 15, stock: 80, categoria: "Papelería" },
  { id: 6, nombre: "Engrapadora", precio: 120, stock: 10, categoria: "Equipo" },
  { id: 7, nombre: "Tijeras escolares", precio: 25, stock: 35, categoria: "Herramientas" },
  { id: 8, nombre: "Corrector líquido", precio: 18, stock: 45, categoria: "Papelería" },
];

const VENTAS_DEMO = [
  { id: 1, fecha: new Date(Date.now() - 86400000 * 0).toISOString(), total: 243, items: 4, ticket: "T-001" },
  { id: 2, fecha: new Date(Date.now() - 86400000 * 0).toISOString(), total: 95, items: 1, ticket: "T-002" },
  { id: 3, fecha: new Date(Date.now() - 86400000 * 1).toISOString(), total: 380, items: 7, ticket: "T-003" },
  { id: 4, fecha: new Date(Date.now() - 86400000 * 1).toISOString(), total: 120, items: 2, ticket: "T-004" },
  { id: 5, fecha: new Date(Date.now() - 86400000 * 2).toISOString(), total: 560, items: 9, ticket: "T-005" },
  { id: 6, fecha: new Date(Date.now() - 86400000 * 3).toISOString(), total: 210, items: 3, ticket: "T-006" },
  { id: 7, fecha: new Date(Date.now() - 86400000 * 4).toISOString(), total: 440, items: 6, ticket: "T-007" },
];

// ─── UTILIDADES ────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n).toFixed(2)}`;
const fmtFecha = (iso) => new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
const fmtHora = (iso) => new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

// ─── ÍCONOS SVG ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const paths = {
    pos: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    caja: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M5 20h14a2 2 0 002-2V7a2 2 0 00-.586-1.414l-4-4A2 2 0 0015 1H5a2 2 0 00-2 2v15a2 2 0 002 2z",
    reportes: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    plus: "M12 4v16m8-8H4",
    check: "M5 13l4 4L19 7",
    ticket: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
};

// ─── COMPONENTE TICKET MODAL ───────────────────────────────────────────────────
const TicketModal = ({ venta, onClose }) => {
  if (!venta) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: 320, fontFamily: "'Courier New', monospace", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px dashed #ccc", paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>MI PAPELERÍA</div>
          <div style={{ fontSize: 12, color: "#666" }}>Naucalpan de Juárez, Edo. Méx.</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
            {new Date().toLocaleString("es-MX")}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>Ticket: {venta.ticket}</div>
        </div>
        {venta.items_detalle?.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span>{it.nombre} x{it.qty}</span>
            <span>{fmt(it.precio * it.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: "2px dashed #ccc", marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
            <span>TOTAL</span><span>{fmt(venta.total)}</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#999" }}>
          ¡Gracias por su compra!
        </div>
        <button onClick={onClose} style={{ width: "100%", marginTop: 20, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontSize: 14 }}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

// ─── MÓDULO: PUNTO DE VENTA ────────────────────────────────────────────────────
const ModuloPOS = ({ productos, onVenta }) => {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [ticketActivo, setTicketActivo] = useState(null);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [pagoCliente, setPagoCliente] = useState("");

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && p.stock > 0
  );

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        if (existe.qty >= producto.stock) return prev;
        return prev.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...producto, qty: 1 }];
    });
  };

  const cambiarQty = (id, delta) => {
    setCarrito(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const eliminarDelCarrito = (id) => setCarrito(prev => prev.filter(i => i.id !== id));

  const total = carrito.reduce((s, i) => s + i.precio * i.qty, 0);

  const cobrar = () => {
    if (carrito.length === 0) return;
    const ticket = `T-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const venta = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      total,
      items: carrito.reduce((s, i) => s + i.qty, 0),
      ticket,
      items_detalle: carrito.map(i => ({ nombre: i.nombre, qty: i.qty, precio: i.precio })),
    };
    onVenta(venta, carrito);
    setTicketActivo(venta);
    setCarrito([]);
    setPagoCliente("");
    setVentaExitosa(true);
    setTimeout(() => setVentaExitosa(false), 3000);
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 140px)" }}>
      {/* Catálogo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}>
            <Icon name="search" size={16} />
          </span>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, alignContent: "start" }}>
          {productosFiltrados.map(p => (
            <div
              key={p.id}
              onClick={() => agregarAlCarrito(p)}
              style={{ background: "#fff", borderRadius: 10, padding: 14, cursor: "pointer", border: "1px solid #eee", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"}
            >
              <div style={{ fontSize: 11, color: "#9b59b6", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{p.categoria}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 8 }}>{p.nombre}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#2ecc71" }}>{fmt(p.precio)}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>stock: {p.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div style={{ width: 300, background: "#fff", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="ticket" size={18} /> Venta actual
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: "center", color: "#ccc", marginTop: 40, fontSize: 14 }}>
              Toca un producto para agregar
            </div>
          ) : carrito.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{item.nombre}</div>
                <div style={{ fontSize: 12, color: "#9b59b6" }}>{fmt(item.precio)} c/u</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => cambiarQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => cambiarQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", minWidth: 52, textAlign: "right" }}>{fmt(item.precio * item.qty)}</div>
              <button onClick={() => eliminarDelCarrito(item.id)} style={{ color: "#e74c3c", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: 16, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13, color: "#999" }}>
            <span>Artículos</span>
            <span>{carrito.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 22, color: "#1a1a2e", marginBottom: 12 }}>
            <span>Total</span>
            <span style={{ color: "#2ecc71" }}>{fmt(total)}</span>
          </div>
          {carrito.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 6 }}>PAGO DEL CLIENTE</div>
              <input
                type="number"
                min="0"
                placeholder={`Mínimo ${fmt(total)}`}
                value={pagoCliente}
                onChange={e => setPagoCliente(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 16, fontWeight: 700, boxSizing: "border-box", outline: "none", textAlign: "right" }}
              />
              {pagoCliente !== "" && Number(pagoCliente) >= total && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, background: "#f0fff4", borderRadius: 8, padding: "10px 14px", border: "1px solid #b7f5cc" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a7a40" }}>CAMBIO</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#1a7a40" }}>{fmt(Number(pagoCliente) - total)}</span>
                </div>
              )}
              {pagoCliente !== "" && Number(pagoCliente) < total && Number(pagoCliente) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, background: "#fff5f5", borderRadius: 8, padding: "10px 14px", border: "1px solid #fcc" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>FALTAN</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>{fmt(total - Number(pagoCliente))}</span>
                </div>
              )}
            </div>
          )}
          <button
            onClick={cobrar}
            disabled={carrito.length === 0}
            style={{ width: "100%", padding: "14px 0", background: carrito.length > 0 ? "#1a1a2e" : "#ddd", color: carrito.length > 0 ? "#fff" : "#aaa", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: carrito.length > 0 ? "pointer" : "default", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {ventaExitosa ? <><Icon name="check" size={18} /> ¡Cobrado!</> : <><Icon name="ticket" size={18} /> Cobrar</>}
          </button>
        </div>
      </div>

      <TicketModal venta={ticketActivo} onClose={() => setTicketActivo(null)} />
    </div>
  );
};

// ─── MÓDULO: INVENTARIO ────────────────────────────────────────────────────────
const ModuloInventario = ({ productos, setProductos }) => {
  const [editando, setEditando] = useState(null);
  const [nuevo, setNuevo] = useState({ nombre: "", precio: "", stock: "", categoria: "Papelería" });
  const [mostrarForm, setMostrarForm] = useState(false);

  const guardar = () => {
    if (!nuevo.nombre || !nuevo.precio) return;
    if (editando !== null) {
      setProductos(prev => prev.map(p => p.id === editando ? { ...p, ...nuevo, precio: +nuevo.precio, stock: +nuevo.stock } : p));
      setEditando(null);
    } else {
      setProductos(prev => [...prev, { id: Date.now(), ...nuevo, precio: +nuevo.precio, stock: +nuevo.stock }]);
    }
    setNuevo({ nombre: "", precio: "", stock: "", categoria: "Papelería" });
    setMostrarForm(false);
  };

  const iniciarEdicion = (p) => {
    setNuevo({ nombre: p.nombre, precio: p.precio, stock: p.stock, categoria: p.categoria });
    setEditando(p.id);
    setMostrarForm(true);
  };

  const eliminar = (id) => setProductos(prev => prev.filter(p => p.id !== id));

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, boxSizing: "border-box", outline: "none" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#999" }}>{productos.length} productos registrados</div>
        <button onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setNuevo({ nombre: "", precio: "", stock: "", categoria: "Papelería" }); }}
          style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <Icon name="plus" size={16} /> Agregar producto
        </button>
      </div>

      {mostrarForm && (
        <div style={{ background: "#f8f9ff", border: "1px solid #e0e8ff", borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input placeholder="Nombre del producto" value={nuevo.nombre} onChange={e => setNuevo(p => ({ ...p, nombre: e.target.value }))} style={inputStyle} />
            <input placeholder="Precio ($)" type="number" value={nuevo.precio} onChange={e => setNuevo(p => ({ ...p, precio: e.target.value }))} style={inputStyle} />
            <input placeholder="Stock (unidades)" type="number" value={nuevo.stock} onChange={e => setNuevo(p => ({ ...p, stock: e.target.value }))} style={inputStyle} />
            <select value={nuevo.categoria} onChange={e => setNuevo(p => ({ ...p, categoria: e.target.value }))} style={inputStyle}>
              <option>Papelería</option><option>Equipo</option><option>Herramientas</option><option>Servicios</option><option>Otro</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={guardar} style={{ background: "#2ecc71", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              {editando ? "Guardar cambios" : "Agregar"}
            </button>
            <button onClick={() => { setMostrarForm(false); setEditando(null); }} style={{ background: "#eee", color: "#666", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 14 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #eee", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f8f8", borderBottom: "2px solid #eee" }}>
              {["Producto", "Categoría", "Precio", "Stock", "Valor total", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{p.nombre}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: "#f0e6ff", color: "#9b59b6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.categoria}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#2ecc71", fontWeight: 700 }}>{fmt(p.precio)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ color: p.stock < 10 ? "#e74c3c" : "#1a1a2e", fontWeight: 600 }}>{p.stock}</span>
                  {p.stock < 10 && <span style={{ marginLeft: 6, fontSize: 10, color: "#e74c3c", fontWeight: 700 }}>↓ BAJO</span>}
                </td>
                <td style={{ padding: "12px 16px", color: "#666", fontSize: 14 }}>{fmt(p.precio * p.stock)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => iniciarEdicion(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3498db", padding: 4 }}><Icon name="edit" size={15} /></button>
                    <button onClick={() => eliminar(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", padding: 4 }}><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── MÓDULO: CORTE DE CAJA ────────────────────────────────────────────────────
const ModuloCaja = ({ ventas }) => {
  const hoy = new Date().toDateString();
  const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === hoy);
  const totalHoy = ventasHoy.reduce((s, v) => s + v.total, 0);
  const articulosHoy = ventasHoy.reduce((s, v) => s + v.items, 0);
  const ticketProm = ventasHoy.length > 0 ? totalHoy / ventasHoy.length : 0;

  const exportarPDF = () => {
    const fechaStr = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const horaStr = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

    const filas = ventasHoy.map(v => `
      <tr>
        <td>${v.ticket}</td>
        <td>${fmtHora(v.fecha)}</td>
        <td style="text-align:center">${v.items}</td>
        <td style="text-align:right;font-weight:600;color:#1a7a40">${fmt(v.total)}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Corte de Caja — ${fechaStr}</title>
  <style>
    @page { margin: 20mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 3px solid #1a1a2e; }
    .logo { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
    .logo span { color: #2ecc71; }
    .meta { text-align: right; color: #666; font-size: 12px; line-height: 1.7; }
    h2 { font-size: 17px; font-weight: 700; margin-bottom: 16px; color: #1a1a2e; }
    .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 28px; }
    .stat { background: #f4f6fb; border-radius: 8px; padding: 14px; border-left: 4px solid #1a1a2e; }
    .stat.green { border-left-color: #2ecc71; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight: 700; margin-bottom: 6px; }
    .stat-value { font-size: 20px; font-weight: 800; color: #1a1a2e; }
    .stat.green .stat-value { color: #1a7a40; }
    .stat-sub { font-size: 10px; color: #aaa; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #1a1a2e; color: #fff; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
    tr:nth-child(even) td { background: #fafafa; }
    .tfoot td { background: #f0fff4 !important; font-weight: 700; font-size: 14px; border-top: 2px solid #2ecc71; }
    .tfoot .total { color: #1a7a40; font-size: 16px; text-align: right; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px dashed #ccc; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
    .firma { margin-top: 40px; display: flex; gap: 60px; }
    .firma-linea { flex: 1; border-top: 1px solid #999; padding-top: 6px; font-size: 11px; color: #666; text-align: center; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">PAPELERÍA <span>POS</span></div>
      <div style="font-size:12px;color:#666;margin-top:4px">Naucalpan de Juárez, Estado de México</div>
    </div>
    <div class="meta">
      <div><strong>CORTE DE CAJA</strong></div>
      <div>${fechaStr}</div>
      <div>Hora de cierre: ${horaStr}</div>
    </div>
  </div>

  <h2>Resumen del día</h2>
  <div class="stats">
    <div class="stat green">
      <div class="stat-label">Total vendido</div>
      <div class="stat-value">${fmt(totalHoy)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Transacciones</div>
      <div class="stat-value">${ventasHoy.length}</div>
      <div class="stat-sub">ventas realizadas</div>
    </div>
    <div class="stat">
      <div class="stat-label">Artículos</div>
      <div class="stat-value">${articulosHoy}</div>
      <div class="stat-sub">unidades vendidas</div>
    </div>
    <div class="stat">
      <div class="stat-label">Ticket promedio</div>
      <div class="stat-value">${fmt(ticketProm)}</div>
      <div class="stat-sub">por transacción</div>
    </div>
  </div>

  <h2>Detalle de ventas</h2>
  ${ventasHoy.length === 0
    ? `<p style="color:#aaa;text-align:center;padding:30px">Sin ventas registradas en este día</p>`
    : `<table>
    <thead><tr><th>Ticket</th><th>Hora</th><th style="text-align:center">Artículos</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${filas}</tbody>
    <tfoot class="tfoot"><tr>
      <td colspan="3"><strong>TOTAL DEL CORTE</strong></td>
      <td class="total">${fmt(totalHoy)}</td>
    </tr></tfoot>
  </table>`}

  <div class="firma">
    <div class="firma-linea">Elaboró</div>
    <div class="firma-linea">Revisó</div>
    <div class="firma-linea">Autorizó</div>
  </div>

  <div class="footer">
    <span>Generado por Papelería POS</span>
    <span>${new Date().toLocaleString("es-MX")}</span>
  </div>
</body>
</html>`;

    const ventana = window.open("", "_blank", "width=800,height=900");
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
  };

  const StatCard = ({ label, value, sub, color = "#1a1a2e" }) => (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
          Corte del día — {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <button
          onClick={exportarPDF}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 9, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M7 3h10a2 2 0 012 2v8H5V5a2 2 0 012-2z"/>
          </svg>
          Exportar PDF
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total vendido" value={fmt(totalHoy)} color="#2ecc71" />
        <StatCard label="Ventas realizadas" value={ventasHoy.length} sub="transacciones" />
        <StatCard label="Artículos vendidos" value={articulosHoy} sub="unidades" />
        <StatCard label="Ticket promedio" value={fmt(ticketProm)} sub="por transacción" />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", fontWeight: 700, color: "#1a1a2e", fontSize: 15 }}>
          Registro de ventas de hoy
        </div>
        {ventasHoy.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#ccc", fontSize: 14 }}>Sin ventas registradas hoy</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f8f8" }}>
                {["Ticket", "Hora", "Artículos", "Total"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventasHoy.map((v, i) => (
                <tr key={v.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "12px 20px", fontWeight: 700, color: "#9b59b6", fontSize: 14 }}>{v.ticket}</td>
                  <td style={{ padding: "12px 20px", color: "#666", fontSize: 14 }}>{fmtHora(v.fecha)}</td>
                  <td style={{ padding: "12px 20px", color: "#666", fontSize: 14 }}>{v.items} uds.</td>
                  <td style={{ padding: "12px 20px", fontWeight: 700, color: "#2ecc71", fontSize: 15 }}>{fmt(v.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#f8fff8", borderTop: "2px solid #2ecc71" }}>
                <td colSpan={3} style={{ padding: "14px 20px", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>TOTAL DEL CORTE</td>
                <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: 18, color: "#2ecc71" }}>{fmt(totalHoy)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

// ─── MÓDULO: REPORTES ─────────────────────────────────────────────────────────
const ModuloReportes = ({ ventas }) => {
  const dias = 7;
  const hoy = new Date();

  const dataPorDia = Array.from({ length: dias }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() - (dias - 1 - i));
    const ds = d.toDateString();
    const vsDia = ventas.filter(v => new Date(v.fecha).toDateString() === ds);
    return {
      label: d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }),
      total: vsDia.reduce((s, v) => s + v.total, 0),
      count: vsDia.length,
    };
  });

  const maxTotal = Math.max(...dataPorDia.map(d => d.total), 1);
  const totalSemana = dataPorDia.reduce((s, d) => s + d.total, 0);
  const totalTransacciones = dataPorDia.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
          <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>Ingresos últimos 7 días</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#2ecc71" }}>{fmt(totalSemana)}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
          <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>Transacciones últimos 7 días</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e" }}>{totalTransacciones}</div>
        </div>
      </div>

      {/* Gráfica de barras manual */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #eee", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 20, fontSize: 15 }}>Ventas diarias (últimos 7 días)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, padding: "0 8px" }}>
          {dataPorDia.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {d.total > 0 && (
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2ecc71" }}>{fmt(d.total)}</div>
              )}
              <div
                style={{
                  width: "100%",
                  height: maxTotal > 0 ? `${(d.total / maxTotal) * 140}px` : "4px",
                  minHeight: 4,
                  background: i === dias - 1 ? "#2ecc71" : "linear-gradient(to top, #9b59b6, #c39bd3)",
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.3s ease",
                }}
              />
              <div style={{ fontSize: 11, color: "#999", textAlign: "center", whiteSpace: "nowrap" }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla resumen */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Detalle por día</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              {["Día", "Transacciones", "Total", "% del período"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...dataPorDia].reverse().map((d, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f5f5f5" }}>
                <td style={{ padding: "12px 20px", fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{d.label}</td>
                <td style={{ padding: "12px 20px", color: "#666", fontSize: 14 }}>{d.count}</td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: "#2ecc71", fontSize: 14 }}>{fmt(d.total)}</td>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${totalSemana > 0 ? (d.total / totalSemana) * 100 : 0}%`, background: "#9b59b6", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#999", minWidth: 36 }}>
                      {totalSemana > 0 ? `${((d.total / totalSemana) * 100).toFixed(0)}%` : "0%"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── PERSISTENCIA localStorage ─────────────────────────────────────────────────
const cargarDato = (clave, fallback) => {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const guardarDato = (clave, valor) => {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {}
};

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [modulo, setModulo] = useState("pos");
  const [productos, setProductos] = useState(() => cargarDato("pos_productos", PRODUCTOS_DEMO));
  const [ventas, setVentas] = useState(() => cargarDato("pos_ventas", VENTAS_DEMO));

  // Persistir cada vez que cambien
  useEffect(() => { guardarDato("pos_productos", productos); }, [productos]);
  useEffect(() => { guardarDato("pos_ventas", ventas); }, [ventas]);

  const registrarVenta = (venta, carrito) => {
    setVentas(prev => [venta, ...prev]);
    setProductos(prev => prev.map(p => {
      const item = carrito.find(i => i.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    }));
  };

  const nav = [
    { id: "pos", label: "Punto de Venta", icon: "pos" },
    { id: "inventario", label: "Inventario", icon: "inventory" },
    { id: "caja", label: "Corte de Caja", icon: "caja" },
    { id: "reportes", label: "Reportes", icon: "reportes" },
  ];

  const productosBajos = productos.filter(p => p.stock > 0 && p.stock < 10);
  const productosAgotados = productos.filter(p => p.stock === 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a1a2e", color: "#fff", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#2ecc71", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#1a1a2e" }}>P</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.3 }}>Papelería POS</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 0.3 }}>Sistema de Punto de Venta</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setModulo(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: modulo === n.id ? "rgba(255,255,255,0.15)" : "transparent",
                color: modulo === n.id ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "all 0.15s",
              }}
            >
              <Icon name={n.icon} size={15} />
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Alertas de inventario */}
      {(productosBajos.length > 0 || productosAgotados.length > 0) && (
        <div style={{ padding: "0 28px", marginTop: 8 }}>
          {productosAgotados.length > 0 && (
            <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, padding: "10px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🚫</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>Agotados ({productosAgotados.length}):</span>
              <span style={{ fontSize: 13, color: "#c0392b" }}>{productosAgotados.map(p => p.nombre).join(", ")}</span>
            </div>
          )}
          {productosBajos.length > 0 && (
            <div style={{ background: "#fffbf0", border: "1px solid #f9d77e", borderRadius: 10, padding: "10px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#b7770d" }}>Stock bajo ({productosBajos.length}):</span>
              <span style={{ fontSize: 13, color: "#b7770d" }}>{productosBajos.map(p => `${p.nombre} (${p.stock})`).join(", ")}</span>
            </div>
          )}
        </div>
      )}
      {/* Contenido */}
      <div style={{ padding: 28 }}>
        {modulo === "pos" && <ModuloPOS productos={productos} onVenta={registrarVenta} />}
        {modulo === "inventario" && <ModuloInventario productos={productos} setProductos={setProductos} />}
        {modulo === "caja" && <ModuloCaja ventas={ventas} />}
        {modulo === "reportes" && <ModuloReportes ventas={ventas} />}
      </div>
    </div>
  );
}
