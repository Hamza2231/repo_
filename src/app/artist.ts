export interface IArtist{
  id: number,
  image_url: string,
  name: string,
  Artistevents: [{ EventVenue: string , EventCity: string , EventCountry: string , EventDate: string }]
}
