import { Entity } from './Entity.js'
import type { SpotifyClient } from '../client.js'
import type { Api } from '../api.types.js'
import { Track } from './Track.entity.js'

@Entity
export class Recommendations {
  constructor(private readonly client: SpotifyClient, private readonly raw: Api.Recommendations) {}

  getTracks() {
    return this.raw.tracks.map(v => this.client.wrap(Track, v))
  }
}
