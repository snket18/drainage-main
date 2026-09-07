import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const baseRain = parseFloat(searchParams.get('baseRain') || '0');
  const baseDepth = parseFloat(searchParams.get('baseDepth') || '0');
  const baseCapacity = parseFloat(searchParams.get('baseCapacity') || '0');

  const jitter = () => (Math.random() - 0.5);

  const newRain = Math.max(0, baseRain + jitter() * 2); 
  const newDepth = Math.max(0, baseDepth + jitter() * 1.5);
  const newCapacity = Math.max(0, Math.min(100, baseCapacity + jitter() * 0.8));

  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    rainfallMmHr: Number(newRain.toFixed(1)),
    waterDepthCm: Number(newDepth.toFixed(1)),
    drainageCapacityPct: Number(newCapacity.toFixed(1)),
    status: newDepth > 40 ? 'CRITICAL' : newDepth > 20 ? 'WARNING' : 'NORMAL'
  });
}
