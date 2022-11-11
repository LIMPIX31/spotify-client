import { Entity } from './Entity'
import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { SpotifyUri } from '../interfaces/SpotifyUri'

@Entity
export class Artist implements SpotifyUri {
  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Artist) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
