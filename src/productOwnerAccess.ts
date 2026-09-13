import { canEditMissionCatalog } from './domain'
import { isVisitorPreview } from './visitorPreview'

/** Die zeitlich begrenzte Besuchsversion enthält niemals Elenas Redaktionswerkzeuge. */
export function canUseProductOwnerTools(
  profileId: string,
  pathname = window.location.pathname,
): boolean {
  return !isVisitorPreview(pathname) && canEditMissionCatalog(profileId)
}
