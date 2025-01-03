const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

interface GeocodingApiResponseResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  admin3_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
}

interface GeocodingApiResponse {
  results: GeocodingApiResponseResult[];
}
enum TemperatureUnit {
  C = '°C',
  F = '°F',
}
enum IsDay {
  NIGHT = 0,
  DAY = 1,
}

/** External API response (to api.open-meteo.com) */
interface BaseWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
}
interface CurrentWeatherApiResponse extends BaseWeatherApiResponse {
  current_units: {
    time: string;
    interval: string;
    temperature_2m: TemperatureUnit;
    is_day: string;
    weather_code: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    is_day: IsDay;
    weather_code: keyof typeof WEATHER_CODES;
  };
}
interface DailyWeatherApiResponse extends BaseWeatherApiResponse {
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: TemperatureUnit;
    temperature_2m_min: TemperatureUnit;
  };
  daily: {
    /** time format: "2025-01-03" */
    time: string[];
    weather_code: (keyof typeof WEATHER_CODES)[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

/** Our weather response */
interface CurrentWeatherResponse {
  district: string;
  city: string;
  country: string;
  temperature: CurrentWeatherApiResponse['current']['temperature_2m'];
  weather: (typeof WEATHER_CODES)[keyof typeof WEATHER_CODES] | 'Unknown';
  unit: CurrentWeatherApiResponse['current_units']['temperature_2m'];
}
interface ForecastWeatherResponse {
  district: string;
  city: string;
  country: string;
  forecast: {
    temperatureMax: DailyWeatherApiResponse['daily']['temperature_2m_max'][0];
    temperatureMin: DailyWeatherApiResponse['daily']['temperature_2m_min'][0];
    weather: (typeof WEATHER_CODES)[keyof typeof WEATHER_CODES] | 'Unknown';
    unit: DailyWeatherApiResponse['daily_units']['temperature_2m_max'];
  }[];
}

/** match the city or country found in result with the expected ones */
function matchResult(actual: string | undefined, expected: string): boolean {
  return Boolean(actual?.toLowerCase().includes(expected.toLowerCase()));
}

export interface GetWeatherByLocationArguments {
  city: string;
  country: string;
  district?: string;
}

export class WeatherService {
  generateGeocodeUrl(name: string): string {
    return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=3`;
  }

  async getLocationData({
    city,
    country,
    district,
  }: GetWeatherByLocationArguments): Promise<GeocodingApiResponseResult | null> {
    // Search by district or city
    const locationName = district || city;
    const geocodeUrl = this.generateGeocodeUrl(locationName);

    try {
      console.log("[WeatherService] Receiving geolocation data...")
      const geoResponse = await fetch(geocodeUrl);
      const geoData = (await geoResponse.json()) as GeocodingApiResponse;

      if (!geoData.results?.length) {
        return null;
      }

      // Find result that matches both district and city
      const location =
        geoData.results.find(
          (result) =>
            result.name.toLowerCase() === locationName.toLowerCase() &&
            (matchResult(result.admin1, city) ||
              matchResult(result.admin2, city) ||
              matchResult(result.admin3, city)) &&
            matchResult(result.country, country)
        ) || geoData.results[0];

      return location;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to fetch location data: ${JSON.stringify(error)}`
      );
    }
  }

  async getCurrentWeatherByLocation({
    city,
    country,
    district,
  }: GetWeatherByLocationArguments): Promise<CurrentWeatherResponse | null> {
    try {
      const location = await this.getLocationData({ city, country, district });
      if (!location) return null;

      const { latitude, longitude } = location;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData =
        (await weatherResponse.json()) as CurrentWeatherApiResponse;

      return {
        city,
        country: location.country,
        district: location.name,
        temperature: weatherData.current.temperature_2m,
        unit: weatherData.current_units.temperature_2m,
        weather: WEATHER_CODES[weatherData.current.weather_code] || 'Unknown',
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch weather data: ${JSON.stringify(error)}`);
    }
  }

  async getWeatherForecastByLocation({
    city,
    country,
    district,
  }: GetWeatherByLocationArguments): Promise<ForecastWeatherResponse | null> {
    try {
      const location = await this.getLocationData({ city, country, district });
      if (!location) return null;

      console.log('[WeatherService] Receiving weather forecast...');
      const { latitude, longitude } = location;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData =
        (await weatherResponse.json()) as DailyWeatherApiResponse;

      const forecast: ForecastWeatherResponse['forecast'] =
        weatherData.daily.time.map((_date, index) => ({
          temperatureMax: weatherData.daily.temperature_2m_max[index],
          temperatureMin: weatherData.daily.temperature_2m_min[index],
          time: weatherData.daily.time[index],
          unit: weatherData.daily_units.temperature_2m_max,
          weather:
            WEATHER_CODES[weatherData.daily.weather_code[index]] || 'Unknown',
        }));
      return {
        city,
        country: location.country,
        district: location.name,
        forecast,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch weather data: ${JSON.stringify(error)}`);
    }
  }
}
