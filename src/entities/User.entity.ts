import type { Api, Query } from '../api.types.js'
import type { SpotifyClient } from '../client.js'
import { Entity } from './Entity.js'
import { SpotifyUri } from '../interfaces/SpotifyUri.js'

@Entity
export class User implements SpotifyUri {
  readonly type = 'user'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.User) {}

  /**
   * Get a list of the playlists owned or followed by this user
   * * Refers to {@link SpotifyClient#getUserPlaylists}
   * @param query - Additional query params
   */
  async getPlaylists(query?: Query.Pagination) {
    return this.client.getUserPlaylists(this.raw.id, query)
  }

  /**
   * Get all playlists owned or followed by this user
   * * Refers to {@link SpotifyClient#getUserPlaylists}
   */
  async getAllPlaylists() {
    return this.client.getAllUserPlaylists(this.raw.id)
  }

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
