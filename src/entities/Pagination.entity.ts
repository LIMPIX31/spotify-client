import type { SpotifyClient } from '../client'
import type { Api } from '../api.types'
import { Entity } from './Entity'
import type { Constructor } from '../types'

@Entity
export class Pagination<I, A> {
  constructor(
    private readonly client: SpotifyClient,
    private raw: Api.Pagination<A>,
    private readonly target: Constructor<I> | object) {}

  private async _next() {
    this.raw = await this.client.get<Api.Pagination<A>>(this.raw.next!)
  }

  private get wrappedItems(): (I & A)[] {
    return this.raw.items.map(i => this.client.wrap((this.target as any)[(i as any).type] ?? this.target, i)) as (A & I)[]
  }

  async* [Symbol.asyncIterator](): AsyncIterator<I & A> {
    for (const playlist of this.wrappedItems) yield playlist
    while (this.raw.next !== null) {
      await this._next()
      for (const playlist of this.wrappedItems) yield playlist
    }
  }
}
