import { Entity } from './Entity'
import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Track } from './Track.entity'

@Entity
export class Recommendations {
  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Recommendations) {}

  getTracks() {
    return this.raw.tracks.map(v => this.client.wrap(Track, v))
  }
}
