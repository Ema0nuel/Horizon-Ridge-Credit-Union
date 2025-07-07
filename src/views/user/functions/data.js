export async function getGeoLocation(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    return {
      city: data.city,
      region: data.region,
      country: data.country_name,
    };
  } catch (err) {
    return {
      city: '',
      region: '',
      country: '',
    };
  }
}