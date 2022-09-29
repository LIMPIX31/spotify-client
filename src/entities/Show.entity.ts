import type { SpotifyClient } from '../client.js'
import type { Api } from '../api.types.js'
import { Entity } from './Entity.js'
import { SpotifyUri } from '../interfaces/SpotifyUri.js'

@Entity
export class Show implements SpotifyUri {
  readonly type = 'show'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Show) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}