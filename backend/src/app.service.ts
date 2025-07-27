import { Injectable } from '@nestjs/common';

interface HealthReport {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

@Injectable()
export class AppService {

  getHealth(): HealthReport {
    const memUsage = process.memoryUsage();
    const usedMemory = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
    const totalMemory = Math.round(memUsage.heapTotal / 1024 / 1024); // MB
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    const status: 'healthy' | 'unhealthy' = memoryPercentage < 90 ? 'healthy' : 'unhealthy';

    const healthReport: HealthReport = {
      status,
      timestamp: new Date().toISOString(),
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage,
      },
    };

    return healthReport;
  }

}
