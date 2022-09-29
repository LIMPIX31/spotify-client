export interface SpotifyUri {
  /**
   * Unique Spotify Uri for this object
   * * Pattern: spotify:type:id
   * * Example: *"spotify:track:11dFghVXANMlKmJXsNCbNl"*
   */
  get spotifyUri(): string
}
