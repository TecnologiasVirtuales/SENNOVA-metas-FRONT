import { ReporteChartModel } from "@shared/models/reporte-chart.model";

export function getColorForPercentage(achieved:number, meta:number,for_label:boolean = true):string {
    const percentage = (achieved / meta) * 100;
    if (percentage < 30) {
        return for_label ? "var(--red-label-chart-color)" : "var(--red-chart-color)";
    } else if (percentage >= 30 && percentage < 50) {
        return for_label ? "var(--orange-label-chart-color)" : "var(--orange-chart-color)";
    } else if (percentage >= 50 && percentage < 60) {
        return for_label ? "var(--yellow-label-chart-color)" : "var(--yellow-chart-color)";
    } else {
        return for_label ? "var(--green-label-chart-color)" : "var(--green-chart-color)";
    }
}

export function getColorsForLevel(reporte:ReporteChartModel, metas:ReporteChartModel,for_label:boolean = true) {
    let result:string[] = [];
    for (const modality in metas) {
        const metaValue = metas[modality];
        const achievedValue = reporte[modality] || 0;
        result = [...result,getColorForPercentage(achievedValue as number, metaValue as number,for_label)];
    }
    return result;
}