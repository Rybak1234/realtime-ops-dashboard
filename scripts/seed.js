const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const IncidentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    area: String,
    severity: { type: String, enum: ["low", "medium", "high", "critical"] },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"] },
    assignedTo: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

const Incident = mongoose.model("Incident", IncidentSchema);

const areas = ["Infraestructura", "Aplicaciones", "Redes", "Seguridad", "Base de Datos", "Soporte"];
const severities = ["low", "medium", "high", "critical"];
const statuses = ["open", "in_progress", "resolved", "closed"];
const assignees = ["Carlos López", "Ana Martínez", "Pedro Sánchez", "María García", "Luis Fernández"];

const titles = [
  "Caída del servidor de producción",
  "Alto consumo de CPU en nodo 3",
  "Latencia elevada en API gateway",
  "Fallo en certificado SSL",
  "Error de conexión a base de datos",
  "Timeout en microservicio de pagos",
  "Alerta de disco al 95%",
  "Fuga de memoria en worker",
  "DDoS detectado en CDN",
  "Backup fallido en PostgreSQL",
  "Actualización de firmware pendiente",
  "Error 502 intermitente",
  "Degradación en servicio de email",
  "Problema de replicación MongoDB",
  "Vulnerabilidad detectada en dependencia",
  "Caída de red en oficina central",
  "Error de autenticación LDAP",
  "Saturación de cola de mensajes",
  "Fallo en balanceador de carga",
  "Rendimiento degradado en queries",
];

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  await Incident.deleteMany({});
  console.log("🗑️  Cleared existing incidents");

  // Create users
  const UserSchema = new mongoose.Schema(
    { email: { type: String, unique: true }, passwordHash: String, name: String, role: { type: String, enum: ["admin", "operator", "viewer"] }, active: { type: Boolean, default: true } },
    { timestamps: true }
  );
  const User = mongoose.model("User", UserSchema);
  await User.deleteMany({});

  const adminHash = await bcrypt.hash("admin123", 12);
  const opHash = await bcrypt.hash("operator123", 12);
  await User.insertMany([
    { email: "admin@opsboard.com", passwordHash: adminHash, name: "Admin", role: "admin", active: true },
    { email: "operador@opsboard.com", passwordHash: opHash, name: "Operador Demo", role: "operator", active: true },
    { email: "viewer@opsboard.com", passwordHash: opHash, name: "Viewer Demo", role: "viewer", active: true },
  ]);
  console.log("✅ Created 3 users (admin@opsboard.com/admin123, operador@opsboard.com/operator123)");

  const incidents = [];
  for (let i = 0; i < 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const created = randomDate(14);
    const resolved = status === "resolved" || status === "closed"
      ? new Date(created.getTime() + Math.random() * 48 * 60 * 60 * 1000)
      : undefined;

    incidents.push({
      title: titles[i % titles.length],
      description: `Incidencia de prueba generada automáticamente. Requiere atención del equipo de ${areas[Math.floor(Math.random() * areas.length)]}.`,
      area: areas[Math.floor(Math.random() * areas.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status,
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      resolvedAt: resolved,
      createdAt: created,
      updatedAt: created,
    });
  }

  await Incident.insertMany(incidents);
  console.log(`✅ Created ${incidents.length} demo incidents`);

  // Create alerts
  const AlertSchema = new mongoose.Schema(
    {
      name: String,
      condition: { metric: String, operator: String, threshold: Number },
      severity: { type: String, enum: ["low", "medium", "high", "critical"] },
      enabled: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  const Alert = mongoose.model("Alert", AlertSchema);
  await Alert.deleteMany({});

  await Alert.insertMany([
    { name: "Incidencias críticas > 5 en 1 hora", condition: { metric: "incidents_critical", operator: ">", threshold: 5 }, severity: "critical", enabled: true },
    { name: "Tiempo de respuesta API > 2000ms", condition: { metric: "response_time_ms", operator: ">", threshold: 2000 }, severity: "high", enabled: true },
    { name: "Uso de CPU > 90%", condition: { metric: "cpu_usage", operator: ">", threshold: 90 }, severity: "high", enabled: true },
    { name: "Tasa de errores > 5%", condition: { metric: "error_rate", operator: ">", threshold: 5 }, severity: "medium", enabled: true },
    { name: "Total incidencias abiertas > 20", condition: { metric: "incidents_total", operator: ">", threshold: 20 }, severity: "medium", enabled: false },
  ]);
  console.log("✅ Created 5 demo alert rules");

  console.log("🎉 Seed completed!");

  await mongoose.disconnect();
}

seed().catch(console.error);
