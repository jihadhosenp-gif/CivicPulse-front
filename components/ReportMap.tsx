
'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface Report {
  title?: string;
  location?: {
    coordinates?: [number, number];
  };
}

export default function ReportMap({
  reports,
}: {
  reports: Report[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      const L = await import('leaflet');

      if (cancelled || !mapRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      const map = L.map(mapRef.current).setView(
        [23.8103, 90.4125],
        10
      );

      leafletMapRef.current = map;

      const tiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }
      );

      tiles.on('tileerror', (error) => {
        console.error('OpenStreetMap tile error:', error);
      });

      tiles.addTo(map);

      reports.forEach((report) => {
        const coordinates = report.location?.coordinates;

        if (!coordinates || coordinates.length < 2) return;

        const [lng, lat] = coordinates;

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng) ||
          lat < -90 || lat > 90 ||
          lng < -180 || lng > 180
        ) return;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(report.title || 'Report');
      });

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    }

    initializeMap().catch((error) => {
      console.error('Map initialization failed:', error);
    });

    return () => {
      cancelled = true;

      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [reports]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: '500px', minHeight: '500px' }}
    />
  );
}
