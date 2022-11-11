import { Range } from './types'
import type * as Entity from './entities'

export namespace Api {
  export interface Basic<T extends string = string> {
    /**
     * The object type
     */
    type: T
    /**
     * The Spotify ID for this object
     */
    id: string
    /**
     * A link to the Web API endpoint providing full details of the object
     */
    href: string
    /**
     * The Spotify URI for the object
     */
    uri: string
  }

  export interface SpotifyImage {
    /**
     * The source URL of the image
     */
    url: string
    /**
     * The image height in pixels.
     */
    width: number
    /**
     * The image width in pixels.
     */
    height: number
  }

  export interface Followers {
    /**
     * This will always be set to null, as the Web API does not support it at the moment
     */
    href: null
    /**
     * The total number of followers
     */
    total: number
  }

  export interface Followable {
    /**
     * Information about the followers of the user
     */
    followers: Followers
  }

  export interface SpotifyExternalUrl {
    /**
     * The Spotify URL for the object
     */
    spotify: string
  }

  export interface ExternalUrls {
    /**
     * Known external URLs for this object
     */
    external_urls: SpotifyExternalUrl
  }

  export interface Images {
    /**
     * The object images
     */
    images: SpotifyImage[]
  }

  export interface Name {
    /**
     * The name of the object
     */
    name: string
  }

  export interface DisplayName {
    /**
     * The name displayed on the object. `null` if not available.
     */
    display_name: string | null
  }

  export interface AvailableMarkets {
    /**
     * The markets in which the object is available:
     * **`ISO 3166-1 alpha-2`** country codes.
     * * NOTE FOR ALBUM: An album is considered available in a
     * market when at least 1 of its tracks is available in that market.
     */
    available_markets: string[]
  }

  export interface ResitrictionsReason {
    /**
     * The reason for the restriction.
     * Objects may be restricted if the content is not available
     * in a given market, to the user's subscription type, or when
     * the user's account is set to not play explicit content.
     * Additional reasons may be added in the future
     */
    reason: 'market' | 'product' | 'explicit'
  }

  export interface Restrictions {
    /**
     * Included in the response when a content restriction is applied
     */
    restrictions: ResitrictionsReason
  }

  export interface Popularity {
    /**
     * The popularity of the artist, album, track, etc...
     * The value will be between 0 and 100,
     * with 100 being the most popular.
     *
     * * NOTE FOR ARTIST: The artist's popularity is calculated from the popularity of all the artist's tracks.
     */
    popularity: number
  }

  export interface ExternalIds {
    /**
     * International Standard Recording Code
     */
    isrc: string
    /**
     * International Article Number
     */
    ean: string
    /**
     * Universal Product Code
     */
    upc: string
  }

  export interface CountInfo {
    /**
     * A link to the Web API endpoint returning the full result of the request
     */
    href: string
    /**
     * The total number of items available to return
     */
    total: number
  }

  export interface Pagination<T> extends CountInfo {
    /**
     * The requested content
     */
    items: T[]
    /**
     * The maximum number of items in the response (as set in the query or by default)
     */
    limit: number
    /**
     * URL to the next page of items. (`null` if none)
     */
    next: string | null
    /**
     * The offset of the items returned (as set in the query or by default)
     */
    offset: number
    /**
     * URL to the previous page of items. (`null` if none)
     */
    previous: string | null
  }

  export interface UserExplicitContentType {
    /**
     * When `true`, indicates that explicit content should not be played.
     */
    filter_enabled: boolean
    /**
     * When `true`, indicates that the explicit content setting is locked and can't be changed by the user.
     */
    filter_locked: boolean
  }

  export interface Duration {
    /**
     * The track or episode length in milliseconds
     */
    duration_ms: number
  }

  export interface ExplicitContent {
    /**
     * The user's explicit content settings.
     * This field is only available when the
     * current user has granted access to the
     * user-read-private scope.
     */
    explicit_content: UserExplicitContentType
  }

  export interface IsExplicit {
    /**
     * Whether the track or episode has explicit lyrics/content (`true` = yes it does; `false` = no it does not OR unknown).
     */
    explicit: boolean
  }

  export interface Release {
    /**
     * The date the album, episode, etc...  was first released
     */
    release_date: string
    /**
     * The precision with which release_date value is known
     */
    release_date_precision: 'year' | 'month' | 'day'
  }

  export interface Playable {
    /**
     * If `true`, the track/episode is playable in the given market. Otherwise, `false`.
     */
    is_playable: boolean
  }

  export type PartialUser<T extends Basic> = Basic<T['type']> &  Name & ExternalUrls

  export interface Artist extends Basic<'artist'>, Name, ExternalUrls, Followable, Images, Popularity {
    /**
     * A list of the genres the artist is associated with. If not yet classified, the array is empty.
     */
    genres: string[]
  }

  export interface Album extends Basic<'album'>, Name, ExternalUrls, Images, AvailableMarkets, Restrictions, Release {
    /**
     * The type of the album
     */
    album_type: 'album' | 'single' | 'compilation'
    /**
     * The number of tracks in the album
     */
    total_tracks: number
    /**
     * The artists of the album. Each artist object includes a link in href to more detailed information about the artist
     */
    artists: PartialUser<Artist>[]
    /**
     * The tracks of the album.
     */
    tracks: Pagination<Track>
  }

  export interface IsLocal {
    /**
     * Whether the track is from a local file.
     */
    is_local: boolean
  }

  export interface Track extends Basic<'track'>, Name, AvailableMarkets, ExternalUrls, Popularity, Duration, IsExplicit, Playable, IsLocal {
    /**
     * The album on which the track appears. The album object includes a link in href to full information about the album
     */
    album: Album
    /**
     * The artists who performed the track. Each artist object includes a link in href to more detailed information about the artist
     */
    artists: PartialUser<Artist>[]
    /**
     * The disc number (usually 1 unless the album consists of more than one disc)
     */
    disc_number: number
    /**
     * Known external IDs for the track
     */
    external_ids: ExternalIds
    /**
     * Part of the response when Track Relinking is applied,
     * and the requested track has been replaced with different track.
     * The track in the linked_from object contains information about
     * the originally requested track.
     */
    linked_from: Track
    /**
     * A link to a 30-second preview (MP3 format) of the track. Can be `null`
     */
    preview_url: string | null
    /**
     * The number of the track. If an album has several discs, the track number is the number on the specified disc.
     */
    track_number: number
  }

  export interface Playlist<T extends Pagination<Track> | CountInfo = Pagination<Track>>
    extends Basic<'playlist'>, Name, Followable, Images, ExternalUrls {
    /**
     * `true` if the owner allows other users to modify the playlist.
     */
    collaborative: boolean
    /**
     * The playlist description. Only returned for modified, verified playlists, otherwise `null`.
     */
    description: string | null
    /**
     * The user who owns the playlist
     */
    owner: PartialUser<User>
    /**
     * The playlist's public/private status: true the playlist is public,
     * false the playlist is private, null the playlist status is not
     * relevant. For more about public/private status, see Working with Playlists
     */
    public: boolean
    /**
     * The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version
     */
    snapshot_id: string
    /**
     * The tracks of the playlist
     */
    tracks: T
  }

  export interface User extends Basic<'user'>, Images, Followable, ExternalUrls, DisplayName, ExplicitContent {
    /**
     * The country of the user, as set in the user's account profile
     * An ISO 3166-1 alpha-2 country code. This field is only available
     * when the current user has granted access to the user-read-private scope.
     */
    country: string
    /**
     * The user's email address, as entered by the user when creating their account.
     * **Important!** This email address is unverified; there is no proof that it
     * actually belongs to the user. This field is only available when the current
     * user has granted access to the user-read-email scope.
     */
    email: string
    /**
     * The user's Spotify subscription level: "premium", "free", etc.
     * (The subscription level "open" can be considered the same as "free".)
     * This field is only available when the current user has granted access to the user-read-private scope.
     */
    product: 'premium' | 'free' | 'open'
  }

  export interface ResumePointType {
    /**
     * Whether the episode has been fully played by the user.
     */
    fully_played: boolean
    /**
     * The user's most recent position in the episode in milliseconds.
     */
    resume_position_ms: number
  }

  export interface Description {
    /**
     * A description of the episode.
     * HTML tags are stripped away from this field,
     * use html_description field in case HTML tags are needed.
     */
    description: string
    /**
     * A description of the episode. This field may contain HTML tags.
     */
    html_description: string
  }

  export interface CopyrightData {
    /**
     * The copyright text for this content.
     */
    text: string
    /**
     * The type of copyright: C = the copyright, P = the sound recording (performance) copyright.
     */
    type: 'C' | 'P'
  }

  export interface Copyrights {
    /**
     * The copyright statements of the object.
     */
    copyrights: CopyrightData
  }

  export interface Languages {
    /**
     * A list of the languages used in the episode/show, identified by their ISO 639-1 code.
     */
    languages: string[]
  }

  export interface LanguageLegacy {
    /**
     * The language used in the episode/show, identified by a ISO 639 code.
     * This field is deprecated and might be removed in the future.
     * Please use the languages field instead.
     * @deprecated
     */
    language: string
  }

  export interface IsExternallyHosted {
    /**
     * True if the episode is hosted outside of Spotify's CDN.
     */
    is_externally_hosted: boolean
  }

  export interface Episode extends
    Basic<'episode'>,
    Followable,
    ExternalUrls,
    Duration,
    IsExplicit,
    Images,
    Name,
    Playable,
    Release,
    Description,
    Languages,
    LanguageLegacy,
    IsExternallyHosted {
    /**
     * A URL to a 30-second preview (MP3 format) of the episode. null if not available.
     */
    audio_preview_url: string | null
    /**
     * The user's most recent position in the episode.
     * Set if the supplied access token is a user token and has the scope 'user-read-playback-position'.
     */
    resume_point: ResumePointType

    show: Show
  }

  export interface Show<T extends Pagination<Episode> | CountInfo = Pagination<Episode>> extends
    Basic<'show'>,
    AvailableMarkets,
    Name,
    IsExplicit,
    ExternalUrls,
    Images,
    Copyrights,
    Languages,
    IsExternallyHosted,
    Description {
    /**
     * The media type of the show.
     */
    media_type: string
    /**
     * The publisher of the show
     */
    publisher: string
    /**
     * The episodes of the show
     */
    episodes: T
  }

  export interface PlaylistItem<> extends IsLocal {
    added_at: string
    added_by: PartialUser<User>
    primary_color: string | null
    track?: Track
    episode?: Episode
  }

  export interface RecommendationsSeeds {
    /**
     * The number of tracks available after min_* and max_* filters have been applied.
     */
    afterFilteringSize: number
    /**
     * The number of tracks available after relinking for regional availability.
     */
    afterRelinkingSize: number
    /**
     * A link to the full track or artist data for this seed.
     * For tracks this will be a link to a Track Object. For artists a link to an Artist Object. For genre seeds, this value will be null.
     */
    href: string
    /**
     * The id used to select this seed. This will be the same as the string used in the seed_artists, seed_tracks or seed_genres parameter.
     */
    id: string
    /**
     * The number of recommended tracks available for this seed.
     */
    initialPoolSize: number
    /**
     * The entity type of this seed. One of artist, track or genre.
     */
    type: 'artist' | 'track' | 'genre'
  }

  export interface Recommendations {
    /**
     * An array of recommendation seed objects.
     */
    seeds: RecommendationsSeeds
    /**
     * An array of track object (simplified) ordered according to the parameters supplied.
     */
    tracks: Track[]
  }

  export interface RecentPlayedItem {
    track: Track
    episode: Episode
    played_at: string
    context: null
  }

  export interface SnapshotId {
    snapshot_id: string
  }
}

export namespace Query {
  export interface Market {
    /**
     * An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.
     * If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
     * Note: If neither market nor user country are provided, the content is considered unavailable for the client.
     * Users can view the country that is associated with their account in the account settings.
     */
    market?: string
  }

  export interface AdditionalTypes {
    /**
     * A comma-separated list of item types that your client supports besides the default **`track`** type. Valid types are: **`track`** and **`episode`**.
     * Note: This parameter was introduced to allow existing clients to maintain their current behaviour and might be deprecated in the future.
     * In addition to providing this parameter, make sure that your client properly handles cases of new types in the future by checking against the type field of each object.
     */
    additional_types?: 'track' | 'episode' | 'track,episode'
  }

  export interface Pagination {
    limit?: Range<1, 51>
    offset?: number
  }

  export type Composite = Pagination & Market & AdditionalTypes

  export type MarketTypes = Market & AdditionalTypes

  export interface Recently {
    /**
     * The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
     */
    limit?: Range<1, 51>
    /**
     * A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If after is specified, before must not be specified.
     */
    after?: number
    /**
     * A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If before is specified, after must not be specified.
     */
    before?: number
  }

  export interface Recommendations extends Market, Pagination {
    /**
     * A list of Spotify IDs for seed artists.
     * Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
     */
    seed_artists?: string[]
    /**
     * A list of any genres in the set of available genre seeds.
     * Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
     */
    seed_genres?: string[]
    /**
     * A  list of Spotify IDs for a seed track.
     * Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
     */
    seed_tracks?: string[]
    max_acousticness?: number
    max_danceability?: number
    max_duration_ms?: number
    max_energy?: number
    max_instrumentalness?: number
    max_key?: number
    max_liveness?: number
    max_loudness?: number
    max_mode?: number
    max_popularity?: number
    max_speechiness?: number
    max_tempo?: number
    max_time_signature?: number
    max_valence?: number
    min_acousticness?: number
    min_danceability?: number
    min_duration_ms?: number
    min_energy?: number
    min_instrumentalness?: number
    min_key?: number
    min_liveness?: number
    min_loudness?: number
    min_mode?: number
    min_popularity?: number
    min_speechiness?: number
    min_tempo?: number
    min_time_signature?: number
    min_valence?: number
    target_acousticness?: number
    target_danceability?: number
    target_duration_ms?: number
    target_energy?: number
    target_instrumentalness?: number
    target_key?: number
    target_liveness?: number
    target_loudness?: number
    target_mode?: number
    target_popularity?: number
    target_speechiness?: number
    target_tempo?: number
    target_time_signature?: number
    target_valence?: number
  }
}

export namespace I10n {
  export type User = Entity.User & Api.User
  export type Track = Entity.Track & Api.Track
  export type Album = Entity.Album & Api.Album
  export type Artist = Entity.Artist & Api.Artist
  export type Playlist = Entity.Playlist & Api.Playlist
  export type Show = Entity.Show & Api.Show
  export type Episode = Entity.Episode & Api.Episode
  export type PlaylistItem = Entity.PlaylistItem & Api.PlaylistItem
  export type RecentlyPlayedItem = Entity.RecentPlayedItem & Api.RecentPlayedItem
}

export type Paginated<T> = Api.Pagination<T>

export namespace Response {
  export type GetMe = Api.User
  export type GetUser = Api.User
  export type GetPlaylist = Api.Playlist
  export type GetTrack = Api.Track
  export type GetAlbum = Api.Album
  export type GetEpisode = Api.Episode
  export type GetShow = Api.Show
  export type GetPlaylists = Paginated<Api.Playlist<Api.CountInfo>>
  export type GetPlaylistItems = Paginated<Api.PlaylistItem>
  export type GetArtist = Api.Artist
  export type GetRecommendations = Api.Recommendations
  export type GetRecentlyPlayedTracks = Paginated<Api.RecentPlayedItem>
  export type AddItemsToPlaylist = Paginated<Api.SnapshotId>
}
