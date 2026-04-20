import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RUNBOOKS = [
  {
    _id: "rb-1",
    title: "Database Failover",
    category: "Base de Datos",
    severity: "critical",
    estimatedMinutes: 30,
    steps: [
      "Verificar el estado del servidor primario de base de datos",
      "Confirmar que la réplica secundaria está sincronizada",
      "Ejecutar el comando de failover: db.switchPrimary()",
      "Actualizar las cadenas de conexión en los servicios",
      "Verificar la conectividad de todas las aplicaciones",
      "Monitorear el rendimiento durante 30 minutos",
      "Notificar al equipo el cambio completado",
    ],
  },
  {
    _id: "rb-2",
    title: "High CPU Response",
    category: "Infraestructura",
    severity: "high",
    estimatedMinutes: 20,
    steps: [
      "Identificar el proceso con mayor consumo de CPU usando top/htop",
      "Verificar si es un proceso legítimo o un comportamiento anómalo",
      "Si es un servicio web, revisar las métricas de tráfico",
      "Escalar horizontalmente si es necesario (agregar instancias)",
      "Reiniciar el servicio si el consumo es por fuga de memoria",
      "Activar alertas de monitoreo adicionales",
      "Documentar la causa raíz",
    ],
  },
  {
    _id: "rb-3",
    title: "API Rate Limit Breach",
    category: "Aplicaciones",
    severity: "medium",
    estimatedMinutes: 15,
    steps: [
      "Identificar el origen del tráfico excesivo en los logs",
      "Verificar si es tráfico legítimo o un posible abuso",
      "Bloquear IPs maliciosas en el WAF si es necesario",
      "Ajustar temporalmente los límites de rate limiting",
      "Notificar al cliente si es tráfico de un partner",
      "Revisar y ajustar las políticas de throttling",
    ],
  },
  {
    _id: "rb-4",
    title: "Deploy Rollback",
    category: "Aplicaciones",
    severity: "high",
    estimatedMinutes: 10,
    steps: [
      "Confirmar que el error está relacionado con el último despliegue",
      "Ejecutar: git revert HEAD && git push origin main",
      "Disparar el pipeline de CI/CD para el rollback",
      "Verificar que la versión anterior se despliega correctamente",
      "Ejecutar pruebas de humo en producción",
      "Comunicar al equipo de desarrollo la incidencia",
      "Crear un post-mortem del despliegue fallido",
    ],
  },
  {
    _id: "rb-5",
    title: "Security Incident Response",
    category: "Seguridad",
    severity: "critical",
    estimatedMinutes: 60,
    steps: [
      "Aislar los sistemas comprometidos de la red",
      "Preservar los logs y evidencia forense",
      "Identificar el vector de ataque y el alcance",
      "Revocar credenciales comprometidas inmediatamente",
      "Aplicar parches o mitigaciones de emergencia",
      "Notificar al equipo de seguridad y management",
      "Realizar un análisis de impacto completo",
      "Restaurar servicios desde backups verificados",
      "Documentar el incidente y las lecciones aprendidas",
    ],
  },
];

export async function GET() {
  return NextResponse.json(RUNBOOKS);
}
