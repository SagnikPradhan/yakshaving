export class ConfigurationSource {
  #map = new Map<string, unknown[]>();

  get ( key: string ) {
    return this.#map.get( key )
  }

  add ( key: string, value: unknown ) {
    const array = this.#map.get( key )
    if ( array ) array.push( value )
    else this.#map.set( key, [value] )
  }
}
