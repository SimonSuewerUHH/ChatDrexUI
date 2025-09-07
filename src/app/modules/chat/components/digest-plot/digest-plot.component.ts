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
    'GO.MF': [247, 247, 59],   // yellow
    'GO.CC': [236, 24, 165],   // dark pink
    'GO.BP': [68, 235, 112],   // light green
    'KEGG': [255, 140, 0],    // orange
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
      for (const r of rows) cats.push(r.term);
    }
    return cats;
  });

  // Helpers
  private rgba([r, g, b]: RGB, a: number) {
    return `rgba(${r},${g},${b},${a})`;
  }

  private maxScore(arr: number[]) {
    return arr.length ? Math.max(...arr) : 1;
  }

  // Series per database. Each series has data aligned with categories; other positions are null.
  private series = computed(() => {
    const cats = this.categories();
    const groups = this.grouped();
    const series: any[] = [];

    // Build an index where each category belongs (to map terms to their row object)
    const termToIndex = new Map<string, number>();
    cats.forEach((c, i) => {
      if (c) termToIndex.set(c, i);
    });

    for (const db of this.dbList()) {
      const rows = (groups.get(db) ?? []) as DigestEntryDTO[];
      const scores = rows.map(r => r.score);
      const max = this.maxScore(scores);

      const base = this.groupBaseColors[db] ?? [120, 120, 120] as RGB;

      // Initialize the data array with nulls (so bars only appear on their lines)
      const data = Array<any>(cats.length).fill(null);

      for (const row of rows) {
        const idx = termToIndex.get(row.term);
        if (idx == null) continue;

        const alpha = 0.05 + (max > 0 ? (0.8 * row.score / max) : 0);
        const color = this.rgba(base, Math.min(Math.max(alpha, 0.05), 0.95));

        data[idx] = {
          value: row.score,
          itemStyle: {color},
          // Tooltip payload
          _payload: row
        };
      }

      series.push({
        type: 'bar',
        name: db,
        data,
        barGap: '30%',
        barCategoryGap: '25%',
        // Rounded bars on the right side for nicer look
        itemStyle: {borderRadius: [0, 6, 6, 0]},
        // Emphasis styling
        emphasis: {focus: 'series'}
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
        textStyle: {color: '#000', fontSize: 20}
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
          // Hide labels for spacer rows
          formatter: (val: string) => (val ? val : '')
        }
      },
      series: this.series()
    };
  });

  private escape(s: string) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;');
  }
}
