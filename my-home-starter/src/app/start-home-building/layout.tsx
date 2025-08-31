// src/app/start-home-building/layout.tsx
import { SimulatorProvider } from '../../contexts/SimulatorContext';

export default function StartHomeBuildingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SimulatorProvider>
      {children}
    </SimulatorProvider>
  );
}