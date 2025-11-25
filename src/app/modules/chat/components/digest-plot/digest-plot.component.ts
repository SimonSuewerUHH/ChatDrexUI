import {Component, computed, input} from '@angular/core';
import {DigestEntryDTO, DigestPlotDTO} from '../../dto/digest';
import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
import {BarChart} from 'echarts/charts';
import {GridComponent, LegendComponent, TitleComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import * as echarts from "echarts/core";

type RGB = [number, number, number];

echarts.use([BarChart, TooltipComponent, TitleComponent, LegendComponent, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-digest-plot',
  imports: [
    NgxEchartsDirective
  ],
  templateUrl: './digest-plot.component.html',
  styleUrl: './digest-plot.component.scss',
  providers: [provideEchartsCore({echarts})],
})
export class DigestPlotComponent {
  data = input.required<DigestPlotDTO>();

  private groupBaseColors: Record<string, RGB> = {
    'GO.MF': [66, 135, 245],   // blue
    'GO.CC': [156, 39, 176],   // purple
    'GO.BP': [76, 175, 80],    // green
    'KEGG': [255, 152, 0],    // amber
  };

  // Internal signals
  private entries = computed(() => this.data().entries ?? []);

  // All databases (group order as they appear)
  private dbList = computed(() => {
    const set = new Set<string>();
    for (const e of this.entries()) set.add(e.database);
    return Array.from(set);
  });

  // Group items by database (preserve insertion order)
  private grouped = computed(() => {
    const map = new Map<string, ReturnType<typeof Array.prototype.slice>>();
    for (const db of this.dbList()) map.set(db, []);
    for (const e of this.entries()) {
      if (!map.has(e.database)) map.set(e.database, []);
      map.get(e.database)!.push(e);
    }
    return map;
  });

  // Build y-axis categories with two spacer rows between groups
  private categories = computed(() => {
    const cats: string[] = [];
    const groups = this.grouped();
    let first = true;
    for (const db of this.dbList()) {
      const rows = groups.get(db) ?? [];
      if (!first) {
        cats.push('', '');
      } // two spacers
      first = false;
      for (const r of rows) cats.push(`${db}::${r.term}::${r.gene}`);
    }
    return cats;
  });


  private series = computed(() => {
    const cats = this.categories();
    const groups = this.grouped();
    const series: any[] = [];

    const termToIndex = new Map<string, number>();
    cats.forEach((c, i) => {
      if (c) termToIndex.set(c, i);
    });

    for (const db of this.dbList()) {
      const rows = (groups.get(db) ?? []) as DigestEntryDTO[];

      const data = Array<any>(cats.length).fill(null);

      for (const row of rows) {
        const idx = termToIndex.get(`${db}::${row.term}::${row.gene}`);
        if (idx == null) continue;


        data[idx] = {
          value: row.score,
          _payload: row
        };
      }

      series.push({
        type: 'bar',
        name: db,
        data,
      });
    }

    return series;
  });

  options = computed(() => {
    const categories = this.categories();
    if (!categories.length) return null;

    return {
      backgroundColor: '#ffffff',
      animation: true,
      title: {
        text: 'DIGEST Functional Enrichment Analysis Results',
        left: 'center',
      },
      grid: {left: 180, right: 40, top: 60, bottom: 40},
      legend: {
        top: 28,
        textStyle: {color: '#000'}
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (params: any) => {
          const p = params?.data?._payload;
          if (!p) return `${params.seriesName}`;
          return [
            `<b>${params.seriesName}</b>`,
            `Term: ${p.term}`,
            `Description: ${this.escape(p.description)}`,
            `P-Value: ${Number(p.empiricalPValue).toFixed(3)}`,
            p.gene ? `Gene: ${this.escape(p.gene)}` : null
          ].filter(Boolean).join('<br/>');
        }
      },
      xAxis: {
        type: 'value',
        name: 'Score',
        nameTextStyle: {color: '#000', fontSize: 14},
        axisLabel: {color: '#000'},
        splitLine: {show: true}
      },
      yAxis: {
        type: 'category',
        inverse: true, // horizontal bars like Plotly orientation='h'
        data: categories,
        name: 'Term',
        nameTextStyle: {color: '#000', fontSize: 14},
        axisLabel: {
          color: '#000',
          formatter: (val: string) => {
            if (!val) return '';
            const parts = val.split('::');
            return parts.length > 1 ? parts[1] : val;
          }
        }
      },
      series: this.series()
    } as any;
  });

  private escape(s: string) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
  }
}
