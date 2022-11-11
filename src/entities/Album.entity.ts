import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Entity } from './Entity'
import { SpotifyUri } from '../interfaces/SpotifyUri'

@Entity
export class Album implements SpotifyUri {
  readonly type = 'album'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Album) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
