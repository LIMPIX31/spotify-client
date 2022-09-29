import type { SpotifyClient } from '../client.js'
import type { Api } from '../api.types.js'
import { Entity } from './Entity.js'
import { Album } from './Album.entity.js'
import type { SpotifyUri } from '../interfaces/SpotifyUri.js'

@Entity
export class Track implements SpotifyUri {
  readonly type = 'track'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Track) {}

  /**
   * Get the album of the track
   */
  getAlbum() {
    return this.client.wrap(Album, this.raw.album)
  }

  /**
   * Gets full information about all the artists of this track
   */
  getArtists() {
    return Promise.all(this.raw.artists.map(v => this.client.getArtist(v.id)))
  }

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
