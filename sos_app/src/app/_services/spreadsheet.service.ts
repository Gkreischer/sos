import { Injectable, inject } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { MetricsService } from './metrics.service';
import * as XLSX from 'xlsx-js-style';
import { WorkSheet } from 'xlsx';
import { OrderInterface, PartInterface } from 'shared';
@Injectable({
  providedIn: 'root',
})
export class SpreadSheetService {
  metricsService = inject(MetricsService);

  ordersByPeriod$ = this.metricsService.ordersByPeriod;

  generateOrdersByPeriodMetricCSV() {
    const csvData = this.ordersByPeriod$().map((order) => ({
      id: order.id,
      titulo: order.title,
      cliente: order.user?.name,
      tecnico: order.technician?.name,
      equipamento: order.equipment?.name,
      categoria: order.equipment?.category?.name,
      status: order.status?.name,
      descricao: order.description,
      valor_servico: order.service_price,
      valor_pecas: order.parts_price,
      desconto: order.discount,
      total: order.total_price,
      criado_em: order.created_at,
    }));
    const csv = new AngularCsv(
      csvData,
      `ordens-servico-${this.metricsService.startDate}-${this.metricsService.endDate}`,
      {
        showLabels: true,
        useHeaders: true,
        nullToEmptyString: true,
        useBom: true,
        headers: [
          'id',
          'titulo',
          'cliente',
          'tecnico',
          'equipamento',
          'categoria',
          'status',
          'descricao',
          'valor_servico',
          'valor_pecas',
          'desconto',
          'total',
        ],
      },
    );
  }

  async generateOrdersByPeriodMetricXLSX() {
    const XLSX = await import('xlsx-js-style');
    const ordersData = this.ordersByPeriod$().map((order) => ({
      id: order.id,
      titulo: order.title,
      cliente: order.user?.name,
      tecnico: order.technician?.name,
      equipamento: order.equipment?.name,
      categoria: order.equipment?.category?.name,
      status: order.status?.name,
      descricao: order.description,
      valor_servico: order.service_price,
      valor_pecas: order.parts_price,
      desconto: order.discount,
      total: order.total_price,
      criado_em: order.created_at,
    }));
    const partsData = this.ordersByPeriod$().flatMap((order: OrderInterface) =>
      order.parts.map((part: PartInterface) => ({
        ordem: order.id,
        cliente: order.user?.name,
        equipamento: order.equipment?.name,
        peca: part.name,
        quantidade: part.quantity,
        valor_unitario: part.price,
        subtotal: part.quantity * part.price,
      })),
    );
    const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
    const partsSheet = XLSX.utils.json_to_sheet(partsData);

    this.styleSheet(ordersSheet);
    this.styleSheet(partsSheet);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Ordens');
    XLSX.utils.book_append_sheet(workbook, partsSheet, 'Peças');

    XLSX.writeFile(
      workbook,
      `ordens-servico-${this.metricsService.startDate}-${this.metricsService.endDate}.xlsx`,
    );
  }

  private styleSheet(sheet: WorkSheet) {
    if (!sheet['!ref']) return;

    const range = XLSX.utils.decode_range(sheet['!ref']);

    // Cabeçalho
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: col });

      if (!sheet[cell]) continue;

      sheet[cell].s = {
        font: {
          bold: true,
          color: { rgb: 'FFFFFF' },
          sz: 11,
        },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '1F4E78' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        border: {
          top: { style: 'thin', color: { rgb: 'D9D9D9' } },
          bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
          left: { style: 'thin', color: { rgb: 'D9D9D9' } },
          right: { style: 'thin', color: { rgb: 'D9D9D9' } },
        },
      };
    }

    // Demais linhas
    for (let row = 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });

        if (!sheet[cell]) continue;

        sheet[cell].s = {
          alignment: {
            vertical: 'center',
          },
          border: {
            top: { style: 'thin', color: { rgb: 'DDDDDD' } },
            bottom: { style: 'thin', color: { rgb: 'DDDDDD' } },
            left: { style: 'thin', color: { rgb: 'DDDDDD' } },
            right: { style: 'thin', color: { rgb: 'DDDDDD' } },
          },
        };

        // Linhas alternadas
        if (row % 2 === 0) {
          sheet[cell].s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'F7F7F7' },
          };
        }
      }
    }

    // Ajuste das colunas
    sheet['!cols'] = Array(range.e.c + 1).fill({ wch: 20 });

    // Altura do cabeçalho
    sheet['!rows'] = [{ hpt: 24 }];

    // Filtro automático
    sheet['!autofilter'] = {
      ref: sheet['!ref'],
    };
  }
}
