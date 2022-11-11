import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Entity } from './Entity'
import { SpotifyUri } from '../interfaces/SpotifyUri'

@Entity
export class Show implements SpotifyUri {
  readonly type = 'show'

  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Show) {}

  get spotifyUri(): string {
    return this.client.createSpotifyUri(this.raw)
  }
}
