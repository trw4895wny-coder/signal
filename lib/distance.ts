/**
 * Calculate distance between two coordinates using the Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Filter posts by distance from user's location
 */
export function filterPostsByDistance(
  posts: any[],
  userLat: number,
  userLon: number,
  maxDistance: number
): any[] {
  return posts.filter((post) => {
    // If post has no location, exclude it
    if (!post.latitude || !post.longitude) {
      return false
    }

    const distance = calculateDistance(
      userLat,
      userLon,
      post.latitude,
      post.longitude
    )

    return distance <= maxDistance
  })
}
