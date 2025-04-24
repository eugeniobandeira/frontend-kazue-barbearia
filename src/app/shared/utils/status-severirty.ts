export class StatusUtils {
  public static getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status?.toUpperCase()) {
      case 'EM ANDAMENTO':
        return 'warn';
      case 'FINALIZADO':
        return 'success';
      case 'APROVADO':
        return 'success';
      case 'REJEITADO':
        return 'danger';
      default:
        return 'info';
    }
  }
}
