/**
 * Audit logging utility
 */

interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceId?: string;
  resourceType: string;
  details?: any;
}

// In-memory storage for audit logs (in production, this would be in a database)
const auditLogs: AuditLogEntry[] = [];

/**
 * Log an audit event
 * @param entry The audit log entry
 */
export function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const auditEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  };
  
  // In production, this would send to a logging service or database
  auditLogs.push(auditEntry);
  
  // Also log to console for development
  console.log(`[AUDIT] ${auditEntry.timestamp} - ${auditEntry.action} - ${auditEntry.resourceType} ${auditEntry.resourceId || ''}`);
}

/**
 * Get audit logs
 * @returns Array of audit log entries
 */
export function getAuditLogs(): AuditLogEntry[] {
  return [...auditLogs];
}

/**
 * Get audit logs for a specific resource
 * @param resourceId The resource ID to filter by
 * @returns Array of audit log entries for the resource
 */
export function getAuditLogsForResource(resourceId: string): AuditLogEntry[] {
  return auditLogs.filter(log => log.resourceId === resourceId);
}