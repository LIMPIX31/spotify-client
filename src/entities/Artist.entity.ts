import { Entity } from './Entity.js'
import type { SpotifyClient } from '../client.js'
import type { Api } from '../api.types.js'
import { SpotifyUri } from '../interfaces/SpotifyUri.js'

@Entity
export class Artist implements SpotifyUri {
  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Artist) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
