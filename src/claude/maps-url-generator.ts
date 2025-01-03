interface Location {
  name: string;
  coordinates: string;
}

interface Destination extends Location {
  order: number;
}

export interface TravelPlan {
  startingPoint: Location;
  destinations: Destination[];
  returnToStart: boolean;
}

export function generateGoogleMapsUrl(travelPlan: TravelPlan): string {
  console.log('[GoogleMapsUrlGenerator] Generating GoogleMaps URL...');
  const baseUrl = 'https://www.google.com/maps/dir/?api=1';

  // Get origin coordinates
  const origin = encodeURIComponent(travelPlan.startingPoint.coordinates);

  // Sort destinations by order and get coordinates
  const sortedDestinations = [...travelPlan.destinations].sort(
    (a, b) => a.order - b.order
  );

  // Get final destination (last waypoint)
  const destination = encodeURIComponent(
    travelPlan.returnToStart
      ? travelPlan.startingPoint.coordinates
      : sortedDestinations[sortedDestinations.length - 1].coordinates
  );

  // Get waypoints (all destinations except the last one)
  const waypoints = sortedDestinations
    .slice(0, travelPlan.returnToStart ? undefined : -1)
    .map((dest) => encodeURIComponent(dest.coordinates))
    .join('|');

  // Construct URL
  const url = `${baseUrl}&origin=${origin}&destination=${destination}${
    waypoints ? `&waypoints=${waypoints}` : ''
  }&travelmode=driving`;

  console.log('[GoogleMapsUrlGenerator] GoogleMaps URL generated!');
  return url;
}
