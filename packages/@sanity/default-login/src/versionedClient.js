import sanityClient from 'part:@sanity/base/client'

/**
 * Only for use inside of @sanity/default-login
 * Don't import this from external modules.
 *
 * @internal
 */
export const versionedClient = sanityClient.withConfig({
  apiVersion: '1',
})
