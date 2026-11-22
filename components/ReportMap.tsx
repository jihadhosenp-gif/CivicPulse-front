'use client';
import { useEffect, useRef } from 'react';

export default function ReportMap({ reports }: { reports: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!ref.current) return;
      map = L.map(ref.current).setView([23.8103, 90.4125], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      reports.forEach((r) => {
        const [lng, lat] = r.location?.coordinates || [];
        if (lat == null || lng == null) return;
        L.marker([lat, lng]).addTo(map).bindPopup(r.title || 'Report');
      });
    })();
    return () => {
      if (map) map.remove();
    };
  }, [reports]);
  return <div ref={ref} style={{ height: '500px', width: '100%' }} />;
}
