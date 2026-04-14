export interface IIncident {
  _id: string;
  title: string;
  description: string;
  area: string;
  severity: string;
  status: string;
  assignedTo: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function daysAgo(d: number, hours = 10): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  dt.setHours(hours, 0, 0, 0);
  return dt.toISOString();
}

function hoursAfter(base: string, h: number): string {
  return new Date(new Date(base).getTime() + h * 3600000).toISOString();
}

let nextId = 26;

const incidents: IIncident[] = [
  // --- Today ---
  { _id: "1", title: "CPU al 98% en servidor web-01", description: "El servidor de producción web-01 alcanzó utilización de CPU del 98% causando latencia elevada.", area: "Infraestructura", severity: "critical", status: "in_progress", assignedTo: "Carlos Méndez", resolvedAt: null, createdAt: daysAgo(0, 8), updatedAt: daysAgo(0, 8) },
  { _id: "2", title: "Certificado SSL próximo a expirar", description: "El certificado SSL del dominio principal expira en 3 días.", area: "Seguridad", severity: "high", status: "open", assignedTo: "", resolvedAt: null, createdAt: daysAgo(0, 7), updatedAt: daysAgo(0, 7) },
  { _id: "3", title: "Error 502 intermitente en API gateway", description: "Usuarios reportan errores 502 esporádicos al consumir la API REST.", area: "Aplicaciones", severity: "high", status: "open", assignedTo: "Laura García", resolvedAt: null, createdAt: daysAgo(0, 9), updatedAt: daysAgo(0, 9) },

  // --- 1 day ago ---
  { _id: "4", title: "Pérdida de paquetes en VLAN 20", description: "Se detectó un 12% de pérdida de paquetes en la VLAN de producción.", area: "Redes", severity: "critical", status: "resolved", assignedTo: "Miguel Torres", resolvedAt: hoursAfter(daysAgo(1, 6), 4), createdAt: daysAgo(1, 6), updatedAt: daysAgo(1, 10) },
  { _id: "5", title: "Backup nocturno fallido en DB principal", description: "El job de backup de las 03:00 falló por falta de espacio en disco.", area: "Base de Datos", severity: "high", status: "resolved", assignedTo: "Ana Ruiz", resolvedAt: hoursAfter(daysAgo(1, 4), 3), createdAt: daysAgo(1, 4), updatedAt: daysAgo(1, 7) },
  { _id: "6", title: "Lentitud en consultas de reportes", description: "Las consultas de generación de reportes tardan más de 30 segundos.", area: "Base de Datos", severity: "medium", status: "in_progress", assignedTo: "Pedro Sánchez", resolvedAt: null, createdAt: daysAgo(1, 11), updatedAt: daysAgo(1, 11) },
  { _id: "7", title: "Ticket: usuario sin acceso a VPN", description: "El usuario jlopez no puede conectarse a la VPN corporativa.", area: "Soporte", severity: "low", status: "resolved", assignedTo: "Diana Cruz", resolvedAt: hoursAfter(daysAgo(1, 9), 2), createdAt: daysAgo(1, 9), updatedAt: daysAgo(1, 11) },

  // --- 2 days ago ---
  { _id: "8", title: "Despliegue fallido en staging", description: "El pipeline de CI/CD falló en la etapa de tests de integración.", area: "Aplicaciones", severity: "medium", status: "resolved", assignedTo: "Carlos Méndez", resolvedAt: hoursAfter(daysAgo(2, 15), 1), createdAt: daysAgo(2, 15), updatedAt: daysAgo(2, 16) },
  { _id: "9", title: "Firewall bloqueando tráfico legítimo", description: "Las nuevas reglas de firewall bloquean peticiones de la API móvil.", area: "Seguridad", severity: "high", status: "closed", assignedTo: "Miguel Torres", resolvedAt: hoursAfter(daysAgo(2, 10), 5), createdAt: daysAgo(2, 10), updatedAt: daysAgo(2, 15) },
  { _id: "10", title: "Disco al 90% en servidor de logs", description: "El servidor centralizado de logs está al 90% de capacidad.", area: "Infraestructura", severity: "medium", status: "resolved", assignedTo: "Ana Ruiz", resolvedAt: hoursAfter(daysAgo(2, 8), 6), createdAt: daysAgo(2, 8), updatedAt: daysAgo(2, 14) },

  // --- 3 days ago ---
  { _id: "11", title: "Latencia alta en microservicio de pagos", description: "El servicio de procesamiento de pagos muestra latencia P99 de 5s.", area: "Aplicaciones", severity: "critical", status: "resolved", assignedTo: "Laura García", resolvedAt: hoursAfter(daysAgo(3, 7), 8), createdAt: daysAgo(3, 7), updatedAt: daysAgo(3, 15) },
  { _id: "12", title: "Switch de core con errores CRC", description: "El switch principal reporta errores CRC en los puertos 1/0/1 y 1/0/2.", area: "Redes", severity: "high", status: "closed", assignedTo: "Miguel Torres", resolvedAt: hoursAfter(daysAgo(3, 9), 3), createdAt: daysAgo(3, 9), updatedAt: daysAgo(3, 12) },
  { _id: "13", title: "Actualización de parches de seguridad", description: "Pendiente aplicar parches críticos CVE-2024-XXXX en servidores Linux.", area: "Seguridad", severity: "medium", status: "open", assignedTo: "Pedro Sánchez", resolvedAt: null, createdAt: daysAgo(3, 11), updatedAt: daysAgo(3, 11) },
  { _id: "14", title: "Ticket: impresora de 3er piso no funciona", description: "La impresora compartida del piso 3 no responde a trabajos de impresión.", area: "Soporte", severity: "low", status: "closed", assignedTo: "Diana Cruz", resolvedAt: hoursAfter(daysAgo(3, 14), 1), createdAt: daysAgo(3, 14), updatedAt: daysAgo(3, 15) },

  // --- 4 days ago ---
  { _id: "15", title: "Memoria RAM saturada en DB réplica", description: "El servidor de réplica de base de datos consume el 95% de RAM.", area: "Base de Datos", severity: "high", status: "resolved", assignedTo: "Ana Ruiz", resolvedAt: hoursAfter(daysAgo(4, 5), 4), createdAt: daysAgo(4, 5), updatedAt: daysAgo(4, 9) },
  { _id: "16", title: "Caída del servicio de autenticación", description: "El microservicio de auth dejó de responder durante 15 minutos.", area: "Aplicaciones", severity: "critical", status: "resolved", assignedTo: "Carlos Méndez", resolvedAt: hoursAfter(daysAgo(4, 12), 2), createdAt: daysAgo(4, 12), updatedAt: daysAgo(4, 14) },
  { _id: "17", title: "Congestión en enlace WAN", description: "El enlace WAN entre oficinas muestra saturación del 85%.", area: "Redes", severity: "medium", status: "closed", assignedTo: "Miguel Torres", resolvedAt: hoursAfter(daysAgo(4, 10), 6), createdAt: daysAgo(4, 10), updatedAt: daysAgo(4, 16) },

  // --- 5 days ago ---
  { _id: "18", title: "Vulnerabilidad detectada en dependencia npm", description: "Se detectó una vulnerabilidad crítica en una librería de terceros.", area: "Seguridad", severity: "critical", status: "resolved", assignedTo: "Laura García", resolvedAt: hoursAfter(daysAgo(5, 8), 10), createdAt: daysAgo(5, 8), updatedAt: daysAgo(5, 18) },
  { _id: "19", title: "Error en job de limpieza de logs", description: "El cron de rotación de logs no se ha ejecutado en 48h.", area: "Infraestructura", severity: "low", status: "resolved", assignedTo: "Pedro Sánchez", resolvedAt: hoursAfter(daysAgo(5, 9), 3), createdAt: daysAgo(5, 9), updatedAt: daysAgo(5, 12) },
  { _id: "20", title: "Ticket: nuevo empleado sin credenciales", description: "El empleado rgarcia necesita acceso a los sistemas corporativos.", area: "Soporte", severity: "low", status: "closed", assignedTo: "Diana Cruz", resolvedAt: hoursAfter(daysAgo(5, 10), 4), createdAt: daysAgo(5, 10), updatedAt: daysAgo(5, 14) },

  // --- 6 days ago ---
  { _id: "21", title: "Fallo en balanceador de carga", description: "El LB principal dejó de distribuir tráfico al nodo 3.", area: "Infraestructura", severity: "high", status: "resolved", assignedTo: "Carlos Méndez", resolvedAt: hoursAfter(daysAgo(6, 6), 5), createdAt: daysAgo(6, 6), updatedAt: daysAgo(6, 11) },
  { _id: "22", title: "Replicación de DB atrasada 30min", description: "La réplica de lectura tiene un lag de 30 minutos respecto al primario.", area: "Base de Datos", severity: "high", status: "closed", assignedTo: "Ana Ruiz", resolvedAt: hoursAfter(daysAgo(6, 13), 2), createdAt: daysAgo(6, 13), updatedAt: daysAgo(6, 15) },
  { _id: "23", title: "DNS lento para resolución externa", description: "Las resoluciones DNS externas tardan más de 500ms.", area: "Redes", severity: "medium", status: "resolved", assignedTo: "Miguel Torres", resolvedAt: hoursAfter(daysAgo(6, 11), 3), createdAt: daysAgo(6, 11), updatedAt: daysAgo(6, 14) },
  { _id: "24", title: "Endpoint de health-check caído", description: "El endpoint /health del servicio de notificaciones devuelve 503.", area: "Aplicaciones", severity: "medium", status: "resolved", assignedTo: "Laura García", resolvedAt: hoursAfter(daysAgo(6, 7), 2), createdAt: daysAgo(6, 7), updatedAt: daysAgo(6, 9) },
  { _id: "25", title: "Ticket: reseteo de contraseña masivo", description: "5 usuarios del depto. de ventas solicitan reseteo de contraseña.", area: "Soporte", severity: "low", status: "closed", assignedTo: "Diana Cruz", resolvedAt: hoursAfter(daysAgo(6, 15), 1), createdAt: daysAgo(6, 15), updatedAt: daysAgo(6, 16) },
];

// --- CRUD helpers ---

export function findAll(filter?: Record<string, string>): IIncident[] {
  let result = [...incidents];
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (value) result = result.filter((i) => (i as Record<string, unknown>)[key] === value);
    }
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}

export function findById(id: string): IIncident | undefined {
  return incidents.find((i) => i._id === id);
}

export function create(data: Partial<IIncident>): IIncident {
  const now = new Date().toISOString();
  const incident: IIncident = {
    _id: String(nextId++),
    title: data.title || "",
    description: data.description || "",
    area: data.area || "",
    severity: data.severity || "medium",
    status: data.status || "open",
    assignedTo: data.assignedTo || "",
    resolvedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  incidents.push(incident);
  return incident;
}

export function update(id: string, data: Partial<IIncident>): IIncident | null {
  const idx = incidents.findIndex((i) => i._id === id);
  if (idx === -1) return null;
  const updated = { ...incidents[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.status === "resolved" || data.status === "closed") {
    updated.resolvedAt = new Date().toISOString();
  }
  incidents[idx] = updated;
  return updated;
}

export function remove(id: string): boolean {
  const idx = incidents.findIndex((i) => i._id === id);
  if (idx === -1) return false;
  incidents.splice(idx, 1);
  return true;
}
