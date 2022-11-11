import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Entity } from './Entity'
import { SpotifyUri } from '../interfaces/SpotifyUri'

@Entity
export class Episode implements SpotifyUri {
  readonly type = 'episode'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Episode) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
