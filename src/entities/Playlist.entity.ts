import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Entity } from './Entity'
import type { Query } from '../api.types'
import { SpotifyUri } from '../interfaces/SpotifyUri'

@Entity
export class Playlist implements SpotifyUri {
  readonly type = 'playlist'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Playlist) {}

  /**
   * Get full details of the items of a playlist owned by a Spotify user
   * * Refers to {@link SpotifyClient#getPlaylistItems}
   * @param query - Additional query params
   */
  getItems(query?: Query.Composite) {
    return this.client.getPlaylistItems(this.raw.id, query)
  }

  /**
   * Get full details of the items of a playlist owned by a Spotify user
   * * Refers to {@link SpotifyClient#getAllPlaylistItems}
   * @param query - Additional query params
   */
  getAllItems(query?: Query.MarketTypes){
    return this.client.getAllPlaylistItems(this.raw.id, query)
  }

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
