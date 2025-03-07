import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexYAxis } from "ng-apexcharts"

export type ChartOptions = {
    series:ApexAxisChartSeries;
    chart:ApexChart;
    dataLabels:ApexDataLabels;
    plotOptions:ApexPlotOptions;
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