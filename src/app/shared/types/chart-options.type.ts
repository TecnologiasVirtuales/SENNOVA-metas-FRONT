import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexYAxis } from "ng-apexcharts"

export type ChartOptions = {
    series:ApexAxisChartSeries;
    chart:ApexChart;
    data_labels:ApexDataLabels;
    plot_options:ApexPlotOptions;
    yaxis:ApexYAxis;
    xaxis:ApexXAxis;
    grid:ApexGrid;
    colors:string[];
    legend:ApexLegend;
}

export type ChartNonAxisOptions = {
    series:ApexNonAxisChartSeries;
    chart:ApexChart;
    labels:string[];
    responsive:ApexResponsive[];
    legend?:ApexLegend;
}