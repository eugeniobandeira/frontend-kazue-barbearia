export class StatusUtils {
  public static getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status?.toUpperCase()) {
      case 'EM ANDAMENTO':
        return 'warn';
      case 'FINALIZADO':
        return 'success';
      default:
        return 'info';
    }
  }
}
