import type { SpotifyClient } from '../client.js'
import type { Api } from '../api.types.js'
import { Entity } from './Entity.js'
import { SpotifyUri } from '../interfaces/SpotifyUri.js'

@Entity
export class Album implements SpotifyUri {
  readonly type = 'album'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Album) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
