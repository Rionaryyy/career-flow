// app/components/Phase2/phase2DeviceList.ts
export interface DeviceModel {
  label: string;
  storage: string[];
}

export interface DeviceSeries {
  series: string;
  models: DeviceModel[];
}

export const deviceList: DeviceSeries[] = [
  {
    series: "iPhone 17",
    models: [
      { label: "iPhone 17", storage: ["256GB", "512GB"] },
      { label: "iPhone 17 Pro", storage: ["256GB", "512GB", "1TB"] },
      { label: "iPhone 17 Pro Max", storage: ["256GB", "512GB", "1TB", "2TB"] },
      { label: "iPhone 17 Air", storage: ["256GB", "512GB", "1TB"] },
    ],
  },
  {
    series: "Pixel 10",
    models: [
      { label: "Pixel 10", storage: ["128GB", "256GB"] },
      { label: "Pixel 10 Pro", storage: ["128GB", "256GB", "512GB", "1TB"] },
      { label: "Pixel 10 Pro XL", storage: ["128GB", "256GB", "512GB", "1TB"] },
      { label: "Pixel 10 Pro Fold", storage: ["256GB", "512GB", "1TB"] },
    ],
  },
  {
    series: "Galaxy S25",
    models: [
      { label: "Galaxy S25", storage: ["128GB", "256GB", "512GB", "1TB"] },
      { label: "Galaxy S25+", storage: ["256GB", "512GB"] },
      { label: "Galaxy S25 Ultra", storage: ["256GB", "512GB", "1TB"] },
      { label: "Galaxy S25 Edge", storage: ["256GB", "512GB"] },
      { label: "Galaxy S25 FE", storage: ["128GB", "256GB", "512GB"] },
    ],
  },
  {
    series: "Xperia",
    models: [
      { label: "Xperia 1 VI", storage: ["256GB", "512GB"] },
    ],
  },
];
