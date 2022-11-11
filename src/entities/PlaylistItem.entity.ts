import { Entity } from './Entity'
import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Track } from './Track.entity'
import { Episode } from './Episode.entity'

@Entity
export class PlaylistItem {
  constructor(private readonly client: SpotifyClient, private readonly raw: Api.PlaylistItem) {}

  get content() {
    if (this.raw.track)
      return this.client.wrap(Track, this.raw.track)
    else if (this.raw.episode)
      return this.client.wrap(Episode, this.raw.episode)
    else throw new Error('No track or episode in playlist item. It\'s API problem')
  }
}
