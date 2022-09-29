import { createSpotifyUri, resolveId, resolveUris, unfactorizeValue, unwrapAwaitable } from './utils.js'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Axca from 'axios-cache-adapter'
import { Api, Paginated, Query, Response } from './api.types.js'
import type { Awaitable, Constructor, ConstructorMapUnion, FactoryValue } from './types.js'
import { Album, Artist, Episode, Pagination, Playlist, RecentPlayedItem, Show, Track, User } from './entities/index.js'
import { PlaylistItem } from './entities/index.js'
import { Recommendations } from './entities/Recommendations.entity.js'

export interface SpotifyClientOptions {
  /**
   * Initial access token. It may not be passed,
   * in which case it will be retrieved immediately
   * with the refresh token. The only argument in
   * favor of passing the token is that it saves
   * one extra request during client initialization.
   */
  accessToken?: FactoryValue<string>
  /**
   * Required to refresh the access token
   */
  refreshToken: FactoryValue<string>
  /**
   * Refresh function should return a new access token
   * @param token - refresh token
   */
  refresh?: (token: string) => Awaitable<string>
}

export class SpotifyClient {
  private at?: string
  private rt?: string

  private _axiosInstance?: AxiosInstance

  constructor(private readonly options: SpotifyClientOptions) {
    if (!options.refreshToken) throw new Error('Refresh token is not provided')
    if (!options.refresh) console.warn('No token refresh function is provided. As soon as the access token expires, the client will terminate.')
  }

  /**
   * Gets instance for requests
   */
  get instance() {
    if (!this._axiosInstance) throw new Error('Http instance requested before initialization')
    return this._axiosInstance
  }

  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.request<T, R, D>(config)
  }

  get<R, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.get<R>(url, config).then(v => v.data)
  }

  delete<R, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.delete<R>(url, config).then(v => v.data)
  }

  head<R, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.head<R>(url, config).then(v => v.data)
  }

  post<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.post<R>(url, data, config).then(v => v.data)
  }

  put<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.put<R>(url, data, config).then(v => v.data)
  }

  patch<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.instance.patch<R>(url, data, config).then(v => v.data)
  }

  /**
   * Initializes client
   * @protected
   */
  async initialize() {
    if (this._axiosInstance) throw new Error('Already initialized')
    this.rt = await unfactorizeValue(this.options.refreshToken)
    if (this.options.accessToken)
      this.at = await unfactorizeValue(this.options.accessToken)
    else await this.refresh()
    this._axiosInstance = Axca.setup({
      baseURL: 'https://api.spotify.com/v1',
      cache: {
        maxAge: 30 * 60 * 1000,
      },
    })
    this.instance.interceptors.request.use(config => {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${this.at}`
      return config
    })
    this.instance.interceptors.response.use(
      config => config,
      async error => {
        const originalRequest = error.config
        if (error.response) {
          if (error.response.status === 401 && error.config && !error.config._isRetry) {
            originalRequest._isRetry = true
            try {
              await this.refresh()
            } catch (e: any) {
              throw new Error(`Failed to refresh token. Reason: ${e.message}`)
            }
            return this.instance.request(originalRequest)
          }
        }
        throw error
      },
    )
  }

  async refresh() {
    if (!this.rt) throw Error('Attempt to refresh when token is undefined')
    try {
      this.rt = await unwrapAwaitable(this.options.refresh?.(this.rt))
    } catch (e: any) {
      throw new Error(`Failed to refresh token. Reason: ${e.message}`)
    }
  }

  wrap<T extends object, R>(constructor: Constructor<T>, raw: R): T & R {
    return Object.assign(new constructor(this, raw, constructor), raw)
  }

  wrapPagination<R extends object, A extends object>
  (target: Constructor<R>, raw: Paginated<A>): Pagination<R, A> & Paginated<A> {
    return Object.assign(new Pagination(this, raw, target), raw)
  }

  wrapPaginationUnion<R extends object, A extends object>
  (target: R, raw: Paginated<A>): Pagination<ConstructorMapUnion<R>, A> & Paginated<A> {
    return Object.assign(new Pagination<ConstructorMapUnion<R>, A>(this, raw, target), raw)
  }

  async collectPagination<I extends object, A>(iter: Pagination<I, A>) {
    const items: (I & A)[] = []
    for await (const item of iter) items.push(item)
    return items
  }

  /**
   * Generates Spotify Uri from object.
   * Usually you don't need to call this method manually, because most objects have a similar method
   * * Example output: *"spotify:track:11dFghVXANMlKmJXsNCbNl"*
   * @param object
   */
  createSpotifyUri(object: Api.Basic) {
    return createSpotifyUri(object)
  }

  /**
   * Gets the current user
   */
  async getThisUser() {
    return this.wrap(User, await this.get<Response.GetMe>('/me'))
  }

  /**
   * Get public profile information about a Spotify user
   * @param id - The user's Spotify user ID. Example: smedjan
   */
  async getUser(id: string) {
    return this.wrap(User, await this.get<Response.GetUser>(`/users/${id}`))
  }

  /**
   * Get a playlist owned by a Spotify user.
   * @param id - The Spotify ID of the playlist. Example: 3cEYpjA9oz9GiPac4AsH4n
   * @param query - Additional query params
   */
  async getPlaylist(id: string, query?: Query.Market) {
    return this.wrap(Playlist, await this.get<Response.GetPlaylist>(`/playlists/${id}`, { params: query }))
  }

  /**
   * Get Spotify catalog information for a single track identified by its unique Spotify ID
   * @param id - The Spotify ID for the track. Example: 11dFghVXANMlKmJXsNCbNl
   * @param query - Additional query params
   */
  async getTrack(id: string, query?: Query.Market) {
    return this.wrap(Track, await this.get<Response.GetTrack>(`/tracks/${id}`, { params: query }))
  }

  /**
   * Get Spotify catalog information for a single album
   * @param id - The Spotify ID of the album. Example: 4aawyAB9vmqN3uQ7FjRGTy
   * @param query - Additional query params
   */
  async getAlbum(id: string, query?: Query.Market) {
    return this.wrap(Album, await this.get<Response.GetAlbum>(`/albums/${id}`, { params: query }))
  }

  /**
   * Get a list of the playlists owned or followed by the current Spotify user
   * @param query - Additional query params
   */
  async getClientPlaylists(query?: Query.Pagination) {
    return this.wrapPagination(Playlist, await this.get<Response.GetPlaylists>('/me/playlists', { params: query }))
  }

  /**
   * Get all playlists owned or followed by the current Spotify user
   */
  async getAllClientPlaylists() {
    return this.collectPagination(await this.getClientPlaylists({ limit: 50 }))
  }

  /**
   * Get a list of the playlists owned or followed by a Spotify user
   * @param id - The user's Spotify user ID. Example: smedjan
   * @param query - Additional query params
   */
  async getUserPlaylists(id: string, query?: Query.Pagination) {
    return this.wrapPagination(Playlist, await this.get<Response.GetPlaylists>(`/users/${id}/playlists`, { params: query }))
  }

  /**
   * Get all playlists owned or followed by a Spotify user
   * @param id - The user's Spotify user ID. Example: smedjan
   */
  async getAllUserPlaylists(id: string) {
    return this.collectPagination(await this.getUserPlaylists(id, { limit: 50 }))
  }

  /**
   *
   * @param id - The Spotify ID for the episode. Example: 512ojhOuo1ktJprKbVcKyQ
   * @param query - Additional query params
   */
  async getEpisode(id: string, query?: Query.Market) {
    return this.wrap(Episode, await this.get<Response.GetEpisode>(`/episodes/${id}`, { params: query }))
  }

  /**
   * Get Spotify catalog information for a single show identified by its unique Spotify ID.
   * @param id - The Spotify ID for the show. Example: 38bS44xjbVVZ3No3ByF1dJ
   * @param query - Additional query params
   */
  async getShow(id: string, query?: Query.Market) {
    return this.wrap(Show, await this.get<Response.GetShow>(`/shows/${id}`, { params: query }))
  }

  /**
   * Get full details of the items of a playlist owned by a Spotify user
   * @param id - The Spotify ID of the playlist. Example: 3cEYpjA9oz9GiPac4AsH4n
   * @param query - Additional query params
   */
  async getPlaylistItems(id: string, query?: Query.Composite) {
    return this.wrapPagination(PlaylistItem, await this.get<Response.GetPlaylistItems>(`/playlists/${id}/tracks`, { params: query }))
  }

  /**
   * Get full details of the ALL items of a playlist owned by a Spotify user
   * @param id - The Spotify ID of the playlist. Example: 3cEYpjA9oz9GiPac4AsH4n
   * @param query - Additional query params
   */
  async getAllPlaylistItems(id: string, query?: Query.MarketTypes) {
    return this.collectPagination(await this.getPlaylistItems(id, query))
  }

  /**
   * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
   * @param id - Additional query params
   */
  async getArtist(id: string) {
    return this.wrap(Artist, await this.get<Response.GetArtist>(`/artists/${id}`))
  }

  /**
   * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
   *
   * For artists and tracks that are very new or obscure there might not be enough data to generate a list of tracks.
   * @param query - Required query params
   */
  async getRecommendations(query: Query.Recommendations) {
    return this.wrap(Recommendations, await this.get<Response.GetRecommendations>('/recommendations', {
      params: {
        ...query,
        seed_artists: query?.seed_artists?.join(','),
        seed_genres: query?.seed_genres?.join(','),
        seed_tracks: query?.seed_tracks?.join(','),
      },
    }))
  }

  /**
   * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
   *
   * @partial This method is not fully implemented
   */
  async getClientRecentlyPlayedTracks(query?: Query.Recently) {
    return this.wrapPagination(RecentPlayedItem, await this.get<Response.GetRecentlyPlayedTracks>('/me/player/recently-played', { params: query }))
  }

  /**
   * Get ALL tracks from the current user's recently played tracks
   */
  async getAllClientRecentlyPlayedTracks() {
    return this.collectPagination(await this.getClientRecentlyPlayedTracks({ limit: 50 }))
  }

  /**
   * Add an item to the end of the user's current playback queue.
   * @premium This API Call requires premium account
   * @partial This method is not fully implemented
   * @param uri - The uri of the item to add to the queue. Must be a track or an episode uri.
   * @param device_id - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   */
  async addItemInPlaybackQueue(uri: string, device_id?: string) {
    await this.post('/me/player/queue', null, { params: { uri, device_id } })
  }

  /**
   * Add one or more items to a user's playlist.
   * @param playlist - Playlist to add
   * @param items - Items to add
   * @param position - Position to add
   */
  async addItemsToPlaylist<T extends string | Api.Track>(playlist: string | Api.Basic<'playlist'>, items: T | T[], position?: number) {
    const uris = resolveUris(items)
    const playlistId = resolveId(playlist)
    return this.post<Response.AddItemsToPlaylist>(`/playlists/${playlistId}/tracks`, { uris, position })
  }
}
