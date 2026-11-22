'use client';

import * as React from 'react';
import { MapPin, Crosshair, Search, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/*
 * MapPicker — interactive point picker.
 *
 * Design goals:
 *  - No API key required: uses Leaflet + OpenStreetMap tiles (free, keyless).
 *  - Progressive enhancement: Leaflet is loaded lazily from a CDN so the report
 *    page still renders (and coordinates can be typed manually) even offline or
 *    when the CDN is blocked.
 *  - Emits a GeoJSON Point ([lng, lat]) that matches the backend contract.
 */

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Leaflet is loaded as a global; we type only what we touch to avoid a hard dep.
type LatLng = { lat: number; lng: number };
type LeafletMap = {
  setView: (center: LatLng, zoom: number) => LeafletMap;
  on: (event: string, handler: (e: { latlng: LatLng }) => void) => LeafletMap;
  remove: () => void;
  invalidateSize: () => void;
};
type LeafletMarker = {
  setLatLng: (latlng: LatLng) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
};
type LeafletNamespace = {
  map: (el: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => { addTo: (m: LeafletMap) => unknown };
  marker: (latlng: LatLng, options?: Record<string, unknown>) => LeafletMarker;
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

let leafletPromise: Promise<LeafletNamespace> | null = null;

/** Load Leaflet (JS + CSS) once, returning the global namespace. */
function loadLeaflet(): Promise<LeafletNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet can only load in the browser'));
  }
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise<LeafletNamespace>((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`
    );
    const script = existing ?? document.createElement('script');

    const handleLoad = () => {
      if (window.L) resolve(window.L);
      else reject(new Error('Leaflet failed to initialise'));
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', () =>
      reject(new Error('Failed to load map library'))
    );

    if (!existing) {
      script.src = LEAFLET_JS;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return leafletPromise;
}

const DEFAULT_CENTER: LatLng = { lat: 23.8103, lng: 90.4125 }; // Dhaka, BD (product locale)

interface MapPickerProps {
  /** Current selected point, or null. */
  value: { lat: number; lng: number } | null;
  /** Called with a GeoJSON point when the user picks / types a location. */
  onChange: (point: { type: 'Point'; coordinates: [number, number] } | null) => void;
  /** Optional address textbox bound to the parent form. */
  address?: string;
  onAddressChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MapPicker({
  value,
  onChange,
  address,
  onAddressChange,
  disabled = false,
  className,
}: MapPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markerRef = React.useRef<LeafletMarker | null>(null);
  const leafletRef = React.useRef<LeafletNamespace | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  // Manual coordinate inputs (source of truth when the user types).
  const [latInput, setLatInput] = React.useState(value ? String(value.lat) : '');
  const [lngInput, setLngInput] = React.useState(value ? String(value.lng) : '');
  const [coordError, setCoordError] = React.useState<string | null>(null);

  // Initialise the map once Leaflet is available.
  React.useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        leafletRef.current = L;

        const center: LatLng = value ?? DEFAULT_CENTER;
        const map = L.map(containerRef.current, {
          center,
          zoom: 14,
          attributionControl: true,
        });
        L.tileLayer(OSM_TILE_URL, {
          attribution: OSM_ATTRIBUTION,
          maxZoom: 19,
        }).addTo(map);

        map.on('click', (e) => {
          emitPoint(e.latlng.lat, e.latlng.lng);
        });

        if (value) {
          markerRef.current = L.marker(value, {
            draggable: !disabled,
          }).addTo(map);
        }

        mapRef.current = map;
        setStatus('ready');

        // Defer a size recalc until the element has its final layout.
        window.setTimeout(() => map.invalidateSize(), 0);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker in sync with external value changes.
  React.useEffect(() => {
    const L = leafletRef.current;
    if (status !== 'ready' || !L || !mapRef.current) return;

    if (value) {
      if (markerRef.current) {
        markerRef.current.setLatLng(value);
      } else {
        markerRef.current = L.marker(value, { draggable: !disabled }).addTo(mapRef.current);
      }
      setLatInput(String(value.lat));
      setLngInput(String(value.lng));
    } else if (markerRef.current) {
      markerRef.current = null;
    }
  }, [value, status, disabled]);

  const emitPoint = React.useCallback((lat: number, lng: number) => {
    onChangeRef.current?.({ type: 'Point', coordinates: [lng, lat] });
  }, []);

  const recenter = () => {
    const target = value ?? DEFAULT_CENTER;
    mapRef.current?.setView(target, 15);
    mapRef.current?.invalidateSize();
  };

  const applyManualCoordinates = () => {
    const lat = Number(latInput);
    const lng = Number(lngInput);
    if (latInput.trim() === '' || lngInput.trim() === '') {
      setCoordError('Both latitude and longitude are required.');
      return;
    }
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      setCoordError('Latitude must be between -90 and 90.');
      return;
    }
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      setCoordError('Longitude must be between -180 and 180.');
      return;
    }
    setCoordError(null);
    emitPoint(lat, lng);
    mapRef.current?.setView({ lat, lng }, 15);
  };

  const clearPoint = () => {
    onChange(null);
    setLatInput('');
    setLngInput('');
    setCoordError(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Map canvas */}
      <div className="relative overflow-hidden rounded-lg border border-input bg-muted">
        <div
          ref={containerRef}
          className={cn(
            'h-[280px] w-full',
            // Leaflet needs a defined height; give it a subtle grid backdrop while loading.
            status === 'loading' && 'map-grid'
          )}
          aria-label="Map location picker"
        />

        {status === 'loading' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading map…
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted px-6 text-center">
            <AlertCircle className="h-6 w-6 text-warning" />
            <p className="text-sm font-medium text-foreground">Map unavailable</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              The interactive map could not load. You can still enter the
              coordinates manually below.
            </p>
          </div>
        )}

        {status === 'ready' && (
          <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={recenter}
              className="h-9 w-9 shadow-sm"
              aria-label="Recenter map"
              disabled={disabled}
            >
              <Crosshair className="h-4 w-4" />
            </Button>
            {value && (
              <Button
                type="button"
                variant="softDestructive"
                size="icon"
                onClick={clearPoint}
                className="h-9 w-9 shadow-sm"
                aria-label="Clear selected location"
                disabled={disabled}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {value
          ? `Pin placed at ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
          : 'Click anywhere on the map to drop a pin, or enter coordinates below.'}
      </p>

      {/* Coordinate inputs (always available, even if the map fails) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="latitude" className="text-xs font-medium text-muted-foreground">
            Latitude
          </label>
          <Input
            id="latitude"
            inputMode="decimal"
            placeholder="e.g. 23.8103"
            value={latInput}
            onChange={(e) => {
              setLatInput(e.target.value);
              setCoordError(null);
            }}
            disabled={disabled}
            aria-invalid={!!coordError}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="longitude" className="text-xs font-medium text-muted-foreground">
            Longitude
          </label>
          <Input
            id="longitude"
            inputMode="decimal"
            placeholder="e.g. 90.4125"
            value={lngInput}
            onChange={(e) => {
              setLngInput(e.target.value);
              setCoordError(null);
            }}
            disabled={disabled}
            aria-invalid={!!coordError}
          />
        </div>
      </div>

      {coordError ? (
        <p className="text-xs text-danger">{coordError}</p>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={applyManualCoordinates}
          disabled={disabled || (!latInput && !lngInput)}
          className="w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Use these coordinates
        </Button>
      )}

      {onAddressChange && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-xs font-medium text-muted-foreground">
            Address / Landmark <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="address"
            placeholder="e.g. Banani Road 11, near the metro station"
            value={address ?? ''}
            onChange={(e) => onAddressChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}